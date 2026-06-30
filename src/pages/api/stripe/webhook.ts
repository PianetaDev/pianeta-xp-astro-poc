import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { getStripe } from '@/lib/server/stripe';
import { supabaseService } from '@/lib/server/supabase';
import { renderSubscriptionEmail } from '@/lib/server/hire-us-email';
import { ga4Send } from '@/lib/server/ga4';
import { env, SITE_URL } from '@/lib/server/env';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  // CRITICAL: raw body (text) for signature verification — do not use request.json()
  const rawBody = await request.text();
  if (!sig || !rawBody) return new Response('missing sig/body', { status: 400 });

  const stripe = getStripe();
  const webhookSecret = env('STRIPE_WEBHOOK_SECRET_HIRE_US');

  let evt: Stripe.Event;
  try {
    evt = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (e: any) {
    console.error('Webhook signature verification failed', e.message);
    return new Response('invalid signature', { status: 400 });
  }

  try {
    switch (evt.type) {
      case 'checkout.session.completed': {
        const session = evt.data.object as Stripe.Checkout.Session;
        if (session.metadata?.source === 'hire-us-alba' && session.mode === 'subscription') {
          await handleNewHireUsSubscription(stripe, session);
        } else if (session.metadata?.source === 'hire') {
          await handleHireOrder(session);
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = evt.data.object as Stripe.Subscription;
        await handleSubscriptionLifecycle(sub, evt.type);
        break;
      }
      case 'invoice.payment_failed': {
        const inv = evt.data.object as Stripe.Invoice;
        await handleInvoiceFailure(inv);
        break;
      }
    }
  } catch (e: any) {
    console.error('Webhook handler error:', e);
  }

  return new Response(JSON.stringify({ received: true }), { headers: { 'content-type': 'application/json' } });
};

async function handleNewHireUsSubscription(stripe: Stripe, session: Stripe.Checkout.Session) {
  const sub = await stripe.subscriptions.retrieve(session.subscription as string);
  const customer = await stripe.customers.retrieve(session.customer as string, { expand: ['tax_ids'] }) as Stripe.Customer;

  const sb = supabaseService();
  await sb.from('hire_us_subscriptions').upsert({
    stripe_subscription_id: sub.id,
    stripe_customer_id: customer.id,
    email: customer.email!,
    formula: session.metadata?.formula || 'team-as-a-service',
    status: sub.status,
    current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
    metadata: session.metadata,
    alba_session_id: session.metadata?.alba_session_id || null,
  }, { onConflict: 'stripe_subscription_id' });

  const portal = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${SITE_URL}/hire-us`,
  });

  const resend = new Resend(env('RESEND_API_KEY'));
  await resend.emails.send({
    from: 'Pianeta noreply <noreply@pianeta.studio>',
    to: 'info@pianeta.studio',
    subject: `🎉 Nuova subscription Hire Us — ${customer.email}`,
    html: renderSubscriptionEmail({ session, sub, customer, portalUrl: portal.url }),
  });
}

// Ordine /hire (Sito Green · Sprint · TaaS) → registra il "won" in engine_leads.
// Source of truth del "ha pagato" per la superficie hire (prima viveva nell'engine).
async function handleHireOrder(session: Stripe.Checkout.Session) {
  const sb = supabaseService();
  await sb.from('engine_leads').insert({
    tenant: 'pianeta',
    channel: 'direct',
    landing: 'hire',
    offer_slug: session.metadata?.offer ?? null,
    email: session.customer_details?.email ?? null,
    name: session.customer_details?.name ?? null,
    status: 'won',
    message: 'Acquisto completato via Stripe',
    meta: {
      amount_total: session.amount_total,
      currency: session.currency,
      mode: session.mode,
      session: session.id,
      payment_status: session.payment_status,
    },
  });

  // Conversione lato server → GA4 (affidabile: scatta a pagamento confermato, non dal browser).
  const gaClientId = session.metadata?.ga_client_id;
  if (gaClientId) {
    const offerSlug = session.metadata?.offer ?? 'offerta';
    await ga4Send(gaClientId, [{
      name: 'purchase',
      params: {
        transaction_id: session.id,
        currency: (session.currency ?? 'eur').toUpperCase(),
        value: (session.amount_total ?? 0) / 100,
        items: [{ item_id: offerSlug, item_name: offerSlug, quantity: 1 }],
      },
    }]);
  }

  const resend = new Resend(env('RESEND_API_KEY'));
  await resend.emails.send({
    from: 'Pianeta noreply <noreply@pianeta.studio>',
    to: 'info@pianeta.studio',
    subject: `🎉 Nuovo ordine /hire — ${session.metadata?.offer ?? 'offerta'} · ${session.customer_details?.email ?? ''}`,
    html: `<p>Acquisto completato.</p><p>Offerta: <strong>${session.metadata?.offer ?? '—'}</strong><br>Cliente: ${session.customer_details?.email ?? '—'}<br>Importo: ${((session.amount_total ?? 0) / 100).toFixed(2)} ${(session.currency ?? 'eur').toUpperCase()} (${session.mode})</p>`,
  }).catch((e) => console.error('[hire-order] email error:', e));
}

async function handleSubscriptionLifecycle(sub: Stripe.Subscription, eventType: string) {
  const sb = supabaseService();
  const updates: any = {
    status: sub.status,
    current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
  };
  if (eventType === 'customer.subscription.deleted') {
    updates.canceled_at = new Date().toISOString();
  }
  await sb.from('hire_us_subscriptions').update(updates).eq('stripe_subscription_id', sub.id);
}

async function handleInvoiceFailure(inv: Stripe.Invoice) {
  if (!(inv as any).subscription) return;
  const resend = new Resend(env('RESEND_API_KEY'));
  await resend.emails.send({
    from: 'Pianeta noreply <noreply@pianeta.studio>',
    to: 'info@pianeta.studio',
    subject: `⚠️ Pagamento subscription fallito — ${inv.customer_email}`,
    html: `<p>Pagamento fallito per subscription ${(inv as any).subscription}. Customer: ${inv.customer_email}. Importo: ${(inv.amount_due / 100).toFixed(2)} ${inv.currency.toUpperCase()}.</p><p>Stripe sta riprovando automaticamente. Contatta il cliente se persiste.</p>`,
  });
}

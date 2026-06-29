import type { APIRoute } from 'astro';
import { getStripe } from '@/lib/server/stripe';
import { offerBySlug } from '@/data/offers';

export const prerender = false;

const BRAND = 'Pianeta.Studio';

export const POST: APIRoute = async ({ request, url }) => {
  let body: any = {};
  try { body = await request.json(); } catch { /* empty */ }
  const slug = body.offer ?? url.searchParams.get('offer');
  const locale = (body.locale ?? url.searchParams.get('locale')) === 'en' ? 'en' : 'it';
  const base = locale === 'en' ? '/en/hire' : '/hire';
  const offer = slug ? offerBySlug(slug, locale) : undefined;
  if (!offer) return json({ error: 'offerta sconosciuta' }, 400);
  if (!offer.stripe) return json({ error: 'offerta a preventivo, nessun checkout' }, 400);

  let stripe;
  try { stripe = getStripe(); } catch { return json({ error: 'stripe non configurato' }, 503); }

  const price = {
    currency: 'eur',
    unit_amount: offer.stripe.amount,
    product_data: { name: `${offer.name} — ${BRAND}` },
    ...(offer.stripe.mode === 'subscription'
      ? { recurring: { interval: offer.stripe.recurring ?? 'month' } }
      : {}),
  } as any;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: offer.stripe.mode,
      line_items: [{ price_data: price, quantity: 1 }],
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: 'required',
      success_url: `${url.origin}${base}/grazie?offer=${offer.slug}`,
      cancel_url: `${url.origin}${base}/${offer.slug}`,
      metadata: { source: 'hire', offer: offer.slug },
    });
    return json({ ok: true, url: session.url });
  } catch (e: any) {
    return json({ error: e?.message || 'errore checkout' }, 400);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

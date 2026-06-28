import type { APIRoute } from 'astro';
import { getStripe } from '@/lib/server/stripe';
import { env, SITE_URL } from '@/lib/server/env';

export const prerender = false;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => ({})) as { formula?: string; albaSessionId?: string };
  if (body.formula !== 'team-as-a-service') return json({ error: 'invalid formula' }, 400);

  const priceId = env('STRIPE_PRICE_TEAM_AAS_4K');
  if (!priceId) return json({ error: 'price not configured' }, 500);

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${SITE_URL}/hire-us/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/hire-us?canceled=1`,
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    billing_address_collection: 'required',
    locale: 'it',
    metadata: {
      source: 'hire-us-alba',
      formula: 'team-as-a-service',
      alba_session_id: body.albaSessionId || '',
    },
  });

  return json({ url: session.url, sessionId: session.id });
};

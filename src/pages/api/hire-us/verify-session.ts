import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/server/stripe';

export const prerender = false;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'missing id' }, 400);

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(id, { expand: ['customer'] });
  if (session.payment_status !== 'paid' && session.status !== 'complete') {
    return json({ ok: false });
  }
  const customer = session.customer as Stripe.Customer | null;
  return json({
    ok: true,
    name: customer?.name?.split(' ')[0] || '',
    email: customer?.email || '',
  });
};

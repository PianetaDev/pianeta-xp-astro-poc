import type { APIRoute } from 'astro';
import { getStripe } from '@/lib/server/stripe';
import { SITE_URL } from '@/lib/server/env';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const customerId = url.searchParams.get('customer');
  if (!customerId) return new Response('missing customer', { status: 400 });

  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${SITE_URL}/hire-us`,
  });
  return Response.redirect(portal.url, 302);
};

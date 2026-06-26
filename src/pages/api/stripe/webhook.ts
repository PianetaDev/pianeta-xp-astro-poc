import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  if (!sig) return new Response('Missing signature', { status: 400 });
  // TODO: verify signature + dispatch events. Stub during migration.
  return new Response(JSON.stringify({ received: true, stub: true }), { headers: { 'content-type': 'application/json' } });
};

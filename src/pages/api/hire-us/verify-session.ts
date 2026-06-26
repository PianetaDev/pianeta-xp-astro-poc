import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  // TODO: verify Stripe checkout session id. Stub.
  return new Response(JSON.stringify({ ok: true, stub: true, body }), { headers: { 'content-type': 'application/json' } });
};

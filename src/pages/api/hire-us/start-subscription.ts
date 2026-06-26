import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // TODO: create Stripe checkout session for Team-as-a-Service. Stub.
  const body = await request.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: true, stub: true, sessionUrl: null, body }), { headers: { 'content-type': 'application/json' } });
};

import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // TODO: Stripe billing portal session. Stub.
  const body = await request.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: true, stub: true, portalUrl: null, body }), { headers: { 'content-type': 'application/json' } });
};

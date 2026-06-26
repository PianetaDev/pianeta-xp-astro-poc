import type { APIRoute } from 'astro';
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token');
  if (!token) {
    return new Response(JSON.stringify({ error: 'token required' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }
  // TODO: load preferences for token. Stub.
  return new Response(JSON.stringify({ ok: true, preferences: {} }), { headers: { 'content-type': 'application/json' } });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    // TODO: persist preferences. Stub.
    return new Response(JSON.stringify({ ok: true, body }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'internal' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};

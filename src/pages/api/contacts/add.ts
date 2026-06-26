import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  // TODO: wire Resend audience contacts (add). Stub during migration.
  if ('POST' === 'GET') {
    return new Response(JSON.stringify({ ok: true, contacts: [], audience: url.searchParams.get('audience') }), { headers: { 'content-type': 'application/json' } });
  }
  const body = await request.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: true, action: 'add', body }), { headers: { 'content-type': 'application/json' } });
};

import type { APIRoute } from 'astro';
export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  // TODO: wire Resend audience contacts (list). Stub during migration.
  if ('GET' === 'GET') {
    return new Response(JSON.stringify({ ok: true, contacts: [], audience: url.searchParams.get('audience') }), { headers: { 'content-type': 'application/json' } });
  }
  const body = await request.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: true, action: 'list', body }), { headers: { 'content-type': 'application/json' } });
};

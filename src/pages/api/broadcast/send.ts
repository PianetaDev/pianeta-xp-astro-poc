import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const auth = request.headers.get('authorization') || '';
  const secret = import.meta.env.NARRATOR_SECRET || process.env.NARRATOR_SECRET || '';
  if (!secret || !auth.includes(secret)) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }
  // TODO: dispatch via Resend broadcasts. Stub during migration.
  const body = await request.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: true, queued: true, body }), { headers: { 'content-type': 'application/json' } });
};

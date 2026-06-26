import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body as any)?.email;
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'email required' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    // TODO: wire Supabase + Resend audience. Stubbed during Astro 5 migration.
    return new Response(JSON.stringify({ ok: true, pending: true, email }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'internal' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};

import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    // TODO: validate + persist to Supabase + send Resend emails. Stub.
    return new Response(JSON.stringify({ ok: true, stub: true, body }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'internal' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};

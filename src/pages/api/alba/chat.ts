import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    // TODO: wire Anthropic + KB + hire-us prompt. Stub during migration.
    return new Response(JSON.stringify({
      ok: true,
      stub: true,
      reply: 'Alba is currently offline during migration. Try again soon.',
      received: body,
    }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'internal' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};

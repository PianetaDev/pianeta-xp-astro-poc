import type { APIRoute } from 'astro';
import { albaSupabase } from '../../../lib/server/alba/supabase';

export const prerender = false;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface EventPayload {
  uid?: string;
  session_id?: string;
  event: string;
  variant?: string;
  payload?: Record<string, unknown>;
}

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => null)) as EventPayload | null;
  if (!body || typeof body.event !== 'string' || body.event.length === 0) {
    return new Response(null, { status: 204 });
  }
  if (body.uid && !UUID_RE.test(body.uid)) {
    return new Response(null, { status: 204 });
  }

  try {
    await albaSupabase().from('alba_events').insert({
      uid: body.uid ?? null,
      session_id: body.session_id ?? null,
      event: body.event,
      variant: body.variant ?? null,
      payload: body.payload ?? null,
    });
  } catch {
    // Fire-and-forget — never fail the client
  }
  return new Response(null, { status: 204 });
};

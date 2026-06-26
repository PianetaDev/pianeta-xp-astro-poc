import type { APIRoute } from 'astro';
import { albaSupabase } from '../../../lib/server/alba/supabase';
import type { AlbaSessionInit, AbVariant } from '../../../lib/alba/session-types';

export const prerender = false;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null) as { uid?: string; page_origin?: string } | null;
  if (!body || !body.uid || !UUID_RE.test(body.uid)) {
    return jsonResponse({ error: 'invalid uid' }, 400);
  }

  const sb = albaSupabase();
  const now = new Date().toISOString();

  const { data: existing, error: selErr } = await sb
    .from('alba_users')
    .select('uid, ab_variant')
    .eq('uid', body.uid)
    .maybeSingle();

  if (selErr) return jsonResponse({ error: 'db read failed' }, 500);

  let abVariant: AbVariant;
  let isNew = false;

  if (existing) {
    abVariant = existing.ab_variant as AbVariant;
    await sb.from('alba_users').update({ last_seen_at: now }).eq('uid', body.uid);
  } else {
    abVariant = Math.random() < 0.5 ? 'proactive' : 'reactive';
    isNew = true;
    const { error: insErr } = await sb.from('alba_users').insert({
      uid: body.uid,
      ab_variant: abVariant,
      first_seen_at: now,
      last_seen_at: now,
    });
    if (insErr) return jsonResponse({ error: 'db insert failed' }, 500);
  }

  const { data: session, error: sessErr } = await sb
    .from('alba_sessions')
    .insert({ uid: body.uid, page_origin: body.page_origin ?? null })
    .select('id')
    .single();

  if (sessErr || !session) return jsonResponse({ error: 'session create failed' }, 500);

  const payload: AlbaSessionInit = {
    uid: body.uid,
    session_id: session.id,
    ab_variant: abVariant,
    is_new_user: isNew,
  };
  return jsonResponse(payload);
};

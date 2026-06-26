import type { APIRoute } from 'astro';
import { albaSupabase } from '../../../lib/server/alba/supabase';

export const prerender = false;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GDPR Art. 15 — Restituisce tutto il dato collegato all'uid
export const GET: APIRoute = async ({ url }) => {
  const uid = url.searchParams.get('uid');
  if (!uid || !UUID_RE.test(uid)) {
    return new Response(JSON.stringify({ error: 'invalid uid' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  const sb = albaSupabase();
  const [user, sessions, events] = await Promise.all([
    sb.from('alba_users').select('*').eq('uid', uid).maybeSingle(),
    sb.from('alba_sessions').select('*').eq('uid', uid).order('started_at', { ascending: false }),
    sb.from('alba_events').select('*').eq('uid', uid).order('ts', { ascending: false }),
  ]);

  const sessionIds = (sessions.data ?? []).map((s) => s.id);
  let messages: unknown[] = [];
  if (sessionIds.length > 0) {
    const { data } = await sb.from('alba_messages').select('*').in('session_id', sessionIds).order('ts', { ascending: true });
    messages = data ?? [];
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    uid,
    user: user.data ?? null,
    sessions: sessions.data ?? [],
    messages,
    events: events.data ?? [],
    retentionPolicy: { months: 24, deletedAfter: 'data più vecchi vengono cancellati automaticamente dopo 24 mesi' },
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'content-disposition': `attachment; filename="alba-export-${uid.slice(0, 8)}.json"`,
    },
  });
};

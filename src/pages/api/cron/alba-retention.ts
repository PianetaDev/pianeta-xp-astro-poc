import type { APIRoute } from 'astro';
import { albaSupabase } from '../../../lib/server/alba/supabase';

export const prerender = false;

// Cron mensile: cancella alba_messages, alba_events, alba_sessions chiuse oltre i 24 mesi.
// Trigger Vercel cron: 0 4 1 * * (1° del mese alle 4 UTC) — vedi vercel.json
export const GET: APIRoute = async ({ request }) => {
  const expected = process.env.CRON_SECRET || process.env.NARRATOR_SECRET || '';
  const auth = request.headers.get('authorization') || '';
  if (!expected || auth !== `Bearer ${expected}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }

  const cutoff = new Date(Date.now() - 24 * 30 * 24 * 60 * 60 * 1000).toISOString();
  const sb = albaSupabase();

  const deletions: Record<string, number> = {};

  const evts = await sb.from('alba_events').delete().lt('ts', cutoff).select('id', { count: 'exact', head: true });
  deletions.events = (evts as any).count ?? 0;

  const msgs = await sb.from('alba_messages').delete().lt('ts', cutoff).select('id', { count: 'exact', head: true });
  deletions.messages = (msgs as any).count ?? 0;

  const sess = await sb.from('alba_sessions').delete().lt('started_at', cutoff).select('id', { count: 'exact', head: true });
  deletions.sessions = (sess as any).count ?? 0;

  return new Response(JSON.stringify({ ok: true, cutoff, deletions }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

import type { APIRoute } from 'astro';
import { albaSupabase } from '../../../lib/server/alba/supabase';

export const prerender = false;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cancella user + cascade (sessions, messages, events). GDPR Art. 17.
export const DELETE: APIRoute = async ({ request, url }) => {
  const uid = url.searchParams.get('uid');
  const email = url.searchParams.get('email');

  if (uid) {
    if (!UUID_RE.test(uid)) return new Response(JSON.stringify({ error: 'invalid uid' }), { status: 400, headers: { 'content-type': 'application/json' } });
    const sb = albaSupabase();
    await sb.from('alba_events').delete().eq('uid', uid);
    await sb.from('alba_users').delete().eq('uid', uid);
    return new Response(null, { status: 204 });
  }
  if (email) {
    const sb = albaSupabase();
    // Trova uid per email, poi cascade
    const { data } = await sb.from('alba_users').select('uid').eq('email', email);
    if (data && data.length > 0) {
      const uids = data.map(r => r.uid);
      await sb.from('alba_events').delete().in('uid', uids);
      await sb.from('alba_users').delete().in('uid', uids);
    }
    return new Response(null, { status: 204 });
  }

  return new Response(JSON.stringify({ error: 'uid or email required' }), { status: 400, headers: { 'content-type': 'application/json' } });
};

// Permette POST per browser sender-beacon API
export const POST: APIRoute = async (ctx) => DELETE(ctx);

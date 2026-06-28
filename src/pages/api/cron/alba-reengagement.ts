import type { APIRoute } from 'astro';
import { albaSupabase } from '../../../lib/server/alba/supabase';

export const prerender = false;

/**
 * Vercel cron — runs every 6h.
 * Scansiona alba_users con email NOT NULL e followup_sent_at NULL
 * il cui first_seen_at è tra 48h e 7gg fa, e che NON hanno fatto
 * call_booked né handoff_to_max DOPO l'email_captured.
 *
 * Per ognuno: notifica Max su Slack (#ops-sales) con uid, email,
 * primo messaggio utente, ultima pagina visitata. Setta followup_sent_at
 * per evitare ri-notifiche.
 *
 * Secret: header `authorization: Bearer <CRON_SECRET>` (fallback NARRATOR_SECRET).
 */
export const GET: APIRoute = async ({ request }) => {
  const expected = process.env.CRON_SECRET || process.env.NARRATOR_SECRET || '';
  const auth = request.headers.get('authorization') || '';
  if (!expected || auth !== `Bearer ${expected}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }

  const sb = albaSupabase();
  const now = Date.now();
  const FROM = new Date(now - 7 * 86400_000).toISOString();    // 7gg fa
  const TO = new Date(now - 48 * 3600_000).toISOString();      // 48h fa

  // 1) Trova candidati: email NOT NULL, followup_sent_at NULL, first_seen tra 7gg e 48h fa
  const { data: candidates, error: candErr } = await sb
    .from('alba_users')
    .select('uid, email, first_name, first_seen_at, last_seen_at')
    .not('email', 'is', null)
    .is('followup_sent_at', null)
    .gte('first_seen_at', FROM)
    .lte('first_seen_at', TO);

  if (candErr) {
    return new Response(JSON.stringify({ error: 'candidates query failed', detail: candErr.message }), { status: 500 });
  }
  if (!candidates || candidates.length === 0) {
    return new Response(JSON.stringify({ ok: true, scanned: 0, notified: 0, message: 'no candidates' }));
  }

  // 2) Per ognuno, filtra quelli che NON hanno call_booked o handoff_to_max
  const uids = candidates.map((c: any) => c.uid);
  const { data: closingEvents } = await sb
    .from('alba_events')
    .select('uid, event')
    .in('uid', uids)
    .in('event', ['call_booked', 'handoff_to_max', 'recap_email_sent']);
  const closedUids = new Set((closingEvents || []).map((e: any) => e.uid));

  const pending = candidates.filter((c: any) => !closedUids.has(c.uid));
  if (pending.length === 0) {
    return new Response(JSON.stringify({ ok: true, scanned: candidates.length, notified: 0, message: 'all candidates have already closed' }));
  }

  // 3) Per ogni pending: prendi il primo messaggio utente + ultima pagina + topic
  const slackWebhook = process.env.SLACK_ALBA_WEBHOOK;
  let notified = 0;
  const errors: string[] = [];

  for (const u of pending) {
    try {
      const { data: firstUserMsg } = await sb
        .from('alba_messages')
        .select('content, ts')
        .eq('uid', u.uid)
        .eq('role', 'user')
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();

      const { data: lastEvent } = await sb
        .from('alba_events')
        .select('payload, event, ts')
        .eq('uid', u.uid)
        .in('event', ['popup_shown', 'floater_clicked', 'page_suggested'])
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      const firstAsk = (firstUserMsg?.content || '').slice(0, 240);
      const lastUrl = (lastEvent?.payload as any)?.url || '?';

      if (slackWebhook) {
        const text = `🔁 *Re-engagement Alba* — lead silente da 48h+`;
        const blocks = [
          { type: 'header', text: { type: 'plain_text', text: '🔁 Lead silente da 48h+' } },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Email:*\n${u.email}` },
              { type: 'mrkdwn', text: `*Nome:*\n${u.first_name || '_(non dato)_'}` },
              { type: 'mrkdwn', text: `*Prima visita:*\n${new Date(u.first_seen_at).toLocaleString('it-IT')}` },
              { type: 'mrkdwn', text: `*Ultima pagina:*\n${lastUrl}` },
            ],
          },
          { type: 'section', text: { type: 'mrkdwn', text: `*Primo messaggio*:\n> ${firstAsk || '_(nessuno)_'}` } },
          {
            type: 'actions',
            elements: [
              { type: 'button', text: { type: 'plain_text', text: 'Apri sessione (admin)' }, url: `https://xp.pianeta.studio/admin/alba/leads?key=${process.env.NARRATOR_SECRET || ''}&uid=${u.uid}` },
              { type: 'button', text: { type: 'plain_text', text: '✉️ Scrivi al lead' }, url: `mailto:${u.email}?subject=Riprendiamo%20il%20discorso` },
            ],
          },
          { type: 'context', elements: [{ type: 'mrkdwn', text: '_Re-engagement automatico — Alba non scrive al lead, decidi tu come ripartire._' }] },
        ];
        const res = await fetch(slackWebhook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text, blocks }),
        });
        if (!res.ok) {
          errors.push(`slack ${res.status} for ${u.uid}: ${(await res.text()).slice(0, 100)}`);
          continue; // non setto followup_sent_at se Slack ha fallito → riproverà al prossimo cron
        }
      }

      // 4) Setta followup_sent_at SOLO se Slack OK (o webhook assente — comunque marca per non fare spam)
      await sb.from('alba_users').update({ followup_sent_at: new Date().toISOString() }).eq('uid', u.uid);
      await sb.from('alba_events').insert({
        uid: u.uid, session_id: null, event: 'reengagement_notified',
        payload: { channel: slackWebhook ? 'slack' : 'noop', email: u.email },
      });
      notified++;
    } catch (e: any) {
      errors.push(`uid=${u.uid}: ${e?.message}`);
    }
  }

  return new Response(JSON.stringify({ ok: true, scanned: candidates.length, pending: pending.length, notified, errors }), {
    headers: { 'content-type': 'application/json' },
  });
};

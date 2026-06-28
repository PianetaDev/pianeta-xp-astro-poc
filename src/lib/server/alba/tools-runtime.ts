// Executor server-side per i tool dichiarati nel registry.
// Ogni tool ritorna un AlbaToolResult che il chat endpoint inserisce
// come tool_result nella conversazione, poi rilancia Anthropic.

import { albaSupabase } from './supabase';
import { getKb } from './assets';
import { createGoogleCalendarEvent } from './google-calendar';
import * as chrono from 'chrono-node';

export interface AlbaToolResult {
  ok: boolean;
  data?: unknown;
  human_summary?: string; // Cosa Alba dovrebbe dire all'utente
  error?: string;
}

// ---------- search_kb ----------
async function searchKb(args: { query: string; sections?: string[]; top_k?: number }): Promise<AlbaToolResult> {
  if (!args.query || typeof args.query !== 'string') {
    return { ok: false, error: 'query mancante' };
  }
  const kb = await getKb();
  const q = args.query.toLowerCase();
  const sectionsFilter = Array.isArray(args.sections) && args.sections.length > 0 ? new Set(args.sections) : null;
  const topK = Math.min(Math.max(args.top_k ?? 5, 1), 12);

  const scored = kb.entries
    .filter(e => !sectionsFilter || sectionsFilter.has(e.section))
    .map(e => {
      const hay = (e.body + ' ' + (e.tags || []).join(' ')).toLowerCase();
      const tokens = q.split(/\s+/).filter(t => t.length > 2);
      const hits = tokens.filter(t => hay.includes(t)).length;
      return { entry: e, score: hits };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return {
    ok: true,
    data: scored.map(s => ({
      section: s.entry.section,
      slug: s.entry.slug,
      snippet: s.entry.body.slice(0, 600),
      source: `${s.entry.section}/${s.entry.slug}`,
      score: s.score,
    })),
  };
}

// ---------- book_call ----------
function buildCalUrl(slot?: string, topic?: string): string {
  const base = process.env.CAL_COM_URL || 'https://cal.com/maxmauro/30min';
  const params = new URLSearchParams();
  if (topic) params.set('name', topic.slice(0, 80));
  if (slot) params.set('notes', `Slot proposto: ${slot}`);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

async function bookCall(
  args: { user_email: string; user_name?: string; topic: string; preferred_slot?: string; preferred_window?: string },
  ctx: { uid: string; session_id: string }
): Promise<AlbaToolResult> {
  // Validazione minima email (server-side)
  if (!args.user_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.user_email)) {
    return { ok: false, error: 'user_email mancante o non valida — chiedi all\'utente la sua email prima di richiamare il tool' };
  }

  const sb = albaSupabase();

  // Parse preferred_slot (es. "lunedì alle 15", "30 giugno 14:30") via chrono-node IT
  let parsedStart: Date | null = null;
  if (args.preferred_slot) {
    const results = chrono.it.parse(args.preferred_slot, new Date(), { forwardDate: true });
    if (results.length > 0 && results[0].start) parsedStart = results[0].start.date();
  }

  // Se abbiamo un orario parsabile, prova a creare l'evento direttamente su Google Calendar
  let gcalResult: { ok: boolean; event_id?: string; html_link?: string; meet_url?: string; error?: string } | null = null;
  if (parsedStart) {
    const endDate = new Date(parsedStart.getTime() + 30 * 60 * 1000); // 30 min
    gcalResult = await createGoogleCalendarEvent({
      summary: `Pianeta.Studio ↔ ${args.user_name || args.user_email} · ${args.topic}`,
      description: `Brief Alba (sessione ${ctx.session_id.slice(0, 8)})\n\n${args.topic}\n\nContatto utente: ${args.user_email}\nLink conversazione export: /api/alba/export-my-data?uid=${ctx.uid}`,
      start: parsedStart.toISOString(),
      end: endDate.toISOString(),
      timeZone: 'Europe/Rome',
      attendees: [args.user_email, process.env.ALBA_CALENDAR_OWNER_EMAIL || 'max@pianeta.studio'],
      addMeet: true,
    });
  }

  const url = buildCalUrl(args.preferred_slot || args.preferred_window, args.topic);

  // 1) Salva email + nome sull'user
  try {
    await sb.from('alba_users').update({
      email: args.user_email,
      first_name: args.user_name ?? null,
    }).eq('uid', ctx.uid);
  } catch { /* fire-and-forget */ }

  // 2) Manda email-brief a Max (e CC all'utente) via Resend
  const resendKey = process.env.RESEND_API_KEY;
  let emailSent = false;
  let emailError: string | null = null;
  if (resendKey) {
    const slotLine = args.preferred_slot
      ? `**Slot suggerito dall'utente**: ${args.preferred_slot} *(non garantito — Max sceglie da Cal.com)*`
      : args.preferred_window
      ? `**Finestra preferita**: ${args.preferred_window}`
      : `**Slot**: nessuno proposto — l'utente sceglierà da Cal.com`;
    const brief = [
      `Contatto da Alba (AI di gruppo · sessione ${ctx.session_id.slice(0, 8)}).`,
      '',
      `**Da**: ${args.user_name ? args.user_name + ' — ' : ''}${args.user_email}`,
      `**Topic**: ${args.topic}`,
      slotLine,
      '',
      `**Link Cal.com agenda**: ${url}`,
      '',
      `Per esportare la conversazione completa: GET /api/alba/export-my-data?uid=${ctx.uid}`,
    ].join('\n');
    try {
      const ownerEmail = process.env.ALBA_CALENDAR_OWNER_EMAIL || 'max@pianeta.studio';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'authorization': `Bearer ${resendKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: 'Alba — Pianeta.Studio <alba@pianeta.studio>',
          to: [ownerEmail],
          cc: [args.user_email],
          reply_to: args.user_email,
          subject: `Nuovo contatto da Alba — ${args.user_name ?? args.user_email}`,
          text: brief,
        }),
      });
      emailSent = res.ok;
      if (!res.ok) emailError = `resend ${res.status}: ${(await res.text()).slice(0, 200)}`;
    } catch (e: any) {
      emailError = `fetch failed: ${e?.message}`;
    }
  }

  // 3) Log eventi (email_captured + call_booked)
  try {
    await sb.from('alba_events').insert([
      { uid: ctx.uid, session_id: ctx.session_id, event: 'email_captured', payload: { email: args.user_email, source: 'book_call' } },
      { uid: ctx.uid, session_id: ctx.session_id, event: 'call_booked', payload: { topic: args.topic, slot: args.preferred_slot ?? null, window: args.preferred_window ?? null, url, email_sent: emailSent, gcal_event_id: gcalResult?.event_id ?? null, gcal_ok: gcalResult?.ok ?? null } },
    ]);
  } catch { /* fire-and-forget */ }

  // Costruisci summary in base a cosa è andato a buon fine
  const summaryParts: string[] = [];
  if (gcalResult?.ok) {
    summaryParts.push(`Evento Google Calendar creato per ${parsedStart!.toLocaleString('it-IT', { dateStyle: 'full', timeStyle: 'short' })}`);
    if (gcalResult.meet_url) summaryParts.push(`Google Meet: ${gcalResult.meet_url}`);
    if (gcalResult.html_link) summaryParts.push(`Evento: ${gcalResult.html_link}`);
    summaryParts.push(`Invito mandato automaticamente a ${args.user_email} e a Max`);
  } else {
    if (gcalResult && !gcalResult.ok) summaryParts.push(`(Google Calendar non disponibile: ${gcalResult.error}. Fallback a link Cal.com.)`);
    summaryParts.push(emailSent ? `Email brief mandata a Max e a ${args.user_email}` : `Email NON inviata`);
    summaryParts.push(`Agenda Max: ${url}`);
    if (args.preferred_slot) summaryParts.push(`Suggerimento utente "${args.preferred_slot}" passato a Max`);
  }

  return {
    ok: true,
    data: {
      cal_url: url,
      slot: args.preferred_slot ?? null,
      email_sent: emailSent,
      user_email: args.user_email,
      gcal: gcalResult ?? null,
      parsed_start: parsedStart?.toISOString() ?? null,
    },
    human_summary: summaryParts.join(' · '),
  };
}

// ---------- send_brief_email ----------
async function sendBriefEmail(args: { user_email: string; user_name?: string; brief: string }, ctx: { uid: string; session_id: string }): Promise<AlbaToolResult> {
  if (!args.user_email || !args.brief) return { ok: false, error: 'user_email e brief richiesti' };
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY missing' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Alba — Pianeta.Studio <alba@pianeta.studio>',
        to: [args.user_email, process.env.ALBA_CALENDAR_OWNER_EMAIL || 'max@pianeta.studio'],
        subject: `Brief — ${args.user_name ?? args.user_email}`,
        text: args.brief,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: `resend ${res.status}: ${errText.slice(0, 200)}` };
    }
  } catch (e: any) {
    return { ok: false, error: `fetch failed: ${e?.message}` };
  }
  // Persisti email + event
  try {
    const sb = albaSupabase();
    await sb.from('alba_users').update({ email: args.user_email, first_name: args.user_name ?? null }).eq('uid', ctx.uid);
    await sb.from('alba_events').insert({
      uid: ctx.uid,
      session_id: ctx.session_id,
      event: 'email_captured',
      payload: { email: args.user_email, source: 'send_brief_email' },
    });
  } catch { /* fire-and-forget */ }
  return { ok: true, human_summary: `Brief mandato a ${args.user_email}` };
}

// ---------- route_to_human ----------
async function routeToHuman(args: { reason: string; summary: string; user_contact?: string; urgency?: 'low' | 'normal' | 'high' }, ctx: { uid: string; session_id: string }): Promise<AlbaToolResult> {
  try {
    const sb = albaSupabase();
    await sb.from('alba_events').insert({
      uid: ctx.uid,
      session_id: ctx.session_id,
      event: 'handoff_to_max',
      payload: { reason: args.reason, summary: args.summary, contact: args.user_contact ?? null, urgency: args.urgency ?? 'normal' },
    });
  } catch { /* fire-and-forget */ }

  // Slack notif optional — Block Kit
  const slackWebhook = process.env.SLACK_ALBA_WEBHOOK;
  if (slackWebhook) {
    try {
      const urgency = args.urgency ?? 'normal';
      const urgencyEmoji = urgency === 'high' ? '🔴' : urgency === 'low' ? '⚪' : '🟡';
      const contact = args.user_contact ?? null;
      const contactLabel = contact || 'da raccogliere';
      const sessionShort = ctx.session_id.slice(0, 8);
      const timestamp = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome', dateStyle: 'short', timeStyle: 'short' });

      const fallbackPrefix = urgency === 'high' ? '<!here> ' : '';
      const fallbackText = `${fallbackPrefix}🤝 Nuovo lead da Alba (${urgency}) — ${args.reason ?? ''}`;

      // Detect email in contact
      const emailMatch = contact ? contact.match(/[^\s@]+@[^\s@]+\.[^\s@]+/) : null;
      const emailAddress = emailMatch ? emailMatch[0] : null;

      const actionElements: unknown[] = [];
      if (emailAddress) {
        actionElements.push({
          type: 'button',
          text: { type: 'plain_text', text: 'Rispondi', emoji: true },
          url: `mailto:${emailAddress}`,
          action_id: 'reply_lead',
        });
      }
      actionElements.push({
        type: 'button',
        text: { type: 'plain_text', text: 'Apri dashboard lead', emoji: true },
        url: 'https://xp.pianeta.studio/admin/alba/leads',
        action_id: 'open_leads_dashboard',
        style: 'primary',
      });

      const blocks: unknown[] = [
        {
          type: 'header',
          text: { type: 'plain_text', text: `${urgencyEmoji} Nuovo lead da Alba`, emoji: true },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Urgenza*\n${urgencyEmoji} ${urgency}` },
            { type: 'mrkdwn', text: `*Motivo*\n${args.reason ?? '–'}` },
            { type: 'mrkdwn', text: `*Contatto*\n${contactLabel}` },
          ],
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `*Riassunto*\n${args.summary ?? '–'}` },
        },
        { type: 'divider' },
        {
          type: 'actions',
          elements: actionElements,
        },
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: `Sessione ${sessionShort} · ${timestamp}` },
          ],
        },
      ];

      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: fallbackText, blocks }),
      });
    } catch { /* ignore */ }
  }

  return {
    ok: true,
    human_summary: 'Ho avvisato Max — ti risponderà a breve. Nel frattempo, puoi anche scriverci a info@pianeta.studio.',
  };
}

// ---------- start_project_tour ----------
async function startProjectTour(args: { work_slug: string }): Promise<AlbaToolResult> {
  if (!args.work_slug) return { ok: false, error: 'work_slug richiesto' };
  const kb = await getKb();
  const entry = kb.entries.find(e => e.section === 'work' && e.slug === args.work_slug);
  if (!entry) return { ok: false, error: `work '${args.work_slug}' non trovato in KB` };

  // I capitoli sono nel frontmatter del file originale — non sono nella KB JSON compilata.
  // Per v0 ritorniamo il body del work + un suggerimento di struttura standard.
  return {
    ok: true,
    data: {
      slug: entry.slug,
      body: entry.body.slice(0, 4000),
      structure_hint: 'Narra in 3 momenti: 1) committente e problema, 2) metodo di validazione, 3) risultato concreto',
    },
    human_summary: `Tour di ${args.work_slug} caricato. Procedo a narrarlo in 3 momenti.`,
  };
}

// ---------- dispatcher ----------
export async function executeAlbaTool(name: string, args: any, ctx: { uid: string; session_id: string }): Promise<AlbaToolResult> {
  switch (name) {
    case 'search_kb': return searchKb(args);
    case 'book_call': return bookCall(args, ctx);
    case 'send_brief_email': return sendBriefEmail(args, ctx);
    case 'route_to_human': return routeToHuman(args, ctx);
    case 'start_project_tour': return startProjectTour(args);
    default: return { ok: false, error: `unknown tool '${name}'` };
  }
}

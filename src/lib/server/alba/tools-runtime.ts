// Executor server-side per i tool dichiarati nel registry.
// Ogni tool ritorna un AlbaToolResult che il chat endpoint inserisce
// come tool_result nella conversazione, poi rilancia Anthropic.

import { albaSupabase } from './supabase';
import { getKb } from './assets';
import { createGoogleCalendarEvent, getFreeBusy } from './google-calendar';
import { syncAlbaLead } from './leads-sync';
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
async function bookCall(
  args: { user_email: string; user_name?: string; topic: string; preferred_slot?: string; preferred_window?: string },
  ctx: { uid: string; session_id: string }
): Promise<AlbaToolResult> {
  // Validazione minima email (server-side)
  if (!args.user_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.user_email)) {
    return { ok: false, error: 'user_email mancante o non valida — chiedi all\'utente la sua email prima di richiamare il tool' };
  }

  const sb = albaSupabase();

  // Parse preferred_slot.
  // Priority: (1) ISO datetime esplicito (proviene dal slot picker) → new Date direttamente
  //           (2) testo libero in italiano → chrono-node IT
  let parsedStart: Date | null = null;
  if (args.preferred_slot) {
    const isoMatch = args.preferred_slot.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})/);
    if (isoMatch) {
      const d = new Date(isoMatch[0]);
      if (!isNaN(d.getTime())) parsedStart = d;
    }
    if (!parsedStart) {
      const results = chrono.it.parse(args.preferred_slot, new Date(), { forwardDate: true });
      if (results.length > 0 && results[0].start) parsedStart = results[0].start.date();
    }
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

  // 1) Salva email + nome sull'user
  try {
    await sb.from('alba_users').update({
      email: args.user_email,
      first_name: args.user_name ?? null,
    }).eq('uid', ctx.uid);
  } catch { /* fire-and-forget */ }

  // 1b) Sync additivo verso leads (CRM commerciale) — non deve mai rompere il flusso chat.
  try {
    await syncAlbaLead(sb, {
      email: args.user_email,
      name: args.user_name ?? null,
      status: gcalResult?.ok ? 'call' : 'draft',
    });
  } catch (e) {
    console.error('[alba-leads-sync] book_call sync failed:', e);
  }

  // 2) Manda email-brief a Max (e CC all'utente) via Resend
  const resendKey = process.env.RESEND_API_KEY;
  let emailSent = false;
  let emailError: string | null = null;
  if (resendKey) {
    const slotLine = gcalResult?.ok
      ? `**Evento Google Calendar creato** per ${parsedStart!.toLocaleString('it-IT', { dateStyle: 'full', timeStyle: 'short' })}${gcalResult.meet_url ? ` · Meet: ${gcalResult.meet_url}` : ''}`
      : args.preferred_slot
      ? `**Slot suggerito dall'utente**: ${args.preferred_slot} *(Google Calendar non disponibile, da risistemare manualmente)*`
      : args.preferred_window
      ? `**Finestra preferita**: ${args.preferred_window} *(Alba non ha potuto fissare automaticamente)*`
      : `**Slot**: nessuno proposto`;
    const brief = [
      `Contatto da Alba (AI di gruppo · sessione ${ctx.session_id.slice(0, 8)}).`,
      '',
      `**Da**: ${args.user_name ? args.user_name + ' — ' : ''}${args.user_email}`,
      `**Topic**: ${args.topic}`,
      slotLine,
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
      { uid: ctx.uid, session_id: ctx.session_id, event: 'call_booked', payload: { topic: args.topic, slot: args.preferred_slot ?? null, window: args.preferred_window ?? null, email_sent: emailSent, gcal_event_id: gcalResult?.event_id ?? null, gcal_ok: gcalResult?.ok ?? null } },
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
    if (gcalResult && !gcalResult.ok) summaryParts.push(`Google Calendar non disponibile (${gcalResult.error}). Max ti scriverà appena può per fissare.`);
    summaryParts.push(emailSent ? `Email brief mandata a Max e a ${args.user_email}` : `Email NON inviata`);
    if (args.preferred_slot) summaryParts.push(`Suggerimento utente "${args.preferred_slot}" passato a Max`);
  }

  return {
    ok: true,
    data: {
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
    try {
      await syncAlbaLead(sb, { email: args.user_email, name: args.user_name ?? null, status: 'draft' });
    } catch (e) {
      console.error('[alba-leads-sync] send_brief_email sync failed:', e);
    }
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

// ---------- suggest_slots ----------
// Propone slot liberi sull'agenda di Max (FreeBusy).
// Regole: Lun-Ven, 10:00-13:00 + 14:30-18:00 Europe/Rome, slot di `duration_min`,
// no slot entro 24h da adesso, max 6 slot per page (2 al giorno per 3 giorni).
// `from_iso` permette paginazione: la UI passa l'inizio del prossimo intervallo per andare avanti nel tempo.

const BUSINESS_HOURS = [
  { startH: 10, startM: 0, endH: 13, endM: 0 },
  { startH: 14, startM: 30, endH: 18, endM: 0 },
];
const SLOTS_PER_PAGE = 6;
const SLOTS_PER_DAY_MAX = 2;
const SEARCH_DAYS_AHEAD = 21;

function overlapsBusy(slotStart: Date, slotEnd: Date, busy: { start: string; end: string }[]): boolean {
  const s = slotStart.getTime(), e = slotEnd.getTime();
  return busy.some(b => {
    const bs = new Date(b.start).getTime(), be = new Date(b.end).getTime();
    return s < be && e > bs;
  });
}

function* iterateCandidateSlots(from: Date, durationMin: number) {
  // Cammina giorno per giorno, salta weekend, genera slot di `durationMin` ogni 30 min dentro le business hours.
  const cursor = new Date(from);
  cursor.setSeconds(0, 0);
  const stop = new Date(from.getTime() + SEARCH_DAYS_AHEAD * 86400_000);
  while (cursor < stop) {
    const dow = cursor.getDay(); // 0=Sun, 6=Sat
    if (dow !== 0 && dow !== 6) {
      for (const win of BUSINESS_HOURS) {
        const winStart = new Date(cursor); winStart.setHours(win.startH, win.startM, 0, 0);
        const winEnd = new Date(cursor); winEnd.setHours(win.endH, win.endM, 0, 0);
        let t = new Date(winStart);
        while (t.getTime() + durationMin * 60_000 <= winEnd.getTime()) {
          if (t.getTime() >= from.getTime()) {
            yield { start: new Date(t), end: new Date(t.getTime() + durationMin * 60_000) };
          }
          t = new Date(t.getTime() + 30 * 60_000);
        }
      }
    }
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);
  }
}

async function suggestSlots(args: { duration_min?: number; from_iso?: string }): Promise<AlbaToolResult> {
  const duration = Math.min(Math.max(args.duration_min ?? 30, 15), 120);
  const earliestAllowed = new Date(Date.now() + 24 * 3600_000); // no slot entro 24h da adesso
  const requestedFrom = args.from_iso ? new Date(args.from_iso) : earliestAllowed;
  const from = requestedFrom.getTime() < earliestAllowed.getTime() ? earliestAllowed : requestedFrom;

  const to = new Date(from.getTime() + SEARCH_DAYS_AHEAD * 86400_000);
  const fb = await getFreeBusy(from.toISOString(), to.toISOString());
  if (!fb.ok) return { ok: false, error: `freebusy failed: ${fb.error}` };

  const busy = fb.busy || [];
  const slots: { start_iso: string; end_iso: string; day_key: string; label: string }[] = [];
  const perDay = new Map<string, number>();

  const fmt = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Rome' });
  const dayKeyFmt = new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Rome' });

  for (const cand of iterateCandidateSlots(from, duration)) {
    if (overlapsBusy(cand.start, cand.end, busy)) continue;
    const dayKey = dayKeyFmt.format(cand.start);
    if ((perDay.get(dayKey) ?? 0) >= SLOTS_PER_DAY_MAX) continue;
    perDay.set(dayKey, (perDay.get(dayKey) ?? 0) + 1);
    slots.push({
      start_iso: cand.start.toISOString(),
      end_iso: cand.end.toISOString(),
      day_key: dayKey,
      label: fmt.format(cand.start),
    });
    if (slots.length >= SLOTS_PER_PAGE) break;
  }

  const nextFromIso = slots.length > 0
    ? new Date(new Date(slots[slots.length - 1].start_iso).getTime() + 86400_000).toISOString()
    : null;

  return {
    ok: true,
    data: {
      slots,
      duration_min: duration,
      from_iso: from.toISOString(),
      next_from_iso: nextFromIso,
      timezone: 'Europe/Rome',
    },
    human_summary: slots.length === 0
      ? 'Nessuno slot libero nei prossimi 21 giorni. Lascia un orario che ti va e ci organizziamo.'
      : `Trovati ${slots.length} slot. Falli vedere all'utente con il selettore: scelga lui.`,
  };
}

// ---------- newsletter_signup ----------
// Iscrive l'utente alla audience Bulletin di Resend (Pianeta.Studio).
// Lead magnet leggero: quando l'utente non è pronto a bookare ma è curioso.
async function newsletterSignup(
  args: { user_email: string; user_name?: string },
  ctx: { uid: string; session_id: string }
): Promise<AlbaToolResult> {
  if (!args.user_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.user_email)) {
    return { ok: false, error: 'user_email mancante o non valida' };
  }
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return { ok: false, error: 'RESEND_API_KEY/AUDIENCE_ID mancanti' };

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: { 'authorization': `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        email: args.user_email,
        first_name: args.user_name ?? undefined,
        unsubscribed: false,
      }),
    });
    // Resend ritorna 201 OR 422 se già iscritto — entrambi OK per noi
    const alreadySubscribed = res.status === 422;
    if (!res.ok && !alreadySubscribed) {
      return { ok: false, error: `resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
    }

    const sb = albaSupabase();
    try {
      await sb.from('alba_users').update({ email: args.user_email, first_name: args.user_name ?? null }).eq('uid', ctx.uid);
      await sb.from('alba_events').insert({
        uid: ctx.uid,
        session_id: ctx.session_id,
        event: 'newsletter_signup',
        payload: { email: args.user_email, already_subscribed: alreadySubscribed },
      });
      try {
        await syncAlbaLead(sb, { email: args.user_email, name: args.user_name ?? null, status: 'draft' });
      } catch (e) {
        console.error('[alba-leads-sync] newsletter_signup sync failed:', e);
      }
    } catch { /* fire-and-forget */ }

    return {
      ok: true,
      data: { already_subscribed: alreadySubscribed },
      human_summary: alreadySubscribed
        ? `${args.user_email} era già iscritto al Bulletin — nessuna duplicazione`
        : `${args.user_email} iscritto al Bulletin Pianeta.Studio`,
    };
  } catch (e: any) {
    return { ok: false, error: `fetch failed: ${e?.message}` };
  }
}

// ---------- send_recap_email ----------
// Manda un riassunto della conversazione SOLO all'utente (Max NON in copia — è cosa diversa da send_brief_email).
// Usalo a fine chat lunga quando l'utente vuole rileggere o tornare in seguito.
async function sendRecapEmail(
  args: { user_email: string; user_name?: string; recap_md: string },
  ctx: { uid: string; session_id: string }
): Promise<AlbaToolResult> {
  if (!args.user_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.user_email)) {
    return { ok: false, error: 'user_email non valida' };
  }
  if (!args.recap_md || args.recap_md.length < 50) {
    return { ok: false, error: 'recap_md troppo breve (min 50 caratteri)' };
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY missing' };

  const greeting = args.user_name ? `Ciao ${args.user_name},` : 'Ciao,';
  const body = [
    greeting,
    '',
    'come promesso, ti mando il riassunto della nostra conversazione su pianeta.studio:',
    '',
    args.recap_md,
    '',
    '---',
    'Se vuoi riprenderla, scrivimi rispondendo a questa mail oppure torna su https://xp.pianeta.studio (chat in basso a destra).',
    '',
    '— Alba, AI di Pianeta.Studio',
    '*Per esportare i tuoi dati completi: /api/alba/export-my-data?uid=' + ctx.uid + '*',
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: 'Alba — Pianeta.Studio <alba@pianeta.studio>',
        to: [args.user_email],
        reply_to: process.env.ALBA_CALENDAR_OWNER_EMAIL || 'max@pianeta.studio',
        subject: `Il riassunto della tua conversazione con Alba`,
        text: body,
      }),
    });
    if (!res.ok) return { ok: false, error: `resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
  } catch (e: any) {
    return { ok: false, error: `fetch failed: ${e?.message}` };
  }

  try {
    const sb = albaSupabase();
    await sb.from('alba_users').update({ email: args.user_email, first_name: args.user_name ?? null }).eq('uid', ctx.uid);
    await sb.from('alba_events').insert({
      uid: ctx.uid, session_id: ctx.session_id, event: 'recap_email_sent',
      payload: { email: args.user_email, len: args.recap_md.length },
    });
    try {
      await syncAlbaLead(sb, { email: args.user_email, name: args.user_name ?? null, status: 'draft' });
    } catch (e) {
      console.error('[alba-leads-sync] send_recap_email sync failed:', e);
    }
  } catch { /* fire-and-forget */ }

  return { ok: true, human_summary: `Recap mandato a ${args.user_email}` };
}

// ---------- suggest_page ----------
// Proponi all'utente di aprire una pagina del sito (o un URL esterno tipo pianeta.green/<userUrl>).
// NON naviga automaticamente: il client renderizza un bottone "Aprire X →" che l'utente clicca.
async function suggestPage(
  args: { url: string; label: string; reason?: string },
  ctx: { uid: string; session_id: string }
): Promise<AlbaToolResult> {
  if (!args.url || typeof args.url !== 'string') return { ok: false, error: 'url richiesta' };
  if (!args.label || typeof args.label !== 'string') return { ok: false, error: 'label richiesta (testo del bottone)' };

  // Sanity: accetta /relative-path o https?:// esterni. Niente javascript: o data:
  if (!/^(\/|https?:\/\/)/i.test(args.url)) {
    return { ok: false, error: `url non sicura: ${args.url}. Usa /path-relative o https://...` };
  }
  if (/^javascript:|^data:/i.test(args.url)) {
    return { ok: false, error: 'url proibita' };
  }

  try {
    const sb = albaSupabase();
    await sb.from('alba_events').insert({
      uid: ctx.uid, session_id: ctx.session_id, event: 'page_suggested',
      payload: { url: args.url, label: args.label, reason: args.reason ?? null },
    });
  } catch { /* fire-and-forget */ }

  return {
    ok: true,
    data: { url: args.url, label: args.label, reason: args.reason ?? null },
    human_summary: `Bottone proposto: ${args.label} → ${args.url}`,
  };
}

// ---------- dispatcher ----------
export async function executeAlbaTool(name: string, args: any, ctx: { uid: string; session_id: string }): Promise<AlbaToolResult> {
  switch (name) {
    case 'search_kb': return searchKb(args);
    case 'suggest_slots': return suggestSlots(args);
    case 'book_call': return bookCall(args, ctx);
    case 'send_brief_email': return sendBriefEmail(args, ctx);
    case 'route_to_human': return routeToHuman(args, ctx);
    case 'start_project_tour': return startProjectTour(args);
    case 'newsletter_signup': return newsletterSignup(args, ctx);
    case 'send_recap_email': return sendRecapEmail(args, ctx);
    case 'suggest_page': return suggestPage(args, ctx);
    default: return { ok: false, error: `unknown tool '${name}'` };
  }
}

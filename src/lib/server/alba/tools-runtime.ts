// Executor server-side per i tool dichiarati nel registry.
// Ogni tool ritorna un AlbaToolResult che il chat endpoint inserisce
// come tool_result nella conversazione, poi rilancia Anthropic.

import { albaSupabase } from './supabase';
import { getKb } from './assets';

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

  const url = buildCalUrl(args.preferred_slot || args.preferred_window, args.topic);
  const sb = albaSupabase();

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
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'authorization': `Bearer ${resendKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: 'Alba — Pianeta.Studio <alba@pianeta.studio>',
          to: ['info@pianeta.studio'],
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
      { uid: ctx.uid, session_id: ctx.session_id, event: 'call_booked', payload: { topic: args.topic, slot: args.preferred_slot ?? null, window: args.preferred_window ?? null, url, email_sent: emailSent } },
    ]);
  } catch { /* fire-and-forget */ }

  const summaryParts = [
    emailSent ? `Email mandata a Max e a ${args.user_email}` : `Email NON inviata (${emailError ?? 'Resend non configurato'})`,
    `Agenda di Max: ${url}`,
    args.preferred_slot ? `Suggerimento utente "${args.preferred_slot}" passato a Max — sceglierà dall'agenda` : null,
  ].filter(Boolean);

  return {
    ok: true,
    data: { cal_url: url, slot: args.preferred_slot ?? null, email_sent: emailSent, user_email: args.user_email },
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
        to: [args.user_email, 'info@pianeta.studio'],
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

  // Slack notif optional
  const slackWebhook = process.env.SLACK_ALBA_WEBHOOK;
  if (slackWebhook) {
    try {
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: `🤝 Alba handoff (${args.urgency ?? 'normal'})\n*Reason*: ${args.reason}\n*Summary*: ${args.summary}\n*Contact*: ${args.user_contact ?? 'n/d'}`,
        }),
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

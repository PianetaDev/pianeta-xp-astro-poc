/**
 * POST /api/alba/chat
 * Alba — Pianeta.Studio AI assistant. Conversational with AI Act disclosure,
 * dedicated persona, explicit handoff to Max for pricing/timeline/commitments.
 *
 * Default mode: { messages, session_id?, pageContext? } → { reply, handoff_to_max, handoff_reason, session_id }
 * Hire-us mode: { mode: 'hire-us', messages, userName? } → { mode, content, stop_reason }
 */
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { createHash, randomUUID } from 'node:crypto';
import { buildHireUsSystemPrompt, HIRE_US_TOOLS } from '@/lib/server/alba-hire-us-prompt';
import { loadKB, kbAsText } from '@/lib/server/alba-kb';
import { env } from '@/lib/server/env';

export const prerender = false;

const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929';
const MAX_HISTORY = 10;
const RATE_LIMIT_PER_HOUR = 30;
const IP_SALT = 'salt-pianeta-alba-26';

interface Msg { role: 'user' | 'assistant' | 'system'; content: string }

const ALBA_SYSTEM_PROMPT = `Sei Alba.

Alba è la prima luce del giorno, l'inizio delle cose, la prima vibrazione che sente chi entra in contatto con Pianeta. Sei un sistema AI sviluppato e operato da Pianeta.Studio S.r.l. Società Benefit (Italia, Catania · Milano · remote-first). Non sei una persona — quando ti chiedono cosa sei, lo dici con chiarezza.

Il tuo lavoro è connettere. Ascolti chi arriva, riformuli quello che cerca, lo leghi a quello che Pianeta sa fare. Quando serve un commitment vero (preventivi, contratti, decisioni operative), passi la palla a Max (Massimiliano Mauro, founder).

# IL TUO ASSE: I BISOGNI DEL CLIENTE
Parti SEMPRE dal bisogno di chi sta parlando. Non dal manifesto Pianeta. Non dai valori dello studio. Non da quello che Pianeta vorrebbe vendere.

Il flusso è:
1. Il contatto arriva → tu ascolti cosa cerca
2. Riformuli il bisogno (per essere sicura di averlo capito)
3. Connetti quel bisogno con quello che Pianeta sa fare
4. Proponi una direzione · o passi a Max

# IDENTITÀ
- Nome: Alba
- Natura: AI di gruppo di Pianeta.Studio
- Email associata: alba@pianeta.studio
- Famiglia: Pianeta.Studio · Pianeta.Green · Pianeta.Tech · Pianeta.Farm · Pianeta.Lab

# COSA NON FAI MAI
- Inviare preventivi o offerte economiche concrete
- Accettare o rifiutare progetti
- Negoziare condizioni contrattuali
- Promettere timeline o deliverable specifici

# STOP LIST (handoff_to_max=true)
1. Cliente chiede pricing concreto fuori dai pacchetti pubblici Pianeta.Green
2. Cliente chiede timeline / commitment specifico
3. Cliente chiede call con Max
4. Tema sensibile (dato confidenziale, conflitto, sentimento forte)
5. Domanda fuori scope di conoscenza
6. Più di 3 turn senza chiusura

# FOOTER OBBLIGATORIO
Termina OGNI risposta con questa riga ESATTA, su nuova riga, separata da una riga vuota:

—Alba, AI di Pianeta.Studio · Le decisioni significative passano per Max.

# OUTPUT
Rispondi SEMPRE chiamando il tool "alba_response" con:
- reply: la tua risposta in italiano (o inglese se l'utente scrive in inglese), con il footer obbligatorio in coda
- handoff_to_max: true se la conversazione richiede Max (vedi STOP LIST), altrimenti false
- handoff_reason: se handoff_to_max=true, una frase chiara su perché. null altrimenti.`;

function err(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { 'content-type': 'application/json' } });
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request }) => {
  const anthropicKey = env('ANTHROPIC_API_KEY');
  const supabaseUrl = env('NUXT_PUBLIC_SUPABASE_URL') || env('SUPABASE_URL');
  const supabaseKey = env('SUPABASE_SERVICE_KEY');

  if (!anthropicKey || !supabaseUrl || !supabaseKey) {
    return err('Missing env (anthropic/supabase)', 500);
  }

  const body = await request.json().catch(() => null) as {
    messages: Msg[];
    session_id?: string;
    pageContext?: { context?: string; contextSlug?: string };
    mode?: 'default' | 'hire-us';
    userName?: string;
    conversationId?: string;
  } | null;

  if (!body) return err('invalid body', 400);

  // ── hire-us mode: KB-enriched system prompt + tool calling ──────────────
  if (body.mode === 'hire-us') {
    const kb = await loadKB();
    const systemPrompt = buildHireUsSystemPrompt(body.userName, kbAsText(kb));
    const anthropicHU = new Anthropic({ apiKey: anthropicKey });

    const response = await anthropicHU.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: body.messages as any,
      tools: HIRE_US_TOOLS,
    });

    return json({
      mode: 'hire-us',
      content: response.content,
      stop_reason: response.stop_reason,
    });
  }

  const incoming = (body?.messages || []).filter(m => m && m.content && m.role !== 'system');
  if (!incoming.length) return err('Empty messages', 400);
  const messages = incoming.slice(-MAX_HISTORY);
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') return err('Last message must be user', 400);

  const sessionId = (body?.session_id && /^[a-zA-Z0-9-]{8,64}$/.test(body.session_id))
    ? body.session_id
    : randomUUID();

  const ipRaw = (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '').split(',')[0]?.trim() || 'unknown';
  const ipHash = createHash('sha256').update(ipRaw + IP_SALT).digest('hex').slice(0, 16);
  const ua = (request.headers.get('user-agent') || '').slice(0, 200);

  const sb = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'bussola' },
  });

  // Rate limit
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await sb
      .from('alba_conversations')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('role', 'user')
      .gte('created_at', oneHourAgo);
    if ((count || 0) >= RATE_LIMIT_PER_HOUR) {
      return err("Troppi messaggi. Riprova tra un'ora o scrivi a max@pianeta.studio.", 429);
    }
  } catch { /* don't block user on rate-limit errors */ }

  // Log incoming (non-blocking)
  sb.from('alba_conversations').insert({
    session_id: sessionId,
    role: 'user',
    content: last.content.slice(0, 8000),
    user_agent: ua,
    ip_hash: ipHash,
  }).then(() => null, () => null);

  const anthropic = new Anthropic({ apiKey: anthropicKey });

  const pageContextBlock = body.pageContext?.context
    ? `\n\nContesto pagina: la persona arriva da una pagina "${body.pageContext.context}"${body.pageContext.contextSlug ? ` (slug: ${body.pageContext.contextSlug})` : ''}. Trattalo come un segnale leggero di interesse.`
    : '';

  let parsed: { reply: string; handoff_to_max: boolean; handoff_reason: string | null };
  try {
    const resp = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 800,
      temperature: 0.5,
      system: ALBA_SYSTEM_PROMPT + pageContextBlock,
      messages: messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      tool_choice: { type: 'tool', name: 'alba_response' },
      tools: [{
        name: 'alba_response',
        description: 'Risposta strutturata di Alba con flag handoff a Max.',
        input_schema: {
          type: 'object',
          properties: {
            reply: { type: 'string', description: 'Risposta testuale di Alba, con footer obbligatorio in coda.' },
            handoff_to_max: { type: 'boolean', description: 'true se la conversazione richiede Max.' },
            handoff_reason: { type: ['string', 'null'], description: 'Motivo del handoff o null.' },
          },
          required: ['reply', 'handoff_to_max', 'handoff_reason'],
        },
      }] as any,
    });
    const tool: any = resp.content.find((b: any) => b.type === 'tool_use');
    if (!tool?.input) throw new Error('no tool_use block');
    parsed = {
      reply: String(tool.input.reply || '').trim(),
      handoff_to_max: Boolean(tool.input.handoff_to_max),
      handoff_reason: tool.input.handoff_reason || null,
    };
  } catch (e: any) {
    console.error('[alba] generation failed:', e?.message || e);
    parsed = {
      reply: 'Mi spiace, ho un problema tecnico in questo momento. Scrivimi a max@pianeta.studio o riprova tra qualche minuto.\n\n—Alba, AI di Pianeta.Studio · Le decisioni significative passano per Max.',
      handoff_to_max: true,
      handoff_reason: 'errore tecnico nel generare la risposta',
    };
  }

  const FOOTER = '—Alba, AI di Pianeta.Studio · Le decisioni significative passano per Max.';
  if (!parsed.reply.includes('—Alba')) {
    parsed.reply = parsed.reply.trimEnd() + '\n\n' + FOOTER;
  }

  // Log assistant response (non-blocking)
  sb.from('alba_conversations').insert({
    session_id: sessionId,
    role: 'assistant',
    content: parsed.reply.slice(0, 8000),
    handoff_to_max: parsed.handoff_to_max,
    handoff_reason: parsed.handoff_reason,
    user_agent: ua,
    ip_hash: ipHash,
  }).then(() => null, () => null);

  return json({
    reply: parsed.reply,
    handoff_to_max: parsed.handoff_to_max,
    handoff_reason: parsed.handoff_reason,
    session_id: sessionId,
  });
};

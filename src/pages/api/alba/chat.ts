import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { albaSupabase } from '../../../lib/server/alba/supabase';
import { getSystemPrompt, getTools } from '../../../lib/server/alba/assets';
import { checkAndIncrementRateLimit, checkDailyCostCap, addToDailyCost } from '../../../lib/server/alba/rate-limit';
import { executeAlbaTool } from '../../../lib/server/alba/tools-runtime';
import type { AlbaChatChunk, AlbaPageContext } from '../../../lib/alba/session-types';

export const prerender = false;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MODEL_ID = 'claude-sonnet-4-6';
const PRICE_IN_PER_TOK_EUR = 3 / 1_000_000 / 1.08;
const PRICE_OUT_PER_TOK_EUR = 15 / 1_000_000 / 1.08;
const MAX_TOOL_ITERATIONS = 4;

interface ChatRequest {
  uid?: string;
  session_id?: string;
  messages?: { role: 'user' | 'assistant'; content: string }[];
  page_context?: AlbaPageContext;
}

interface ToolUseBuf {
  id: string;
  name: string;
  inputBuf: string;
  index: number;
}

function sseChunk(chunk: AlbaChatChunk): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n\n`);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const body = (await request.json().catch(() => null)) as ChatRequest | null;
  if (!body || !body.uid || !UUID_RE.test(body.uid) || !body.session_id || !UUID_RE.test(body.session_id) || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: 'invalid request' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return new Response('missing ANTHROPIC_API_KEY', { status: 500 });

  const anthropic = new Anthropic({ apiKey });
  const sb = albaSupabase();

  const costVerdict = await checkDailyCostCap();
  if (!costVerdict.ok) {
    return new Response(`data: ${JSON.stringify({ type: 'error', message: costVerdict.reason })}\n\n`, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    });
  }

  const { data: sess0 } = await sb.from('alba_sessions').select('msg_count').eq('id', body.session_id).maybeSingle();
  const ip = clientAddress || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rlVerdict = await checkAndIncrementRateLimit({
    uid: body.uid,
    ip,
    sessionMsgCount: sess0?.msg_count ?? 0,
  });
  if (!rlVerdict.ok) {
    return new Response(`data: ${JSON.stringify({ type: 'error', message: rlVerdict.reason })}\n\n`, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    });
  }

  const systemPrompt = await getSystemPrompt();
  const toolRegistry = await getTools();

  const lastUser = [...body.messages].reverse().find(m => m.role === 'user');
  if (lastUser) {
    await sb.from('alba_messages').insert({
      session_id: body.session_id,
      role: 'user',
      content: lastUser.content,
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(sseChunk({ type: 'session', session_id: body.session_id! }));

      // Anthropic Messages API è multi-content: ogni messaggio assistant può avere
      // più content block (text + tool_use). Costruiamo messages array Anthropic-style.
      const convo: any[] = (body.messages || []).map(m => ({ role: m.role, content: m.content }));

      let totalIn = 0;
      let totalOut = 0;
      let finalAssistantText = '';

      try {
        for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
          const aStream = await anthropic.messages.create({
            model: MODEL_ID,
            max_tokens: 1024,
            system: systemPrompt,
            tools: toolRegistry.tools as any,
            messages: convo,
            stream: true,
          });

          // Accumuliamo l'assistant message completo (text + tool_use blocks)
          const assistantContentBlocks: any[] = [];
          let currentText = '';
          const toolBufs = new Map<number, ToolUseBuf>();
          let stopReason: string | null = null;

          for await (const ev of aStream as any) {
            if (ev.type === 'content_block_start') {
              const idx = ev.index ?? 0;
              if (ev.content_block?.type === 'text') {
                // text block start
              } else if (ev.content_block?.type === 'tool_use') {
                toolBufs.set(idx, {
                  id: ev.content_block.id,
                  name: ev.content_block.name,
                  inputBuf: '',
                  index: idx,
                });
                controller.enqueue(sseChunk({ type: 'tool_use', name: ev.content_block.name, input: {} }));
              }
            } else if (ev.type === 'content_block_delta') {
              if (ev.delta?.type === 'text_delta') {
                currentText += ev.delta.text;
                finalAssistantText += ev.delta.text;
                controller.enqueue(sseChunk({ type: 'text', delta: ev.delta.text }));
              } else if (ev.delta?.type === 'input_json_delta') {
                const buf = toolBufs.get(ev.index ?? 0);
                if (buf) buf.inputBuf += ev.delta.partial_json ?? '';
              }
            } else if (ev.type === 'content_block_stop') {
              const idx = ev.index ?? 0;
              if (toolBufs.has(idx)) {
                const buf = toolBufs.get(idx)!;
                let parsed: any = {};
                try { parsed = buf.inputBuf ? JSON.parse(buf.inputBuf) : {}; } catch { /* ignore */ }
                assistantContentBlocks.push({ type: 'tool_use', id: buf.id, name: buf.name, input: parsed });
              } else if (currentText) {
                assistantContentBlocks.push({ type: 'text', text: currentText });
                currentText = '';
              }
            } else if (ev.type === 'message_delta') {
              if (ev.usage) {
                totalIn += ev.usage.input_tokens ?? 0;
                totalOut += ev.usage.output_tokens ?? 0;
              }
              if (ev.delta?.stop_reason) stopReason = ev.delta.stop_reason;
            }
          }

          // Se ci sono testi residui non chiusi (improbabile), aggiungi
          if (currentText) {
            assistantContentBlocks.push({ type: 'text', text: currentText });
          }

          // Se nessun tool_use: fine
          const toolUseBlocks = assistantContentBlocks.filter(b => b.type === 'tool_use');
          if (toolUseBlocks.length === 0 || stopReason !== 'tool_use') {
            break;
          }

          // Esegui i tool e prepara i tool_result
          convo.push({ role: 'assistant', content: assistantContentBlocks });
          const toolResults: any[] = [];
          for (const tu of toolUseBlocks) {
            const result = await executeAlbaTool(tu.name, tu.input, { uid: body.uid!, session_id: body.session_id! });
            controller.enqueue(sseChunk({ type: 'tool_result', name: tu.name, output: result }));
            toolResults.push({
              type: 'tool_result',
              tool_use_id: tu.id,
              content: result.ok
                ? (result.human_summary || JSON.stringify(result.data ?? {}, null, 2))
                : `Errore tool: ${result.error || 'unknown'}`,
              is_error: !result.ok,
            });
          }
          convo.push({ role: 'user', content: toolResults });
          // Continua il loop: Anthropic ora produrrà il messaggio finale
        }

        const costEur = totalIn * PRICE_IN_PER_TOK_EUR + totalOut * PRICE_OUT_PER_TOK_EUR;

        await sb.from('alba_messages').insert({
          session_id: body.session_id,
          role: 'assistant',
          content: finalAssistantText,
          model_id: MODEL_ID,
        });
        const { data: sess } = await sb.from('alba_sessions').select('msg_count, tokens_in, tokens_out, cost_eur').eq('id', body.session_id).maybeSingle();
        if (sess) {
          await sb.from('alba_sessions').update({
            msg_count: (sess.msg_count ?? 0) + 2,
            tokens_in: (sess.tokens_in ?? 0) + totalIn,
            tokens_out: (sess.tokens_out ?? 0) + totalOut,
            cost_eur: Number(((sess.cost_eur ?? 0) + costEur).toFixed(4)),
          }).eq('id', body.session_id);
        }
        await addToDailyCost(costEur);

        controller.enqueue(sseChunk({
          type: 'done',
          tokens: { in: totalIn, out: totalOut },
          cost_eur: Number(costEur.toFixed(4)),
        }));
      } catch (err: any) {
        controller.enqueue(sseChunk({ type: 'error', message: err?.message || 'unknown error' }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache, no-transform',
      'connection': 'keep-alive',
    },
  });
};

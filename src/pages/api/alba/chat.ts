import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { albaSupabase } from '../../../lib/server/alba/supabase';
import { getSystemPrompt, getTools } from '../../../lib/server/alba/assets';
import { checkAndIncrementRateLimit, checkDailyCostCap, addToDailyCost } from '../../../lib/server/alba/rate-limit';
import type { AlbaChatChunk, AlbaPageContext } from '../../../lib/alba/session-types';

export const prerender = false;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MODEL_ID = 'claude-sonnet-4-6';
// Pricing Anthropic (€/Mtok) — sonnet-4-6 input 3$/Mt out 15$/Mt; €1≈$1.08
const PRICE_IN_PER_TOK_EUR = 3 / 1_000_000 / 1.08;
const PRICE_OUT_PER_TOK_EUR = 15 / 1_000_000 / 1.08;

interface ChatRequest {
  uid?: string;
  session_id?: string;
  messages?: { role: 'user' | 'assistant'; content: string }[];
  page_context?: AlbaPageContext;
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

  // Guard: daily cost cap
  const costVerdict = await checkDailyCostCap();
  if (!costVerdict.ok) {
    return new Response(`data: ${JSON.stringify({ type: 'error', message: costVerdict.reason })}\n\n`, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    });
  }

  // Guard: rate limits (per session, per uid, per IP, global)
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

      try {
        const aStream = await anthropic.messages.create({
          model: MODEL_ID,
          max_tokens: 1024,
          system: systemPrompt,
          tools: toolRegistry.tools as any,
          messages: body.messages!,
          stream: true,
        });

        let assistantText = '';
        let tokensIn = 0;
        let tokensOut = 0;

        for await (const ev of aStream as any) {
          if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
            assistantText += ev.delta.text;
            controller.enqueue(sseChunk({ type: 'text', delta: ev.delta.text }));
          } else if (ev.type === 'content_block_start' && ev.content_block?.type === 'tool_use') {
            controller.enqueue(sseChunk({
              type: 'tool_use',
              name: ev.content_block.name,
              input: ev.content_block.input ?? {},
            }));
          } else if (ev.type === 'message_delta' && ev.usage) {
            tokensIn = ev.usage.input_tokens ?? tokensIn;
            tokensOut = ev.usage.output_tokens ?? tokensOut;
          }
        }

        const costEur = tokensIn * PRICE_IN_PER_TOK_EUR + tokensOut * PRICE_OUT_PER_TOK_EUR;

        await sb.from('alba_messages').insert({
          session_id: body.session_id,
          role: 'assistant',
          content: assistantText,
          model_id: MODEL_ID,
        });
        const { data: sess } = await sb.from('alba_sessions').select('msg_count, tokens_in, tokens_out, cost_eur').eq('id', body.session_id).maybeSingle();
        if (sess) {
          await sb.from('alba_sessions').update({
            msg_count: (sess.msg_count ?? 0) + 2,
            tokens_in: (sess.tokens_in ?? 0) + tokensIn,
            tokens_out: (sess.tokens_out ?? 0) + tokensOut,
            cost_eur: Number(((sess.cost_eur ?? 0) + costEur).toFixed(4)),
          }).eq('id', body.session_id);
        }
        await addToDailyCost(costEur);

        controller.enqueue(sseChunk({
          type: 'done',
          tokens: { in: tokensIn, out: tokensOut },
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

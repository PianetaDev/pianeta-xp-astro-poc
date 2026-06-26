import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import { env } from './env';

const PRICING: Record<string, { input: number; output: number }> = {
  'claude-opus-4-6': { input: 15, output: 75 },
  'claude-sonnet-4-6': { input: 3, output: 15 },
  'claude-haiku-4-5-20251001': { input: 1, output: 5 },
};

export function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const p = PRICING[model];
  if (!p) return 0;
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
}

export async function logUsage(opts: {
  request?: Request;
  endpoint: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cached?: boolean;
  promptSnippet?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    const url = env('NUXT_PUBLIC_SUPABASE_URL') || env('SUPABASE_URL');
    const key = env('SUPABASE_SERVICE_KEY');
    const sb = createClient(url, key, { auth: { persistSession: false } });
    const ip = opts.request
      ? (opts.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         opts.request.headers.get('x-real-ip') || 'unknown')
      : 'server';
    const ipHash = createHash('sha256').update(ip + (env('NARRATOR_SECRET') || 'salt')).digest('hex').slice(0, 16);
    await sb.from('llm_usage').insert({
      endpoint: opts.endpoint,
      model: opts.model,
      input_tokens: opts.inputTokens,
      output_tokens: opts.outputTokens,
      cost_usd: estimateCost(opts.model, opts.inputTokens, opts.outputTokens),
      cached: opts.cached || false,
      ip_hash: ipHash,
      prompt_snippet: (opts.promptSnippet || '').slice(0, 200),
      metadata: opts.metadata || {},
    });
  } catch {
    // logging non critico
  }
}

// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';

// Mock @anthropic-ai/sdk with synthetic stream
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class {
      messages = {
        async create() {
          async function* gen() {
            yield { type: 'message_start', message: { id: 'm1' } };
            yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Ciao' } };
            yield { type: 'content_block_delta', delta: { type: 'text_delta', text: ', sono Alba' } };
            yield { type: 'message_delta', usage: { input_tokens: 10, output_tokens: 5 } };
            yield { type: 'message_stop' };
          }
          return gen();
        },
      };
    },
  };
});

// Stub Supabase service-role client
vi.mock('../../../src/lib/server/alba/supabase', () => ({
  albaSupabase: () => ({
    rpc: () => Promise.resolve({ data: 1, error: null }),
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      upsert: () => Promise.resolve({ error: null }),
      select: () => ({
        eq: () => ({
          eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }),
          maybeSingle: () => Promise.resolve({ data: { uid: 'u', msg_count: 0, tokens_in: 0, tokens_out: 0, cost_eur: 0 }, error: null }),
        }),
      }),
    }),
  }),
}));

import { POST } from '../../../src/pages/api/alba/chat';

const mockApi = (body: unknown) => ({
  request: new Request('http://localhost/api/alba/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }),
} as any);

describe('POST /api/alba/chat (SSE)', () => {
  it('risponde con content-type event-stream', async () => {
    const res = await POST(mockApi({
      uid: '11111111-1111-1111-1111-111111111111',
      session_id: '22222222-2222-2222-2222-222222222222',
      messages: [{ role: 'user', content: 'Ciao' }],
      page_context: { url: '/' },
    }));
    expect(res.headers.get('content-type')).toContain('text/event-stream');
  });

  it('emette text chunks e done event', async () => {
    const res = await POST(mockApi({
      uid: '11111111-1111-1111-1111-111111111111',
      session_id: '22222222-2222-2222-2222-222222222222',
      messages: [{ role: 'user', content: 'Ciao' }],
      page_context: { url: '/' },
    }));
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value);
    }
    expect(buf).toContain('"type":"text"');
    expect(buf).toContain('Ciao');
    expect(buf).toContain('"type":"done"');
  });
});

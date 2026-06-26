// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import { POST } from '../../../src/pages/api/alba/session-init';
import { albaSupabase } from '../../../src/lib/server/alba/supabase';

const mockApi = (body: unknown) => ({
  request: new Request('http://localhost/api/alba/session-init', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }),
} as any);

describe('POST /api/alba/session-init', () => {
  const testUid = crypto.randomUUID();

  beforeAll(async () => {
    await albaSupabase().from('alba_users').delete().eq('uid', testUid);
  });

  it('crea nuovo user + sessione, ritorna ab_variant valido', async () => {
    const res = await POST(mockApi({ uid: testUid, page_origin: '/work/eclag' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.uid).toBe(testUid);
    expect(data.session_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(['proactive', 'reactive']).toContain(data.ab_variant);
    expect(data.is_new_user).toBe(true);
  });

  it('returning user mantiene ab_variant invariato', async () => {
    const first = await (await POST(mockApi({ uid: testUid, page_origin: '/' }))).json();
    const second = await (await POST(mockApi({ uid: testUid, page_origin: '/work' }))).json();
    expect(second.ab_variant).toBe(first.ab_variant);
    expect(second.is_new_user).toBe(false);
    expect(second.session_id).not.toBe(first.session_id);
  });

  it('rifiuta uid non-uuid', async () => {
    const res = await POST(mockApi({ uid: 'not-a-uuid', page_origin: '/' }));
    expect(res.status).toBe(400);
  });
});

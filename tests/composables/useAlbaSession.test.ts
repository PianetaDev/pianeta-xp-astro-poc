import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAlbaSession, _resetForTests } from '../../src/composables/useAlbaSession';

// Node 25 native localStorage is non-functional without --localstorage-file.
// Provide a Map-backed in-memory implementation for tests.
const _lsStore = new Map<string, string>();
const _lsMock: Storage = {
  get length() { return _lsStore.size; },
  clear() { _lsStore.clear(); },
  getItem(key: string) { return _lsStore.get(key) ?? null; },
  setItem(key: string, value: string) { _lsStore.set(key, value); },
  removeItem(key: string) { _lsStore.delete(key); },
  key(index: number) { return [..._lsStore.keys()][index] ?? null; },
};
vi.stubGlobal('localStorage', _lsMock);

describe('useAlbaSession', () => {
  beforeEach(() => {
    localStorage.clear();
    _resetForTests();
    vi.restoreAllMocks();
  });

  it('genera un uid e lo persiste in localStorage', () => {
    const s = useAlbaSession();
    expect(s.uid.value).toMatch(/^[0-9a-f-]{36}$/);
    expect(localStorage.getItem('alba_uid')).toBe(s.uid.value);
  });

  it('riusa lo stesso uid su seconda istanza', () => {
    const a = useAlbaSession();
    const uid1 = a.uid.value;
    _resetForTests();
    const b = useAlbaSession();
    expect(b.uid.value).toBe(uid1);
  });

  it('initSession() salva variant ricevuto dal server', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({
      uid: 'xxx', session_id: 'sess-1', ab_variant: 'proactive', is_new_user: true,
    }), { status: 200 }));
    const s = useAlbaSession();
    await s.initSession({ url: '/work/eclag' });
    expect(s.sessionId.value).toBe('sess-1');
    expect(s.variant.value).toBe('proactive');
  });
});

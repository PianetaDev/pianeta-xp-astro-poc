// In-memory cache with TTL.

type Entry = { value: any; expiresAt: number };
const store = new Map<string, Entry>();
const MAX_SIZE = 500;

export function memGet<T = any>(key: string): T | null {
  const e = store.get(key);
  if (!e) return null;
  if (e.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }
  return e.value as T;
}

export function memSet(key: string, value: any, ttlSeconds = 300): void {
  if (store.size >= MAX_SIZE) {
    const first = store.keys().next().value;
    if (first) store.delete(first);
  }
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function hashKey(parts: (string | number | undefined | null)[]): string {
  return parts.map((p) => (p === null || p === undefined ? '' : String(p))).join('|').toLowerCase().trim();
}

// Rotazione via cookie della tile "featured" in home: ogni visita mostra il prossimo
// item del pool (i più recenti non-draft), così i visitor che tornano vedono varietà
// invece di sempre lo stesso case study.
const COOKIE_NAME = 'hero-rotation';
const POOL_COOKIE = 'home-pool-rotation';
const POOL_SIZE = 4;
const MAX_AGE = 60 * 60 * 24 * 365; // 1 anno

interface CookieJar {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options?: Record<string, unknown>): void;
}

export function pickRotatingHero<T extends { id: string }>(sortedPool: T[], cookies: CookieJar): T | undefined {
  if (sortedPool.length === 0) return undefined;
  const pool = sortedPool.slice(0, POOL_SIZE);
  const current = parseInt(cookies.get(COOKIE_NAME)?.value ?? '', 10);
  const nextIndex = Number.isInteger(current) && current >= 0 && current < pool.length
    ? (current + 1) % pool.length
    : 0;
  cookies.set(COOKIE_NAME, String(nextIndex), { path: '/', maxAge: MAX_AGE, sameSite: 'lax' });
  return pool[nextIndex];
}

/** Minimal shape expected by pickRotatingSlots. Callers attach extra fields via generics. */
export interface HomePoolItem {
  kind: 'work' | 'bulletin' | 'post' | 'reel';
  id: string;
  /** Deduplication key: two items with the same non-empty client are never shown together. */
  client?: string;
}

/**
 * Picks `count` items from a unified content pool with client deduplication.
 *
 * The cookie tracks a rotation index so each visit starts from a different
 * position in the pool. Within a single call, any candidate whose `client`
 * matches one already selected is skipped — no two tiles share the same client.
 * Items without a client (undefined / empty) are never deduplicated against each other.
 */
export function pickRotatingSlots<T extends HomePoolItem>(
  sortedPool: T[],
  cookies: CookieJar,
  count: number,
): T[] {
  if (sortedPool.length === 0) return [];
  const current = parseInt(cookies.get(POOL_COOKIE)?.value ?? '', 10);
  const startIndex =
    Number.isInteger(current) && current >= 0 && current < sortedPool.length
      ? (current + 1) % sortedPool.length
      : 0;
  cookies.set(POOL_COOKIE, String(startIndex), { path: '/', maxAge: MAX_AGE, sameSite: 'lax' });

  const selected: T[] = [];
  const seenClients = new Set<string>();
  for (let i = 0; i < sortedPool.length && selected.length < count; i++) {
    const item = sortedPool[(startIndex + i) % sortedPool.length];
    if (!item.client || !seenClients.has(item.client)) {
      selected.push(item);
      if (item.client) seenClients.add(item.client);
    }
  }
  return selected;
}

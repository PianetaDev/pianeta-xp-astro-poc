// Rotazione via cookie della tile "featured" in home: ogni visita mostra il prossimo
// item del pool (i più recenti non-draft), così i visitor che tornano vedono varietà
// invece di sempre lo stesso case study.
const COOKIE_NAME = 'hero-rotation';
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

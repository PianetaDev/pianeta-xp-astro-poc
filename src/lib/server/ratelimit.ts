// IP-based in-memory rate limit.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export class RateLimitError extends Error {
  status = 429;
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export function rateLimit(
  request: Request,
  opts: { key: string; limit: number; windowSeconds: number }
): void {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const bucketKey = `${opts.key}:${ip}`;
  const now = Date.now();
  let b = buckets.get(bucketKey);
  if (!b || b.resetAt < now) {
    b = { count: 0, resetAt: now + opts.windowSeconds * 1000 };
    buckets.set(bucketKey, b);
  }
  b.count++;
  if (b.count > opts.limit) {
    throw new RateLimitError(`Troppe richieste. Riprova tra ${Math.ceil((b.resetAt - now) / 1000)}s.`);
  }
}

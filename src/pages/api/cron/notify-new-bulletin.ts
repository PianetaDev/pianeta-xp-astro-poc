import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

/**
 * Vercel cron — runs daily.
 * For every bulletin entry published in the last 24h, dispatch a broadcast send
 * via the existing /api/broadcast/send endpoint (which uses Resend).
 *
 * Secret: header `authorization: Bearer <CRON_SECRET>`.
 * If CRON_SECRET is unset, falls back to NARRATOR_SECRET so it works in setups
 * where only the narrator key is configured.
 */
export const GET: APIRoute = async ({ request, url }) => {
  const expected = process.env.CRON_SECRET || process.env.NARRATOR_SECRET || '';
  const auth = request.headers.get('authorization') || '';
  if (!expected || auth !== `Bearer ${expected}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }

  const all = await getCollection('bulletin');
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const fresh = all.filter((i: any) => {
    if (i.data.draft === true) return false;
    if (!i.data.date) return false;
    const t = new Date(i.data.date).getTime();
    return (now - t) < DAY;
  });

  if (fresh.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0, message: 'no new bulletin in last 24h' }));
  }

  const narratorSecret = process.env.NARRATOR_SECRET || '';
  const origin = url.origin;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  const results = [];
  for (const item of fresh) {
    try {
      const r = await fetch(`${origin}/api/broadcast/send`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-narrator-secret': narratorSecret,
        },
        body: JSON.stringify({
          type: 'bulletin',
          slug: item.id,
          audienceId,
          topic: 'bulletin',
        }),
      });
      const ok = r.ok;
      results.push({ slug: item.id, status: r.status, ok });
    } catch (e: any) {
      results.push({ slug: item.id, error: e?.message || 'fetch failed' });
    }
  }

  return new Response(JSON.stringify({ ok: true, sent: results.length, results }), {
    headers: { 'content-type': 'application/json' },
  });
};

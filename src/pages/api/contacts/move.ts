import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { resolveAudienceId } from '@/lib/server/resend-audiences';
import { env } from '@/lib/server/env';

export const prerender = false;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get('x-narrator-secret') !== env('NARRATOR_SECRET')) {
    return json({ error: 'unauthorized' }, 401);
  }
  const body = await request.json().catch(() => ({})) as { email?: string; from?: string; to?: string };
  if (!body.email || !body.from || !body.to) return json({ error: 'email, from, to required' }, 400);
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) return json({ error: 'RESEND_API_KEY missing' }, 500);

  const fromId = resolveAudienceId(body.from);
  const toId = resolveAudienceId(body.to);
  const email = body.email.toLowerCase().trim();
  const resend = new Resend(apiKey);

  const list = await (resend as any).contacts.list({ audienceId: fromId });
  const found = list?.data?.data?.find((c: any) => c.email?.toLowerCase() === email);
  if (!found) return json({ error: 'contact not found in source audience' }, 404);

  const created = await (resend as any).contacts.create({
    audienceId: toId,
    email,
    firstName: found.first_name,
    lastName: found.last_name,
    unsubscribed: found.unsubscribed ?? false,
  });
  if (created?.error) return json({ error: `target create failed: ${created.error.message}` }, 502);

  const removed = await (resend as any).contacts.remove({ audienceId: fromId, email });
  return json({
    ok: true,
    email,
    from: fromId,
    to: toId,
    targetContactId: created?.data?.id,
    sourceRemoved: !removed?.error,
  });
};

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
  const body = await request.json().catch(() => ({})) as {
    email?: string; audience?: string; firstName?: string; lastName?: string; unsubscribed?: boolean;
  };
  if (!body.email || !body.audience) return json({ error: 'email and audience required' }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) return json({ error: 'invalid email' }, 400);

  const audienceId = resolveAudienceId(body.audience);
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) return json({ error: 'RESEND_API_KEY missing' }, 500);

  const resend = new Resend(apiKey);
  const res = await (resend as any).contacts.create({
    audienceId,
    email: body.email.toLowerCase().trim(),
    firstName: body.firstName,
    lastName: body.lastName,
    unsubscribed: body.unsubscribed ?? false,
  });
  if (res?.error) return json({ error: `Resend error: ${res.error.message}` }, 502);
  return json({ ok: true, audienceId, contactId: res?.data?.id, email: body.email });
};

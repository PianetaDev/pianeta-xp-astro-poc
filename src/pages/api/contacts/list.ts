import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { resolveAudienceId, AUDIENCES_INFO } from '@/lib/server/resend-audiences';
import { env } from '@/lib/server/env';

export const prerender = false;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const GET: APIRoute = async ({ url, request }) => {
  if (request.headers.get('x-narrator-secret') !== env('NARRATOR_SECRET')) {
    return json({ error: 'unauthorized' }, 401);
  }
  const audience = url.searchParams.get('audience');
  if (!audience) return json({ error: 'audience required (key or uuid)' }, 400);
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) return json({ error: 'RESEND_API_KEY missing' }, 500);

  const audienceId = resolveAudienceId(audience);
  const resend = new Resend(apiKey);
  const res = await (resend as any).contacts.list({ audienceId });
  if (res?.error) return json({ error: `Resend error: ${res.error.message}` }, 502);
  const info = (AUDIENCES_INFO as any)[audience];
  return json({
    audienceId,
    audienceKey: audience,
    label: info?.label,
    count: res?.data?.data?.length ?? 0,
    contacts: res?.data?.data ?? [],
  });
};

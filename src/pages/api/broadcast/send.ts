import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import contentFull from '@/lib/server/content-full.json';
import { renderBroadcastEmail } from '@/lib/server/content-broadcast-email';
import { resolveAudienceId } from '@/lib/server/resend-audiences';
import { manageUrl, unsubscribeUrl } from '@/lib/server/newsletter-tokens';
import { supabaseService } from '@/lib/server/supabase';
import { env, SITE_URL } from '@/lib/server/env';

export const prerender = false;

const ALLOWED = ['work', 'bulletin', 'services'] as const;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get('x-narrator-secret') !== env('NARRATOR_SECRET')) {
    return json({ error: 'unauthorized' }, 401);
  }

  const body = await request.json().catch(() => ({})) as {
    type?: 'work' | 'bulletin' | 'services';
    slug?: string;
    to?: string;
    audience?: string;
    audienceId?: string;
    topic?: 'bulletin' | 'announcements';
    preview?: boolean;
  };

  if (!body.type || !body.slug || !ALLOWED.includes(body.type)) {
    return json({ error: 'invalid type or slug' }, 400);
  }
  const item = (contentFull as any)[body.type]?.[body.slug];
  if (!item) return json({ error: `content ${body.type}/${body.slug} not found` }, 404);

  const audienceId = body.audience
    ? resolveAudienceId(body.audience)
    : (body.audienceId || env('RESEND_AUDIENCE_ID') || undefined);

  if (body.preview) {
    const rendered = renderBroadcastEmail({ type: body.type, item, audienceId });
    return json({ ...rendered, item: { title: item.title, path: item.path } });
  }

  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) return json({ error: 'RESEND_API_KEY missing' }, 500);
  const resend = new Resend(apiKey);
  const from = 'Pianeta.Studio <bulletin@pianeta.studio>';

  if (body.to) {
    const rendered = renderBroadcastEmail({
      type: body.type, item, audienceId,
      recipientEmail: body.to,
      manageUrl: manageUrl(SITE_URL, body.to),
      unsubscribeUrl: unsubscribeUrl(SITE_URL, body.to),
    });
    const res = await resend.emails.send({
      from, to: body.to,
      subject: rendered.subject, html: rendered.html, text: rendered.text,
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl(SITE_URL, body.to)}>` },
    });
    if ((res as any).error) return json({ error: `Resend error: ${(res as any).error.message}` }, 502);
    return json({ ok: true, mode: 'single', to: body.to, id: (res as any).data?.id, subject: rendered.subject });
  }

  if (body.topic) {
    const sb = supabaseService();
    const { data: subs, error } = await sb.from('newsletter_subscribers')
      .select('email, topics')
      .not('confirmed_at', 'is', null)
      .is('unsubscribed_at', null);
    if (error) return json({ error: error.message }, 500);

    const recipients = (subs || []).filter((s: any) => s.topics?.[body.topic!] === true);
    const results = { ok: 0, failed: 0, errors: [] as string[] };
    for (let i = 0; i < recipients.length; i++) {
      const email = recipients[i].email;
      const rendered = renderBroadcastEmail({
        type: body.type, item,
        recipientEmail: email,
        manageUrl: manageUrl(SITE_URL, email),
        unsubscribeUrl: unsubscribeUrl(SITE_URL, email),
      });
      try {
        const res = await resend.emails.send({
          from, to: email,
          subject: rendered.subject, html: rendered.html, text: rendered.text,
          headers: { 'List-Unsubscribe': `<${unsubscribeUrl(SITE_URL, email)}>` },
        });
        if ((res as any).error) { results.failed++; results.errors.push(`${email}: ${(res as any).error.message}`); }
        else results.ok++;
      } catch (e: any) { results.failed++; results.errors.push(`${email}: ${e?.message}`); }
      if ((i + 1) % 5 === 0) await sleep(200);
    }
    return json({ ok: true, mode: 'topic', topic: body.topic, total: recipients.length, ...results });
  }

  if (audienceId) {
    const rendered = renderBroadcastEmail({ type: body.type, item, audienceId });
    const broadcast = await (resend as any).broadcasts.create({
      audienceId, from,
      subject: rendered.subject, html: rendered.html, text: rendered.text,
      name: `${body.type}/${body.slug} · ${new Date().toISOString().slice(0, 10)}`,
    });
    if (broadcast?.error) return json({ error: `Resend broadcast error: ${broadcast.error.message}` }, 502);
    const sent = await (resend as any).broadcasts.send(broadcast.data.id);
    return json({ ok: true, mode: 'audience', audienceId, broadcastId: broadcast.data?.id, sent: !!sent, subject: rendered.subject });
  }

  return json({ error: 'no recipient: provide `to`, `topic`, or `audience`' }, 400);
};

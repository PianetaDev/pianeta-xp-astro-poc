import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { isValidEmail, generateConfirmToken, type TopicKey } from './_lib';
import { supabaseService } from '@/lib/server/supabase';
import { renderConfirmEmail } from '@/lib/server/newsletter-emails';
import { env, SITE_URL } from '@/lib/server/env';

export const prerender = false;

const DEFAULT_TOPICS: Record<TopicKey, boolean> = { bulletin: true, announcements: true };

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null) as {
    email?: string;
    sourcePage?: string;
    utm?: Record<string, string>;
    consentMarketing?: boolean;
    topics?: Partial<Record<TopicKey, boolean>>;
  } | null;

  if (!body || !isValidEmail(body.email || '')) return json({ error: 'invalid email' }, 400);
  if (!body.consentMarketing) return json({ error: 'consent required' }, 400);

  const sb = supabaseService();
  const resend = new Resend(env('RESEND_API_KEY'));

  const email = body.email!.trim().toLowerCase();
  const token = generateConfirmToken();
  const topics = { ...DEFAULT_TOPICS, ...(body.topics || {}) };

  const { data: existing } = await sb.from('newsletter_subscribers')
    .select('id, confirmed_at').eq('email', email).maybeSingle();
  if (existing?.confirmed_at) return json({ status: 'already-subscribed' });

  const { error: upsertErr } = await sb.from('newsletter_subscribers').upsert({
    email,
    source_page: body.sourcePage ?? null,
    utm: body.utm ?? null,
    consent_marketing: body.consentMarketing,
    confirm_token: token,
    topics,
  }, { onConflict: 'email' });
  if (upsertErr) return json({ error: upsertErr.message }, 500);

  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${token}`;
  const tpl = renderConfirmEmail(email, confirmUrl);

  await resend.emails.send({
    from: 'Pianeta.Studio <bulletin@pianeta.studio>',
    to: email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });

  return json({ status: 'pending-confirmation' });
};

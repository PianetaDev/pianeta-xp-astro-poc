import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseService } from '@/lib/server/supabase';
import { verifyManageToken, manageUrl, unsubscribeUrl } from '@/lib/server/newsletter-tokens';
import { renderPrefsUpdatedEmail } from '@/lib/server/newsletter-emails';
import { env, SITE_URL } from '@/lib/server/env';

export const prerender = false;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const GET: APIRoute = async ({ url }) => {
  const email = url.searchParams.get('email');
  const t = url.searchParams.get('t');
  if (!email || !t) return json({ error: 'missing email or token' }, 400);
  if (!verifyManageToken(email, t)) return json({ error: 'invalid token' }, 401);

  const sb = supabaseService();
  const { data, error } = await sb.from('newsletter_subscribers')
    .select('email, topics, confirmed_at, unsubscribed_at')
    .eq('email', email.toLowerCase().trim()).maybeSingle();
  if (error || !data) return json({ error: 'subscriber not found' }, 404);

  return json({
    email: data.email,
    topics: data.topics || { bulletin: true, announcements: true },
    confirmed: !!data.confirmed_at,
    unsubscribed: !!data.unsubscribed_at,
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null) as { email?: string; t?: string; topics?: Record<string, boolean> } | null;
  if (!body?.email || !body?.t) return json({ error: 'missing email or token' }, 400);
  if (!verifyManageToken(body.email, body.t)) return json({ error: 'invalid token' }, 401);

  const sb = supabaseService();
  const email = body.email.toLowerCase().trim();

  const { data: current } = await sb.from('newsletter_subscribers')
    .select('topics').eq('email', email).maybeSingle();
  if (!current) return json({ error: 'subscriber not found' }, 404);

  const merged = { ...(current.topics || {}), ...(body.topics || {}) };

  const { error } = await sb.from('newsletter_subscribers')
    .update({ topics: merged }).eq('email', email);
  if (error) return json({ error: error.message }, 500);

  try {
    const resend = new Resend(env('RESEND_API_KEY'));
    const tpl = renderPrefsUpdatedEmail(email, manageUrl(SITE_URL, email), unsubscribeUrl(SITE_URL, email));
    await resend.emails.send({
      from: 'Pianeta.Studio <bulletin@pianeta.studio>',
      to: email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
  } catch (e) { console.error('Prefs email error', e); }

  return json({ ok: true, topics: merged });
};

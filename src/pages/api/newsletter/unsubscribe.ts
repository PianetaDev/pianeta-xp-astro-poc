import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseService } from '@/lib/server/supabase';
import { verifyManageToken } from '@/lib/server/newsletter-tokens';
import { renderUnsubscribeEmail } from '@/lib/server/newsletter-emails';
import { env, SITE_URL } from '@/lib/server/env';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const email = url.searchParams.get('email');
  const t = url.searchParams.get('t');
  if (!email || !t) return new Response('missing email or token', { status: 400 });
  if (!verifyManageToken(email, t)) return new Response('invalid token', { status: 401 });

  const sb = supabaseService();
  const e = email.toLowerCase().trim();

  const { data: sub } = await sb.from('newsletter_subscribers')
    .select('locale').eq('email', e).maybeSingle();
  const locale: 'it' | 'en' = sub?.locale === 'en' ? 'en' : 'it';
  const prefix = locale === 'en' ? '/en' : '';

  await sb.from('newsletter_subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('email', e);

  try {
    const resend = new Resend(env('RESEND_API_KEY'));
    const audienceId = env('RESEND_AUDIENCE_ID');
    if (audienceId) {
      await (resend as any).contacts.remove({ audienceId, email: e });
    }
  } catch (err) { console.error('Resend remove error', err); }

  try {
    const resend = new Resend(env('RESEND_API_KEY'));
    const tpl = renderUnsubscribeEmail(e);
    await resend.emails.send({
      from: 'Pianeta.Studio <bulletin@pianeta.studio>',
      to: e,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
  } catch (err) { console.error('Goodbye email error', err); }

  return Response.redirect(`${SITE_URL}${prefix}/bulletin/disiscritto?email=${encodeURIComponent(e)}`, 302);
};

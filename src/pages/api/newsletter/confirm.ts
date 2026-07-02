import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseService } from '@/lib/server/supabase';
import { renderWelcomeEmail } from '@/lib/server/newsletter-emails';
import { manageUrl, unsubscribeUrl } from '@/lib/server/newsletter-tokens';
import { env, SITE_URL } from '@/lib/server/env';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token');
  if (!token) return new Response('missing token', { status: 400 });

  const sb = supabaseService();
  const resend = new Resend(env('RESEND_API_KEY'));

  const { data: sub, error } = await sb.from('newsletter_subscribers')
    .select('id, email, confirmed_at, locale')
    .eq('confirm_token', token).maybeSingle();
  if (error || !sub) return new Response('token not found', { status: 404 });

  const locale: 'it' | 'en' = sub.locale === 'en' ? 'en' : 'it';
  const prefix = locale === 'en' ? '/en' : '';

  if (sub.confirmed_at) {
    return Response.redirect(`${SITE_URL}${prefix}/bulletin/confermato?already=1&email=${encodeURIComponent(sub.email)}`, 302);
  }

  let audienceId: string | undefined;
  const resendAudienceId = env('RESEND_AUDIENCE_ID');
  if (resendAudienceId) {
    try {
      const r = await resend.contacts.create({ email: sub.email, audienceId: resendAudienceId });
      audienceId = (r as any)?.data?.id || undefined;
    } catch (e) { console.error('Resend audiences error', e); }
  }

  await sb.from('newsletter_subscribers').update({
    confirmed_at: new Date().toISOString(),
    resend_audience_id: audienceId ?? null,
    confirm_token: null,
  }).eq('id', sub.id);

  try {
    const tpl = renderWelcomeEmail(sub.email, manageUrl(SITE_URL, sub.email, locale), unsubscribeUrl(SITE_URL, sub.email));
    await resend.emails.send({
      from: 'Pianeta.Studio <bulletin@pianeta.studio>',
      to: sub.email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
  } catch (e) { console.error('Welcome email error', e); }

  return Response.redirect(`${SITE_URL}${prefix}/bulletin/confermato?email=${encodeURIComponent(sub.email)}`, 302);
};

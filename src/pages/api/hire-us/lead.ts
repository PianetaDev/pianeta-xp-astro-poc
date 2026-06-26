import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { validateLeadInput, type LeadInput } from './_lib';
import { supabaseService } from '@/lib/server/supabase';
import { renderLeadEmail } from '@/lib/server/hire-us-email';
import { env } from '@/lib/server/env';

export const prerender = false;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null) as LeadInput | null;
  const v = validateLeadInput(body);
  if (!v.ok) return json({ error: v.error }, 400);

  const sb = supabaseService();
  const resend = new Resend(env('RESEND_API_KEY'));

  const { data: insert, error } = await sb.from('hire_us_leads').insert({
    email: body!.email.trim().toLowerCase(),
    name: body!.name?.trim() || null,
    company: body!.company?.trim() || null,
    description: body!.description.trim(),
    budget_range: body!.budget_range || null,
    timeline: body!.timeline || null,
    transcript: body!.transcript || null,
    alba_session_id: body!.albaSessionId || null,
  }).select('id').single();
  if (error) return json({ error: error.message }, 500);

  await resend.emails.send({
    from: 'Pianeta noreply <noreply@pianeta.studio>',
    to: 'info@pianeta.studio',
    subject: `✍ Nuovo lead Hire Us — ${body!.name || body!.email}`,
    html: renderLeadEmail(body),
  });

  return json({ ok: true, id: insert?.id });
};

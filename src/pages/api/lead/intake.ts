import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { env } from '@/lib/server/env';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type IntakeBody = {
  nome?: string;
  email?: string;
  azienda?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  descrizione?: string;
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function renderIntakeEmail(b: Required<IntakeBody>): string {
  const row = (k: string, v: string) => `<dt style="font-weight:600;color:#222;margin-top:8px">${escapeHtml(k)}</dt><dd style="margin:0 0 4px 0;color:#444">${escapeHtml(v || '—')}</dd>`;
  return `
<h2>✍ Nuovo lead — form pubblico /lavoriamo-insieme</h2>
<dl style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5">
  ${row('Nome', b.nome)}
  ${row('Email', b.email)}
  ${row('Azienda', b.azienda)}
  ${row('Tipo progetto', b.projectType)}
  ${row('Budget', b.budget)}
  ${row('Timeline', b.timeline)}
</dl>
<h3>Descrizione</h3>
<blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;white-space:pre-wrap">${escapeHtml(b.descrizione)}</blockquote>
<hr>
<p style="font-size:12px;color:#999">Risposta entro 24h. — Sistema Pianeta.Studio</p>
`;
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null) as IntakeBody | null;
  if (!body || typeof body !== 'object') return json({ error: 'invalid body' }, 400);

  const nome = (body.nome || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const descrizione = (body.descrizione || '').trim();

  if (!nome) return json({ error: 'nome required' }, 400);
  if (!email || !EMAIL_RE.test(email)) return json({ error: 'invalid email' }, 400);
  if (!descrizione) return json({ error: 'descrizione required' }, 400);

  const azienda = (body.azienda || '').trim();
  const projectType = (body.projectType || '').trim();
  const budget = (body.budget || '').trim();
  const timeline = (body.timeline || '').trim();

  const resend = new Resend(env('RESEND_API_KEY'));

  try {
    await resend.emails.send({
      from: 'Pianeta noreply <noreply@pianeta.studio>',
      to: 'max@pianeta.studio',
      reply_to: email,
      subject: `[Lead] ${projectType || 'Generic'} — ${nome}${azienda ? ' — ' + azienda : ''}`,
      html: renderIntakeEmail({ nome, email, azienda, projectType, budget, timeline, descrizione }),
    });
  } catch (e: any) {
    return json({ error: e?.message || 'send failed' }, 500);
  }

  return json({ ok: true });
};

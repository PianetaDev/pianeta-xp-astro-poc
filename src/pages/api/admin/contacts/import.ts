import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { requireAdminCookie } from '../../../../lib/server/admin-session';
import { resolveAudienceId } from '../../../../lib/server/resend-audiences';
import { env } from '../../../../lib/server/env';

export const prerender = false;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = requireAdminCookie(cookies);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({})) as {
    audience?: string;
    contacts?: Array<{ email: string; firstName?: string; lastName?: string }>;
  };
  if (!body.audience || !Array.isArray(body.contacts) || !body.contacts.length) {
    return json({ error: 'audience and contacts[] required' }, 400);
  }
  if (body.contacts.length > 1000) return json({ error: 'max 1000 contacts per import' }, 400);

  const audienceId = resolveAudienceId(body.audience);
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) return json({ error: 'RESEND_API_KEY missing' }, 500);

  const resend = new Resend(apiKey);
  const results = { ok: 0, skipped: 0, failed: 0, errors: [] as string[] };

  for (let i = 0; i < body.contacts.length; i++) {
    const c = body.contacts[i];
    if (!c.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)) { results.skipped++; continue; }
    try {
      const res = await (resend as any).contacts.create({
        audienceId,
        email: c.email.toLowerCase().trim(),
        firstName: c.firstName,
        lastName: c.lastName,
        unsubscribed: false,
      });
      if (res?.error) { results.failed++; results.errors.push(`${c.email}: ${res.error.message}`); }
      else results.ok++;
    } catch (e: any) {
      results.failed++;
      results.errors.push(`${c.email}: ${e?.message || 'unknown'}`);
    }
    if ((i + 1) % 5 === 0) await sleep(200);
  }

  return json({ audienceId, ...results, total: body.contacts.length });
};

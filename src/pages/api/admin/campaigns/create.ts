import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * POST /api/admin/campaigns/create
 *
 * Bootstrap: ritorna il markdown frontmatter pronto da committare in
 * src/content/campaigns/<slug>.md.
 *
 * Fase 2 (TODO): scrivere su Supabase + push a GitHub via gh API,
 * così l'admin può salvare senza commit manuale.
 *
 * Fase 3 (TODO): se channel === 'google-ads' e payload completo →
 * crea bozza campagna via Google Ads API (vedi /api/ads/google/launch).
 *
 * Auth: header `x-admin-secret: $ADMIN_SECRET` (env).
 */
export const POST: APIRoute = async ({ request }) => {
  const secret = process.env.ADMIN_SECRET || '';
  if (!secret || request.headers.get('x-admin-secret') !== secret) {
    // Per ora niente auth in dev — abilitare quando si imposta ADMIN_SECRET su Vercel
    if (process.env.NODE_ENV === 'production' && secret) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
    }
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return new Response(JSON.stringify({ error: 'invalid body' }), { status: 400 });
  }

  const { title, slug, description, channel, objective, startDate, endDate, budgetTotal, landingPage, audience, notes } = body as Record<string, any>;

  if (!title || !slug || !/^[a-z0-9-]+$/.test(slug)) {
    return new Response(JSON.stringify({ error: 'title + slug (kebab-case) richiesti' }), { status: 400 });
  }

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    description && `description: ${JSON.stringify(description)}`,
    `channel: "${channel || 'google-ads'}"`,
    `objective: "${objective || 'leads'}"`,
    'status: "draft"',
    startDate && `startDate: ${startDate}`,
    endDate && `endDate: ${endDate}`,
    budgetTotal && `budgetTotal: ${Number(budgetTotal)}`,
    landingPage && `landingPage: ${JSON.stringify(landingPage)}`,
    audience && `audience: ${JSON.stringify(audience)}`,
    notes && `notes: ${JSON.stringify(notes)}`,
    `date: ${new Date().toISOString().slice(0, 10)}`,
    'locale: it',
    'draft: false',
    'type: campaign',
    '---',
    '',
    description ? `${description}\n\n` : '',
    notes ? `## Note\n\n${notes}\n` : '',
  ].filter(Boolean).join('\n');

  return new Response(JSON.stringify({
    ok: true,
    file: `src/content/campaigns/${slug}.md`,
    content: frontmatter,
    next: `Salvalo nel repo come src/content/campaigns/${slug}.md, commit + push, deploy → la trovi su /admin/campaigns.`,
  }), { headers: { 'content-type': 'application/json' } });
};

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getCategoryByKey, PROCESS_PHASES } from '../../../lib/services-categories';

export const prerender = false;

// GET /api/services/[slug].json?locale=it|en — dettaglio singolo servizio
// locale=en reads from servicesEn collection; falls back to IT if EN sidecar doesn't exist.
export const GET: APIRoute = async ({ params, site, url }) => {
  const slug = params.slug;
  const locale = (url.searchParams.get('locale') || 'it').toLowerCase() === 'en' ? 'en' : 'it';

  const primary = locale === 'en' ? 'servicesEn' : 'services';
  const allPrimary = (await getCollection(primary as any)).filter((i: any) => i.data.draft !== true);
  const allFallback = locale === 'en'
    ? (await getCollection('services')).filter((i: any) => i.data.draft !== true)
    : allPrimary;

  const all = allFallback; // used for siblings/next (always IT ordering)
  const item = allPrimary.find((i: any) => i.id === slug) ?? allFallback.find((i: any) => i.id === slug);
  if (!item) {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }
  const data: any = item.data;
  const base = site?.toString().replace(/\/$/, '') || 'https://xp.pianeta.studio';

  const category = data.category ? getCategoryByKey(data.category) : null;

  // Sibling services (same category, exclude self, top 3)
  const siblings = all
    .filter((s: any) => s.data.category === data.category && s.id !== item.id)
    .sort((a: any, b: any) => (a.data.order ?? 999) - (b.data.order ?? 999))
    .slice(0, 3)
    .map((s: any) => ({ slug: s.id, title: s.data.title, description: s.data.description }));

  // Next service (by order within all, simple wrap-around)
  const sorted = all.sort((a: any, b: any) => (a.data.order ?? 999) - (b.data.order ?? 999));
  const idx = sorted.findIndex((s: any) => s.id === item.id);
  const nextRaw: any = idx >= 0 ? sorted[(idx + 1) % sorted.length] : null;
  const nextItem = nextRaw && nextRaw.id !== item.id
    ? { slug: nextRaw.id, title: nextRaw.data.title, description: nextRaw.data.description }
    : null;

  const phaseTag = data.processPhase != null
    ? (() => {
        const p = PROCESS_PHASES.find((x) => x.num === data.processPhase);
        return p ? `${p.num} · ${p.title}` : null;
      })()
    : null;

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${base}/services/${item.id}`,
    slug: item.id,
    name: data.title || item.id,
    description: data.description,
    url: `${base}/services/${item.id}`,
    body: item.body || '',
    category: data.category || null,
    categoryLabel: (locale === 'en' ? category?.titleEN : category?.titleIT) || null,
    phaseTag,
    inputClient: data.inputClient ?? [],
    deliverables: data.deliverables ?? [],
    siblings,
    nextItem,
    pricing: data.pricing ?? { label: 'Personalizzato — contatta max@pianeta.studio', cta: 'Lavoriamo insieme' },
    team: data.team ?? [],
    case_studies: (data.caseStudies ?? []).map((s: string) => ({
      slug: s,
      url: `${base}/work/${s}`,
      detail_url: `${base}/api/work/${s}.json`,
    })),
    cover: data.cover ? `${base}${data.cover}` : null,
    provider: {
      '@type': 'Organization',
      name: 'Pianeta.Studio',
      url: base,
      taxID: 'IT06037730873',
      email: 'max@pianeta.studio',
    },
    contact_actions: [
      { type: 'email', target: 'mailto:max@pianeta.studio?subject=Servizio%20' + encodeURIComponent(data.title || item.id) },
      { type: 'chat', target: `${base}/?alba=open&topic=${encodeURIComponent(item.id)}` },
    ],
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'access-control-allow-origin': '*',
    },
  });
};

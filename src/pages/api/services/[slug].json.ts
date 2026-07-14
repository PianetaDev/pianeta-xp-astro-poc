import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/services/[slug].json — dettaglio singolo servizio
export const GET: APIRoute = async ({ params, site }) => {
  const slug = params.slug;
  const all = await getCollection('services');
  const item = all.find((i: any) => i.id === slug && i.data.draft !== true);
  if (!item) {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }
  const data: any = item.data;
  const base = site?.toString().replace(/\/$/, '') || 'https://xp.pianeta.studio';

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${base}/services/${item.id}`,
    slug: item.id,
    name: data.title || item.id,
    description: data.description,
    url: `${base}/services/${item.id}`,
    body: item.body || '',
    category: data.category || 'Design & Technology',
    deliverables: data.deliverables ?? [],
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

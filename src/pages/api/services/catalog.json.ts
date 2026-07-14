import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/services/catalog.json — catalogo pubblico agent-readable
export const GET: APIRoute = async ({ site }) => {
  const all = await getCollection('services');
  const items = all
    .filter((i: any) => i.data.draft !== true)
    .sort((a: any, b: any) => (a.data.order ?? 999) - (b.data.order ?? 999));

  const base = site?.toString().replace(/\/$/, '') || 'https://xp.pianeta.studio';

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Pianeta.Studio — Servizi',
    description: 'Catalogo servizi di Pianeta.Studio: Sustainable Creativity · Design & Technology. Endpoint progettato per agenti AI.',
    url: `${base}/api/services/catalog.json`,
    provider: {
      '@type': 'Organization',
      name: 'Pianeta.Studio',
      url: base,
      taxID: 'IT06037730873',
    },
    generatedAt: new Date().toISOString(),
    services: items.map((it: any) => ({
      '@type': 'Service',
      '@id': `${base}/services/${it.id}`,
      slug: it.id,
      name: it.data.title || it.id,
      description: it.data.description,
      url: `${base}/services/${it.id}`,
      detail_url: `${base}/api/services/${it.id}.json`,
      category: it.data.category || 'Design & Technology',
      deliverables: it.data.deliverables ?? [],
      pricing_note: it.data.pricing?.label || 'Personalizzato — contatta max@pianeta.studio',
      case_studies: (it.data.caseStudies ?? []).map((s: string) => `${base}/work/${s}`),
    })),
    contact: {
      sales: 'max@pianeta.studio',
      pre_sales_ai: 'alba@pianeta.studio',
      docs: `${base}/llms.txt`,
    },
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

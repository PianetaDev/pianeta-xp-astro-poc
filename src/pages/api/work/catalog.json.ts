import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/work/catalog.json — portfolio projects, agent-readable
export const GET: APIRoute = async ({ site }) => {
  const all = await getCollection('work');
  const items = all
    .filter((i: any) => i.data.draft !== true)
    .sort((a: any, b: any) => {
      const da = a.data.date ? new Date(a.data.date).getTime() : 0;
      const db = b.data.date ? new Date(b.data.date).getTime() : 0;
      return db - da;
    });

  const base = site?.toString().replace(/\/$/, '') || 'https://xp.pianeta.studio';

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pianeta.Studio — Work',
    description: 'Portfolio progetti e case study di Pianeta.Studio',
    url: `${base}/api/work/catalog.json`,
    provider: {
      '@type': 'Organization',
      name: 'Pianeta.Studio',
      url: base,
      taxID: 'IT06037730873',
    },
    generatedAt: new Date().toISOString(),
    items: items.map((it: any) => ({
      '@type': 'CreativeWork',
      '@id': `${base}/work/${it.id}`,
      slug: it.id,
      name: it.data.title || it.id,
      description: it.data.description || undefined,
      url: `${base}/work/${it.id}`,
      detail_url: `${base}/api/work/${it.id}.json`,
      client: it.data.client || undefined,
      year: it.data.year || undefined,
      category: it.data.category || undefined,
      sector: it.data.sector || undefined,
      tags: it.data.tags ?? [],
      services: it.data.services ?? [],
      team: it.data.team ?? [],
      live_url: it.data.links?.live || undefined,
    })),
    contact: {
      sales: 'info@pianeta.studio',
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

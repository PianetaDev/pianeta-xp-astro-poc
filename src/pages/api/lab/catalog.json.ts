import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/lab/catalog.json — R&D projects, agent-readable
export const GET: APIRoute = async ({ site }) => {
  const all = await getCollection('lab');
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
    name: 'Pianeta.Studio — Lab',
    description: 'Progetti R&D, esperimenti e strumenti proprietari di Pianeta.Studio',
    url: `${base}/api/lab/catalog.json`,
    provider: {
      '@type': 'Organization',
      name: 'Pianeta.Studio',
      url: base,
      taxID: 'IT06037730873',
    },
    generatedAt: new Date().toISOString(),
    items: items.map((it: any) => ({
      '@type': 'CreativeWork',
      '@id': `${base}/lab/${it.id}`,
      slug: it.id,
      name: it.data.title || it.id,
      description: it.data.description || undefined,
      url: `${base}/lab/${it.id}`,
      detail_url: `${base}/api/lab/${it.id}.json`,
      kind: it.data.kind || undefined,
      year: it.data.year || undefined,
      status: it.data.status || undefined,
      tags: it.data.tags ?? [],
      external_link: it.data.links?.external || undefined,
    })),
    contact: {
      sales: 'info@pianeta.studio',
      lab: 'lab@pianeta.studio',
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

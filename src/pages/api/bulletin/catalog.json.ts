import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/bulletin/catalog.json — editorial articles, agent-readable
export const GET: APIRoute = async ({ site }) => {
  const all = await getCollection('bulletin');
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
    '@type': 'CollectionPage',
    name: 'Pianeta.Studio — Bulletin',
    description: 'Editoriale interno: articoli, ricerche e prospettive di Pianeta.Studio',
    url: `${base}/api/bulletin/catalog.json`,
    provider: {
      '@type': 'Organization',
      name: 'Pianeta.Studio',
      url: base,
      taxID: 'IT06037730873',
    },
    generatedAt: new Date().toISOString(),
    items: items.map((it: any) => ({
      '@type': 'Article',
      '@id': `${base}/bulletin/${it.id}`,
      slug: it.id,
      name: it.data.title || it.id,
      description: it.data.description || undefined,
      url: `${base}/bulletin/${it.id}`,
      detail_url: `${base}/api/bulletin/${it.id}.json`,
      date: it.data.date ? new Date(it.data.date).toISOString() : undefined,
      authors: it.data.authors ?? [],
      issue: it.data.issue || undefined,
      tags: it.data.tags ?? [],
      related_work: it.data.relatedWork ?? [],
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

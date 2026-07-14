import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/bulletin/[slug].json — single bulletin article detail
export const GET: APIRoute = async ({ params, site }) => {
  const slug = params.slug;
  const all = await getCollection('bulletin');
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
    '@type': 'Article',
    '@id': `${base}/bulletin/${item.id}`,
    slug: item.id,
    name: data.title || item.id,
    description: data.description || undefined,
    url: `${base}/bulletin/${item.id}`,
    body: item.body || '',
    date: data.date ? new Date(data.date).toISOString() : undefined,
    authors: data.authors ?? [],
    issue: data.issue || undefined,
    tags: data.tags ?? [],
    related_work: (data.relatedWork ?? []).map((s: string) => ({
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

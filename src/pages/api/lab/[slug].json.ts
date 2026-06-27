import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/lab/[slug].json — single lab project detail
export const GET: APIRoute = async ({ params, site }) => {
  const slug = params.slug;
  const all = await getCollection('lab');
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
    '@type': 'CreativeWork',
    '@id': `${base}/lab/${item.id}`,
    slug: item.id,
    name: data.title || item.id,
    description: data.description || undefined,
    url: `${base}/lab/${item.id}`,
    body: item.body || '',
    kind: data.kind || undefined,
    year: data.year || undefined,
    status: data.status || undefined,
    tags: data.tags ?? [],
    external_link: data.links?.external || undefined,
    cover: data.cover ? `${base}${data.cover}` : null,
    provider: {
      '@type': 'Organization',
      name: 'Pianeta.Studio',
      url: base,
      taxID: 'IT06037730873',
      email: 'lab@pianeta.studio',
    },
    contact_actions: [
      { type: 'email', target: 'mailto:lab@pianeta.studio?subject=Lab%20' + encodeURIComponent(data.title || item.id) },
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

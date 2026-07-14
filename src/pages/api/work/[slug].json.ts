import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/work/[slug].json — single work project detail
export const GET: APIRoute = async ({ params, site }) => {
  const slug = params.slug;
  const all = await getCollection('work');
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
    '@id': `${base}/work/${item.id}`,
    slug: item.id,
    name: data.title || item.id,
    description: data.description || undefined,
    url: `${base}/work/${item.id}`,
    body: item.body || '',
    client: data.client || undefined,
    year: data.year || undefined,
    category: data.category || undefined,
    sector: data.sector || undefined,
    tags: data.tags ?? [],
    services: (data.services ?? []).map((s: string) => ({
      slug: s,
      detail_url: `${base}/api/services/${s}.json`,
    })),
    team: data.team ?? [],
    live_url: data.links?.live || undefined,
    cover: data.cover ? `${base}${data.cover}` : null,
    provider: {
      '@type': 'Organization',
      name: 'Pianeta.Studio',
      url: base,
      taxID: 'IT06037730873',
      email: 'max@pianeta.studio',
    },
    contact_actions: [
      { type: 'email', target: 'mailto:max@pianeta.studio?subject=Case%20study%20' + encodeURIComponent(data.title || item.id) },
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

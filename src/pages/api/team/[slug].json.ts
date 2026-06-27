import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/team/[slug].json — single team member detail
export const GET: APIRoute = async ({ params, site }) => {
  const slug = params.slug;
  const all = await getCollection('team');
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
    '@type': 'Person',
    '@id': `${base}/team/${item.id}`,
    slug: item.id,
    name: data.name || data.title || item.id,
    description: data.description || undefined,
    url: `${base}/team/${item.id}`,
    body: item.body || '',
    role: data.role || undefined,
    employment: data.employment || undefined,
    since: data.since || undefined,
    location: data.location || undefined,
    email: data.email || undefined,
    expertise: data.expertise ?? [],
    tags: data.tags ?? [],
    photo: data.photo ? `${base}${data.photo}` : null,
    worksFor: {
      '@type': 'Organization',
      name: 'Pianeta.Studio',
      url: base,
      taxID: 'IT06037730873',
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

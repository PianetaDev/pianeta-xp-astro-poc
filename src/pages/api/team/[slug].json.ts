import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/team/[slug].json?locale=it|en — single team member detail
// Locale=en reads from teamEn collection; falls back to IT if the EN sidecar
// doesn't exist so the overlay always renders something.
export const GET: APIRoute = async ({ params, site, url }) => {
  const slug = params.slug;
  const locale = (url.searchParams.get('locale') || 'it').toLowerCase() === 'en' ? 'en' : 'it';

  const primary = locale === 'en' ? 'teamEn' : 'team';
  const fallback = locale === 'en' ? 'team' : 'teamEn';

  const primaryAll = await getCollection(primary as any);
  let item: any = primaryAll.find((i: any) => i.id === slug && i.data.draft !== true);
  let usedFallback = false;
  if (!item) {
    const fallbackAll = await getCollection(fallback as any);
    item = fallbackAll.find((i: any) => i.id === slug && i.data.draft !== true);
    usedFallback = !!item;
  }

  if (!item) {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }

  const data: any = item.data;
  const base = site?.toString().replace(/\/$/, '') || 'https://xp.pianeta.studio';
  const detailUrl = locale === 'en' ? `${base}/en/team/${item.id}` : `${base}/team/${item.id}`;

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': detailUrl,
    slug: item.id,
    locale,
    fallback: usedFallback || undefined,
    name: data.name || data.title || item.id,
    title: data.title || data.name || item.id,
    description: data.description || undefined,
    url: detailUrl,
    body: item.body || '',
    role: data.role || undefined,
    kind: data.kind || 'core',
    discipline: data.discipline || undefined,
    employment: data.employment || undefined,
    since: data.since || undefined,
    location: data.location || undefined,
    email: data.email || undefined,
    expertise: data.expertise ?? [],
    skills: data.skills ?? data.expertise ?? [],
    tags: data.tags ?? [],
    links: data.links ?? undefined,
    photo: data.photo ? `${base}${data.photo}` : null,
    cover: data.cover ? `${base}${data.cover}` : null,
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

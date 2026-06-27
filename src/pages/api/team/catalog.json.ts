import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// GET /api/team/catalog.json — team members, agent-readable
export const GET: APIRoute = async ({ site }) => {
  const all = await getCollection('team');
  const items = all
    .filter((i: any) => i.data.draft !== true)
    .sort((a: any, b: any) => (a.data.order ?? 999) - (b.data.order ?? 999));

  const base = site?.toString().replace(/\/$/, '') || 'https://xp.pianeta.studio';

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pianeta.Studio — Team',
    description: 'Le persone di Pianeta.Studio: team fisso e collaboratori chiave',
    url: `${base}/api/team/catalog.json`,
    provider: {
      '@type': 'Organization',
      name: 'Pianeta.Studio',
      url: base,
      taxID: 'IT06037730873',
    },
    generatedAt: new Date().toISOString(),
    items: items.map((it: any) => ({
      '@type': 'Person',
      '@id': `${base}/team/${it.id}`,
      slug: it.id,
      name: it.data.name || it.data.title || it.id,
      description: it.data.description || undefined,
      url: `${base}/team/${it.id}`,
      detail_url: `${base}/api/team/${it.id}.json`,
      role: it.data.role || undefined,
      employment: it.data.employment || undefined,
      since: it.data.since || undefined,
      location: it.data.location || undefined,
      email: it.data.email || undefined,
    })),
    contact: {
      people: 'people@pianeta.studio',
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

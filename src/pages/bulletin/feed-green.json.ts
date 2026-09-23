import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it';

export const prerender = true;

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

const SITE = 'https://xp.pianeta.studio';

function calcReadingTime(body: string, override?: string): string {
  if (override) return override;
  const wordCount = Math.max(1, Math.round((body?.length ?? 0) / 5.5));
  return `${Math.max(1, Math.round(wordCount / 225))} min`;
}

export const GET: APIRoute = async () => {
  const all = await getCollection('bulletin');

  const items = all
    .filter((i: any) => i.data.draft !== true && (i.data.spoke ?? 'studio') === 'green')
    .sort((a: any, b: any) => {
      const da = a.data.date ? new Date(a.data.date).getTime() : 0;
      const db = b.data.date ? new Date(b.data.date).getTime() : 0;
      return db - da;
    })
    .map((item: any) => {
      const d = item.data;
      const html = md.render(item.body ?? '');
      const canonical = `${SITE}/bulletin/${item.id}`;
      const cover = d.cover || d.ogImage
        ? (d.cover || d.ogImage).startsWith('http')
          ? (d.cover || d.ogImage)
          : `${SITE}${d.cover || d.ogImage}`
        : null;

      return {
        slug: item.id,
        title: d.title ?? item.id,
        description: d.description ?? null,
        date: d.date ? new Date(d.date).toISOString() : null,
        topics: d.topics ?? [],
        readingTime: calcReadingTime(item.body ?? '', d.readingTime),
        cover,
        html,
        canonical,
      };
    });

  const payload = {
    version: '1.0',
    spoke: 'green',
    updated: new Date().toISOString(),
    source: SITE,
    items,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};

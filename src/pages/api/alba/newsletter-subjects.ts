import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { generateSubjects } from '../../../lib/server/alba/subject-generator';

export const prerender = false;
const ALLOWED = ['bulletin', 'work', 'services'] as const;

export const POST: APIRoute = async ({ request }) => {
  const expected = process.env.NARRATOR_SECRET || '';
  if (request.headers.get('x-narrator-secret') !== expected) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }
  const body = (await request.json().catch(() => null)) as { type?: string; slug?: string } | null;
  if (!body || !body.type || !body.slug || !ALLOWED.includes(body.type as any)) {
    return new Response(JSON.stringify({ error: 'invalid type/slug' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }
  const items = await getCollection(body.type as any);
  const item: any = items.find((i: any) => i.id === body.slug);
  if (!item) return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: { 'content-type': 'application/json' } });
  const result = await generateSubjects({
    type: body.type as any,
    slug: body.slug,
    title: item.data.title || body.slug,
    description: item.data.description,
    body: item.body,
    tags: item.data.tags,
  });
  return new Response(JSON.stringify(result), { status: result.ok ? 200 : 500, headers: { 'content-type': 'application/json' } });
};

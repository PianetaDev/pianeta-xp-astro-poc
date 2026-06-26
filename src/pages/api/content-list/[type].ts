import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const VALID = ['work', 'bulletin', 'services', 'team', 'lab', 'careers'] as const;
type T = (typeof VALID)[number];

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const type = params.type as string;
  if (!VALID.includes(type as T)) {
    return new Response(JSON.stringify({ error: 'invalid type' }), { status: 400 });
  }

  const items = await getCollection(type as T);

  const live = items.filter((i: any) => i.data.draft !== true);

  const sorted = live.sort((a: any, b: any) => {
    const da = a.data.date ? new Date(a.data.date).getTime() : 0;
    const db = b.data.date ? new Date(b.data.date).getTime() : 0;
    return db - da;
  });

  const mapped = sorted.map((i: any) => ({
    path: `/${type}/${i.id}`,
    title: i.data.title || i.id,
    name: i.data.name,
    description: i.data.description,
    cover: i.data.cover,
    photo: i.data.photo,
    client: i.data.client,
    year: i.data.year,
    role: i.data.role,
    date: i.data.date,
    deliverables: i.data.deliverables,
    kind: i.data.kind,
    employmentType: i.data.employmentType,
    location: i.data.location,
  }));

  return new Response(JSON.stringify(mapped), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=60' },
  });
};

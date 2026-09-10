// GET  /api/media/photos — list published Pianeta media photos (canvas load)
// POST /api/media/photos — staff bulk ingest (bearer-token protected)
import type { APIRoute } from 'astro';
import { mediaSupabaseService, PHOTO_SELECT_FIELDS } from '../../../lib/server/media-supabase';
import { env } from '../../../lib/server/env';
import { timingSafeEqual } from 'node:crypto';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function tokenMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const GET: APIRoute = async () => {
  const db = mediaSupabaseService();
  const { data, error } = await db
    .from('pianeta_media_photos')
    .select(PHOTO_SELECT_FIELDS)
    .eq('status', 'published')
    .not('pos_x', 'is', null)
    .order('created_at', { ascending: true })
    .limit(2000);
  if (error) return json({ error: error.message }, 500);
  const res = new Response(JSON.stringify({ photos: data ?? [] }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
  return res;
};

export const POST: APIRoute = async ({ request }) => {
  const uploadToken = env('PIANETA_MEDIA_UPLOAD_TOKEN');
  if (!uploadToken) return json({ error: 'Upload not configured' }, 503);

  const authorization = request.headers.get('authorization') ?? '';
  const provided = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!provided || !tokenMatches(provided, uploadToken)) return json({ error: 'Unauthorized' }, 401);

  type UsageInput = { contentType: string; contentSlug: string; field?: string };
  type PhotoInput = {
    storagePath: string;
    /** Usages many-to-many: dove viene usata questa foto sul sito */
    usages?: UsageInput[];
  };
  let body: { photos?: PhotoInput[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  if (!body?.photos?.length) return json({ error: 'photos array required' }, 400);

  const db = mediaSupabaseService();
  const results = [];

  for (const item of body.photos) {
    // Derive project_slug cache from first usage (for Three.js clustering)
    const firstUsage = item.usages?.[0];
    const projectSlugCache = firstUsage ? `${firstUsage.contentType}/${firstUsage.contentSlug}` : null;

    const { data: row, error: insertErr } = await db
      .from('pianeta_media_photos')
      .insert({
        storage_path: item.storagePath,
        project_slug: projectSlugCache,
        source: 'staff',
        status: 'published',
      })
      .select()
      .single();
    if (insertErr || !row) {
      results.push({ storagePath: item.storagePath, error: insertErr?.message || 'insert failed' });
      continue;
    }

    // Insert usages (ignore duplicates via upsert)
    if (item.usages?.length) {
      const usageRows = item.usages.map((u) => ({
        photo_id: row.id,
        content_type: u.contentType,
        content_slug: u.contentSlug,
        field: u.field ?? 'cover',
      }));
      const { error: usageErr } = await db
        .from('pianeta_media_usages')
        .upsert(usageRows, { onConflict: 'photo_id,content_type,content_slug,field' });
      if (usageErr) {
        results.push({ id: row.id, storagePath: item.storagePath, usageError: usageErr.message });
        continue;
      }
    }

    results.push({ id: row.id, storagePath: item.storagePath });
  }

  return json({ results });
};

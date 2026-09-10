// GET /api/media/similar?id=<photoId> — vicini per embedding (Vedi simili)
import type { APIRoute } from 'astro';
import { mediaSupabaseService, PHOTO_SELECT_FIELDS } from '../../../lib/server/media-supabase';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function normalizeEmbedding(embedding: unknown): number[] | null {
  if (!embedding) return null;
  if (Array.isArray(embedding)) return embedding as number[];
  if (typeof embedding === 'string') {
    const trimmed = (embedding as string).trim().replace(/^\[/, '').replace(/\]$/, '');
    if (!trimmed) return null;
    const parsed = trimmed.split(',').map(Number);
    return parsed.every(Number.isFinite) ? parsed : null;
  }
  return null;
}

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'id required' }, 400);

  const db = mediaSupabaseService();

  const { data: source, error: sourceErr } = await db
    .from('pianeta_media_photos')
    .select('embedding')
    .eq('id', id)
    .single();
  if (sourceErr || !source) return json({ error: sourceErr?.message || 'not found' }, 404);

  const embedding = normalizeEmbedding((source as any).embedding);
  if (!embedding) return json({ photos: [] });

  const { data: nearest, error: nearestErr } = await db.rpc('pianeta_media_photos_nearest', {
    query_embedding: `[${embedding.join(',')}]`,
    k: 16,
    exclude_id: id,
  });
  if (nearestErr) return json({ error: nearestErr.message }, 500);
  if (!nearest || nearest.length === 0) return json({ photos: [] });

  const orderedIds: string[] = (nearest as Array<{ id: string }>).map((n) => n.id);
  const { data: rows, error: rowsErr } = await db
    .from('pianeta_media_photos')
    .select(PHOTO_SELECT_FIELDS)
    .in('id', orderedIds);
  if (rowsErr) return json({ error: rowsErr.message }, 500);

  const byId = new Map((rows ?? []).map((r: any) => [r.id, r]));
  const photos = orderedIds.map((rid) => byId.get(rid)).filter(Boolean);

  const res = new Response(JSON.stringify({ photos }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
  return res;
};

// GET /api/media/search?q=... — ricerca ibrida semantica + lessicale
// Usa pianeta_media_photos_hybrid_search (definita nella migration SQL).
import type { APIRoute } from 'astro';
import { mediaSupabaseService } from '../../../lib/server/media-supabase';
import { env } from '../../../lib/server/env';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function embedText(text: string): Promise<number[] | null> {
  const key = env('OPENAI_API_KEY');
  if (!key || !text.trim()) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: text.slice(0, 8000) }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const vec = data?.data?.[0]?.embedding;
    return Array.isArray(vec) && vec.length === 1536 ? vec : null;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get('q') ?? '';
  const db = mediaSupabaseService();
  const embedding = q ? await embedText(q) : null;

  const { data, error } = await db.rpc('pianeta_media_photos_hybrid_search', {
    query_text: q,
    query_embedding: embedding ? `[${embedding.join(',')}]` : null,
    match_count: 80,
  });
  if (error) return json({ error: error.message }, 500);

  // Apply relevance floor (exclude very-low-score noise)
  const results = (data ?? []) as Array<{ similarity_score: number }>;
  const floor = q ? 0.08 : 0;
  const filtered = results.filter((r) => r.similarity_score >= floor);

  return json({ photos: filtered });
};

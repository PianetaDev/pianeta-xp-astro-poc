// GET /api/media/thumb?path=<storage path>
// Proxy dei thumbnail Supabase Storage attraverso il dominio xp.pianeta.studio,
// per evitare blocchi ad-blocker / Cloudflare WAF sul dominio *.supabase.co.
import type { APIRoute } from 'astro';
import { mediaSupabaseService, MEDIA_BUCKET } from '../../../lib/server/media-supabase';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const path = url.searchParams.get('path');
  if (!path) {
    return new Response(JSON.stringify({ error: 'path required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  // Security: reject path traversal attempts
  if (path.includes('..') || path.startsWith('/') || path.includes('\\') || path.includes('\0')) {
    return new Response(JSON.stringify({ error: 'invalid path' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const db = mediaSupabaseService();
  const { data, error } = await db.storage.from(MEDIA_BUCKET()).download(path);
  if (error || !data) {
    return new Response(JSON.stringify({ error: error?.message || 'not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }

  const buffer = await data.arrayBuffer();
  return new Response(buffer, {
    headers: {
      'content-type': 'image/jpeg',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};

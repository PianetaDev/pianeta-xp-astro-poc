// GET /api/kb/search?q=<testo>
// Ricerca full-text nel Knowledge Graph (entities, facts, decisions).
// Accesso: admin cookie (browser) OPPURE KB_SERVICE_TOKEN (agenti via header Bearer).
import type { APIRoute } from 'astro';
import { supabaseService } from '../../../lib/server/supabase';
import { requireAdminCookie } from '../../../lib/server/admin-session';
import { env } from '../../../lib/server/env';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function isAuthorized(request: Request, cookies: any): boolean {
  // Cookie admin (browser)
  const cookieAuth = requireAdminCookie(cookies);
  if (cookieAuth.ok) return true;
  // Bearer token (agenti)
  const token = env('KB_SERVICE_TOKEN');
  if (token) {
    const auth = request.headers.get('authorization') || '';
    if (auth === `Bearer ${token}`) return true;
  }
  return false;
}

export const GET: APIRoute = async ({ url, request, cookies }) => {
  if (!isAuthorized(request, cookies)) {
    return json({ error: 'unauthorized' }, 401);
  }

  const q = (url.searchParams.get('q') ?? '').trim();
  if (!q) return json({ results: [] });

  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '40'), 100);

  const sb = supabaseService();
  const { data, error } = await sb.rpc('kb_search', {
    query_text: q,
    result_limit: limit,
  }, { schema: 'pianeta' });

  if (error) return json({ error: error.message }, 500);
  return json({ results: data ?? [] });
};

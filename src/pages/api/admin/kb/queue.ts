// GET /api/admin/kb/queue — lista proposals in_attesa
// Admin cookie required.
import type { APIRoute } from 'astro';
import { supabaseService } from '../../../../lib/server/supabase';
import { requireAdminCookie } from '../../../../lib/server/admin-session';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ cookies, url }) => {
  const auth = requireAdminCookie(cookies);
  if (!auth.ok) return auth.response;

  const stato = url.searchParams.get('stato') ?? 'in_attesa';

  const sb = supabaseService();
  const { data, error } = await sb
    .schema('pianeta')
    .from('kb_proposals')
    .select('*')
    .eq('stato', stato)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return json({ error: error.message }, 500);
  return json({ proposals: data ?? [] });
};

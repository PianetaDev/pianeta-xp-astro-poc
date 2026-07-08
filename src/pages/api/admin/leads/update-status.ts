import type { APIRoute } from 'astro';
import { requireAdminCookie } from '../../../../lib/server/admin-session';
import { supabaseService } from '../../../../lib/server/supabase';

export const prerender = false;

const VALID_STATUSES = ['draft', 'sent', 'replied', 'call', 'won', 'discarded'];

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = requireAdminCookie(cookies);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const id = body?.id;
  const status = body?.status;

  if (!id || typeof id !== 'string') return json({ error: 'id richiesto' }, 400);
  if (!VALID_STATUSES.includes(status)) return json({ error: `status non valido (${VALID_STATUSES.join(', ')})` }, 400);

  const sb = supabaseService();
  const { data, error } = await sb
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, status')
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, lead: data });
};

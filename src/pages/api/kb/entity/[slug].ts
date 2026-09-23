// GET /api/kb/entity/:slug
// Restituisce un'entità con i suoi fatti correnti, backlink e decisioni collegate.
// Accesso: admin cookie (browser) OPPURE KB_SERVICE_TOKEN (agenti via header Bearer).
import type { APIRoute } from 'astro';
import { supabaseService } from '../../../../lib/server/supabase';
import { requireAdminCookie } from '../../../../lib/server/admin-session';
import { env } from '../../../../lib/server/env';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function isAuthorized(request: Request, cookies: any): boolean {
  const cookieAuth = requireAdminCookie(cookies);
  if (cookieAuth.ok) return true;
  const token = env('KB_SERVICE_TOKEN');
  if (token) {
    const auth = request.headers.get('authorization') || '';
    if (auth === `Bearer ${token}`) return true;
  }
  return false;
}

export const GET: APIRoute = async ({ params, request, cookies }) => {
  if (!isAuthorized(request, cookies)) {
    return json({ error: 'unauthorized' }, 401);
  }

  const slug = params.slug ?? '';
  if (!slug) return json({ error: 'missing slug' }, 400);

  const sb = supabaseService();

  // Fetch entity
  const { data: entity, error: entityError } = await sb
    .schema('pianeta')
    .from('kb_entities')
    .select('*')
    .eq('slug', slug)
    .single();

  if (entityError || !entity) return json({ error: 'not found' }, 404);

  // Fetch current facts (non superati)
  const { data: facts } = await sb
    .schema('pianeta')
    .from('kb_facts')
    .select('*')
    .eq('entity_id', entity.id)
    .neq('stato', 'superato')
    .order('recorded_at', { ascending: false });

  // Fetch superseded facts (for history)
  const { data: supersededFacts } = await sb
    .schema('pianeta')
    .from('kb_facts')
    .select('*')
    .eq('entity_id', entity.id)
    .eq('stato', 'superato')
    .order('recorded_at', { ascending: false });

  // Fetch outgoing relations (backlinks: altre entità che citano questa)
  const { data: relationsTo } = await sb
    .schema('pianeta')
    .from('kb_relations')
    .select('*, from_entity:from_id(id, slug, name, type)')
    .eq('to_id', entity.id);

  // Fetch outgoing relations (questa entità punta ad altre)
  const { data: relationsFrom } = await sb
    .schema('pianeta')
    .from('kb_relations')
    .select('*, to_entity:to_id(id, slug, name, type)')
    .eq('from_id', entity.id);

  // Fetch linked decisions
  const { data: decisionLinks } = await sb
    .schema('pianeta')
    .from('kb_decision_entities')
    .select('*, decision:decision_id(*)')
    .eq('entity_id', entity.id);

  return json({
    entity,
    facts: facts ?? [],
    supersededFacts: supersededFacts ?? [],
    backlinks: relationsTo ?? [],
    relationsFrom: relationsFrom ?? [],
    decisions: (decisionLinks ?? []).map((l: any) => l.decision).filter(Boolean),
  });
};

// POST /api/admin/kb/:proposalId/decide
// Body: { action: 'approva' | 'respingi' | 'correggi', nota?: string, correction?: object }
// Admin cookie required.
//
// - approva: crea il fatto o la decisione, segna proposal come 'approvata'
// - respingi: segna proposal come 'respinta' (con nota facoltativa)
// - correggi: applica correction al payload, poi crea il record e segna 'corretta'
import type { APIRoute } from 'astro';
import { supabaseService } from '../../../../../lib/server/supabase';
import { requireAdminCookie } from '../../../../../lib/server/admin-session';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function applyFact(sb: any, payload: any): Promise<{ id: string } | null> {
  const { data, error } = await sb
    .schema('pianeta')
    .from('kb_facts')
    .insert({
      entity_id: payload.entity_id,
      testo: payload.testo,
      stato: payload.stato ?? 'verità',
      valid_from: payload.valid_from ?? null,
      valid_to: payload.valid_to ?? null,
      superseded_by: payload.superseded_by ?? null,
      fonte: payload.fonte ?? {},
      deciso_da: payload.deciso_da ?? null,
      visibilita: payload.visibilita ?? 'privato',
    })
    .select('id')
    .single();
  if (error) return null;
  return data;
}

async function applyDecision(sb: any, payload: any): Promise<{ id: string } | null> {
  const { data, error } = await sb
    .schema('pianeta')
    .from('kb_decisions')
    .insert({
      titolo: payload.titolo,
      contesto: payload.contesto ?? null,
      decisione: payload.decisione,
      alternative: payload.alternative ?? null,
      conseguenze: payload.conseguenze ?? null,
      stato: payload.stato ?? 'approvata',
      superseded_by: payload.superseded_by ?? null,
      chi: payload.chi ?? null,
      quando: payload.quando ?? null,
      fonte: payload.fonte ?? {},
    })
    .select('id')
    .single();
  if (error) return null;
  return data;
}

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const auth = requireAdminCookie(cookies);
  if (!auth.ok) return auth.response;

  const proposalId = params.proposalId ?? '';
  if (!proposalId) return json({ error: 'missing proposalId' }, 400);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  const { action, nota, correction } = body ?? {};
  if (!action || !['approva', 'respingi', 'correggi'].includes(action)) {
    return json({ error: 'action must be approva|respingi|correggi' }, 400);
  }

  const sb = supabaseService();

  // Fetch proposal
  const { data: proposal, error: fetchError } = await sb
    .schema('pianeta')
    .from('kb_proposals')
    .select('*')
    .eq('id', proposalId)
    .single();

  if (fetchError || !proposal) return json({ error: 'proposal not found' }, 404);
  if (proposal.stato !== 'in_attesa') return json({ error: 'proposal already decided' }, 409);

  if (action === 'respingi') {
    const { error } = await sb
      .schema('pianeta')
      .from('kb_proposals')
      .update({ stato: 'respinta', nota_revisore: nota ?? null, updated_at: new Date().toISOString() })
      .eq('id', proposalId);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, stato: 'respinta' });
  }

  // approva o correggi: crea il record
  const finalPayload = action === 'correggi' && correction
    ? { ...proposal.payload, ...correction }
    : proposal.payload;

  let createdId: string | null = null;
  let updateFields: any = { stato: action === 'correggi' ? 'corretta' : 'approvata', nota_revisore: nota ?? null, updated_at: new Date().toISOString() };

  if (proposal.kind === 'fact') {
    const created = await applyFact(sb, finalPayload);
    if (!created) return json({ error: 'failed to create fact' }, 500);
    createdId = created.id;
    updateFields.created_fact_id = createdId;
  } else if (proposal.kind === 'decision') {
    const created = await applyDecision(sb, finalPayload);
    if (!created) return json({ error: 'failed to create decision' }, 500);
    createdId = created.id;
    updateFields.created_decision_id = createdId;
  }

  const { error: updateError } = await sb
    .schema('pianeta')
    .from('kb_proposals')
    .update(updateFields)
    .eq('id', proposalId);

  if (updateError) return json({ error: updateError.message }, 500);
  return json({ ok: true, stato: updateFields.stato, created_id: createdId });
};

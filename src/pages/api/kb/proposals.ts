// POST /api/kb/proposals — coda agenti
// Gli agenti NON scrivono fatti/decisioni direttamente: solo proposals.
// Accesso: KB_SERVICE_TOKEN obbligatorio (header Bearer). Admin cookie non sufficiente qui.
import type { APIRoute } from 'astro';
import { supabaseService } from '../../../lib/server/supabase';
import { env } from '../../../lib/server/env';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const token = env('KB_SERVICE_TOKEN');
  if (!token) return json({ error: 'kb proposals not configured' }, 500);

  const auth = request.headers.get('authorization') || '';
  if (auth !== `Bearer ${token}`) return json({ error: 'unauthorized' }, 401);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  const { kind, payload, agente } = body ?? {};
  if (!kind || !['fact', 'decision'].includes(kind)) {
    return json({ error: 'kind must be "fact" or "decision"' }, 400);
  }
  if (!payload || typeof payload !== 'object') {
    return json({ error: 'payload required' }, 400);
  }
  if (!agente || typeof agente !== 'string') {
    return json({ error: 'agente required' }, 400);
  }

  const sb = supabaseService();
  const { data, error } = await sb
    .schema('pianeta')
    .from('kb_proposals')
    .insert({ kind, payload, agente, stato: 'in_attesa' })
    .select('id, kind, agente, stato, created_at')
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ proposal: data }, 201);
};

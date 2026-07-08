// Sync additivo Alba -> leads (CRM commerciale condiviso con /admin/leads).
// Non tocca mai alba_users/alba_events: sola lettura su `leads` per dedup + insert.
// Va sempre chiamato dentro un try/catch dal chiamante: un fallimento qui non deve
// mai rompere il flusso chat pubblico di Alba.

import type { SupabaseClient } from '@supabase/supabase-js';

export type AlbaLeadStatus = 'draft' | 'call';

export interface AlbaLeadSyncInput {
  email: string;
  name?: string | null;
  status?: AlbaLeadStatus;
}

/**
 * Specchia un contatto Alba (email lasciata in chat) nella tabella `leads` con
 * source='alba'. Idempotente: se esiste già una riga leads con lo stesso
 * (source='alba', email), non fa nulla (niente doppioni, niente update dello
 * status esistente — coerente con lo script di backfill one-off).
 */
export async function syncAlbaLead(sb: SupabaseClient, input: AlbaLeadSyncInput): Promise<void> {
  const email = input.email?.trim();
  if (!email) return;
  const status: AlbaLeadStatus = input.status ?? 'draft';

  const { data: existing, error: selErr } = await sb
    .from('leads')
    .select('id')
    .eq('source', 'alba')
    .eq('email', email)
    .maybeSingle();
  if (selErr) throw selErr;
  if (existing) return;

  const { error: insErr } = await sb.from('leads').insert({
    source: 'alba',
    company: null,
    contact_name: input.name ?? null,
    email,
    status,
  });
  if (insErr) throw insErr;
}

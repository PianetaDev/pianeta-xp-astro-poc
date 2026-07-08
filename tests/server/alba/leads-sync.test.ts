// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { syncAlbaLead } from '../../../src/lib/server/alba/leads-sync';

// Fake Supabase client minimale, sufficiente per la superficie usata da syncAlbaLead
// (leads.select().eq().eq().maybeSingle() + leads.insert()).
function makeFakeSupabase(opts: { existing?: { id: string } | null; selectError?: unknown; insertError?: unknown }) {
  const insert = vi.fn().mockResolvedValue({ error: opts.insertError ?? null });
  const maybeSingle = vi.fn().mockResolvedValue({ data: opts.existing ?? null, error: opts.selectError ?? null });
  const eq2 = vi.fn(() => ({ maybeSingle }));
  const eq1 = vi.fn(() => ({ eq: eq2 }));
  const select = vi.fn(() => ({ eq: eq1 }));
  const from = vi.fn(() => ({ select, insert }));
  return { client: { from } as any, insert, select, maybeSingle };
}

describe('syncAlbaLead', () => {
  it('inserisce una nuova riga leads (source=alba) quando non esiste già', async () => {
    const { client, insert, select } = makeFakeSupabase({ existing: null });

    await syncAlbaLead(client, { email: 'nuovo@esempio.it', name: 'Nuovo Utente', status: 'draft' });

    expect(select).toHaveBeenCalled();
    expect(insert).toHaveBeenCalledWith({
      source: 'alba',
      company: null,
      contact_name: 'Nuovo Utente',
      email: 'nuovo@esempio.it',
      status: 'draft',
    });
  });

  it('non inserisce nulla se esiste già un lead alba con la stessa email (idempotente)', async () => {
    const { client, insert } = makeFakeSupabase({ existing: { id: 'lead-123' } });

    await syncAlbaLead(client, { email: 'gia@esempio.it', name: 'Già Presente', status: 'call' });

    expect(insert).not.toHaveBeenCalled();
  });

  it('non fa nulla se email è vuota o mancante', async () => {
    const { client, insert, select } = makeFakeSupabase({ existing: null });

    await syncAlbaLead(client, { email: '   ' });

    expect(select).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
  });

  it('usa status="draft" di default quando non specificato', async () => {
    const { client, insert } = makeFakeSupabase({ existing: null });

    await syncAlbaLead(client, { email: 'default@esempio.it' });

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ status: 'draft' }));
  });

  it('propaga l\'errore se la select fallisce (il chiamante deve gestirlo in try/catch)', async () => {
    const { client } = makeFakeSupabase({ existing: null, selectError: new Error('boom-select') });

    await expect(syncAlbaLead(client, { email: 'errore@esempio.it' })).rejects.toThrow('boom-select');
  });

  it('propaga l\'errore se l\'insert fallisce', async () => {
    const { client } = makeFakeSupabase({ existing: null, insertError: new Error('boom-insert') });

    await expect(syncAlbaLead(client, { email: 'errore-insert@esempio.it' })).rejects.toThrow('boom-insert');
  });
});

import type { APIRoute } from 'astro';
import { fetchKPILast7Days, isConfigured } from '@/lib/server/google-ads';

export const prerender = false;

/**
 * Vercel cron — daily 08:00 UTC.
 * Pesca KPI degli ultimi 7 giorni da Google Ads e ritorna l'aggregato.
 *
 * TODO: scrivere su Supabase (tabella campaign_kpis) o aggiornare in
 * place i markdown campaigns/*.md via gh API. Per ora ritorna i numeri.
 *
 * Auth: header `authorization: Bearer <CRON_SECRET>` (fallback NARRATOR_SECRET).
 */
export const GET: APIRoute = async ({ request }) => {
  const expected = process.env.CRON_SECRET || process.env.NARRATOR_SECRET || '';
  if (!expected || request.headers.get('authorization') !== `Bearer ${expected}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }
  if (!isConfigured()) {
    return new Response(JSON.stringify({ ok: false, error: 'google-ads-not-configured' }), { status: 501 });
  }
  try {
    const rows = await fetchKPILast7Days();
    return new Response(JSON.stringify({ ok: true, count: rows.length, rows }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 500 });
  }
};

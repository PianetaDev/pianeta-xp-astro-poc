import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/server/admin-auth';
import { createDraftCampaign, isConfigured } from '@/lib/server/google-ads';

export const prerender = false;

/**
 * POST /api/ads/google/launch
 *
 * Crea una campagna PAUSED su Google Ads (Search default). Niente enable
 * automatico — Max o le colleghe enabilitano manualmente dal pannello
 * Google Ads dopo aver fatto QA su keyword/ad copy.
 *
 * Body: { title, budgetEurDaily, startDate, endDate?, channelType? }
 * Auth: header `x-admin-secret` (env ADMIN_SECRET)
 *
 * Risposta 200 → { ok: true, resourceName, budgetResourceName, googleAdsCampaignId }
 * Risposta 401 → auth
 * Risposta 501 → google-ads-not-configured (env mancanti)
 */
export const POST: APIRoute = async ({ request }) => {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  if (!isConfigured()) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'google-ads-not-configured',
      next_steps: 'Configurare GOOGLE_ADS_* env vars su Vercel. Vedi docs/ads-pipeline.md.',
    }), { status: 501 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.budgetEurDaily || !body?.startDate) {
    return new Response(JSON.stringify({ error: 'title + budgetEurDaily + startDate richiesti' }), { status: 400 });
  }

  try {
    const result = await createDraftCampaign({
      title: body.title,
      budgetEurDaily: Number(body.budgetEurDaily),
      startDate: body.startDate,
      endDate: body.endDate,
      channelType: body.channelType,
    });
    const googleAdsCampaignId = result.resourceName.split('/').pop();
    return new Response(JSON.stringify({
      ok: true,
      googleAdsCampaignId,
      resourceName: result.resourceName,
      budgetResourceName: result.budgetResourceName,
      status: 'PAUSED',
      next: `Vai sul pannello Google Ads → enable manuale dopo QA. Poi aggiorna googleAdsCampaignId nel md della campagna.`,
    }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'unknown' }), { status: 500 });
  }
};

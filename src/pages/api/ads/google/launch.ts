import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * POST /api/ads/google/launch
 *
 * Stub: chiamerà Google Ads API per creare una bozza di Search/Display
 * Campaign nell'account MCC di Pianeta.Studio.
 *
 * STATO: NON ANCORA WIRED. Servono prima:
 *
 * 1. Google Ads Developer Token (richiesta via My Client Center, 1–2 settimane di approvazione)
 * 2. OAuth client (Google Cloud Console → Credentials → OAuth 2.0 Client)
 * 3. Refresh token generato dall'account che opera (Max)
 * 4. Customer ID MCC + Customer ID account operativo
 *
 * Env attesi:
 *   GOOGLE_ADS_DEVELOPER_TOKEN
 *   GOOGLE_ADS_CLIENT_ID
 *   GOOGLE_ADS_CLIENT_SECRET
 *   GOOGLE_ADS_REFRESH_TOKEN
 *   GOOGLE_ADS_LOGIN_CUSTOMER_ID   (MCC)
 *   GOOGLE_ADS_CUSTOMER_ID         (account operativo)
 *
 * Una volta in mano, usare la libreria `google-ads-api` (npm) e:
 *   const client = new GoogleAdsApi({ client_id, client_secret, developer_token });
 *   const customer = client.Customer({ customer_id, login_customer_id, refresh_token });
 *   await customer.campaigns.create({ ... });
 *
 * Vedi docs/ads-pipeline.md per il workflow operativo completo.
 */
export const POST: APIRoute = async ({ request }) => {
  const secret = process.env.ADMIN_SECRET || '';
  if (!secret || request.headers.get('x-admin-secret') !== secret) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }

  const hasDevToken = !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const hasOAuth = !!process.env.GOOGLE_ADS_CLIENT_ID && !!process.env.GOOGLE_ADS_REFRESH_TOKEN;
  if (!hasDevToken || !hasOAuth) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'google-ads-not-configured',
      missing: {
        developer_token: !hasDevToken,
        oauth: !hasOAuth,
      },
      next_steps: 'Vedi docs/ads-pipeline.md — sezione "Google Ads setup".',
    }), { status: 501 });
  }

  // TODO: implementare quando le credenziali sono presenti.
  return new Response(JSON.stringify({ ok: false, error: 'not-implemented' }), { status: 501 });
};

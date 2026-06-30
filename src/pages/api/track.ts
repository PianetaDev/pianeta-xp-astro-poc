import type { APIRoute } from 'astro';
import { supabaseService } from '@/lib/server/supabase';
import { ga4Send } from '@/lib/server/ga4';

export const prerender = false;

// Tracciamento conversioni hire → Supabase (engine_conversions). Indipendente da Google Ads:
// BEACON legge da qui (event/offer/variant/gclid) per il loop settimanale. Degrada in silenzio.
export const POST: APIRoute = async ({ request }) => {
  let b: any = {};
  try { b = await request.json(); } catch { /* empty */ }
  const event = String(b.event || '').slice(0, 60);
  if (!event) return new Response(null, { status: 204 });
  try {
    await supabaseService().from('engine_conversions').insert({
      event,
      offer: b.offer ? String(b.offer).slice(0, 60) : null,
      variant: b.variant ? String(b.variant).slice(0, 8) : null,
      gclid: b.gclid ? String(b.gclid).slice(0, 200) : null,
      page: b.page ? String(b.page).slice(0, 200) : null,
      meta: b.meta && typeof b.meta === 'object' ? b.meta : {},
    });
  } catch (e) { /* tabella mancante o supabase off → non bloccare */ }

  // Mirror del funnel in GA4 (lato server). 'hire_purchase' lo possiede il webhook Stripe (evento 'purchase'), qui lo saltiamo.
  const gaClientId = b.gaClientId ? String(b.gaClientId).slice(0, 64) : '';
  if (gaClientId && event !== 'hire_purchase') {
    const name = event.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40);
    await ga4Send(gaClientId, [{
      name,
      params: {
        offer: b.offer ? String(b.offer).slice(0, 60) : undefined,
        variant: b.variant ? String(b.variant).slice(0, 8) : undefined,
        page_location: b.page ? String(b.page).slice(0, 200) : undefined,
      },
    }]);
  }
  return new Response(null, { status: 204 });
};

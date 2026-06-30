import type { APIRoute } from 'astro';
import { supabaseService } from '@/lib/server/supabase';

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
  return new Response(null, { status: 204 });
};

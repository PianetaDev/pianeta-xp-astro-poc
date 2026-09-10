/**
 * Supabase client per il modulo Pianeta Media (pianeta_media_photos).
 * Vive sul progetto Supabase di Bosco Colto (zero costo aggiuntivo, schema
 * isolato) — usa env var distinte da quelle del progetto Pianeta per evitare
 * qualsiasi ambiguità.
 *
 * Env var richieste (da aggiungere su Vercel + .env.local):
 *   BOSCO_SUPABASE_URL            — Supabase project URL di Bosco Colto
 *   BOSCO_SUPABASE_ANON_KEY       — chiave anon (lettura pubblica lato client)
 *   BOSCO_SUPABASE_SERVICE_KEY    — chiave service role (scrittura server-side)
 *   PIANETA_MEDIA_BUCKET          — nome bucket Storage (es. pianeta-media-photos)
 *   PIANETA_MEDIA_UPLOAD_TOKEN    — token bearer per upload staff
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let _service: SupabaseClient | null = null;

export function mediaSupabaseService(): SupabaseClient {
  if (_service) return _service;
  const url = env('BOSCO_SUPABASE_URL');
  const key = env('BOSCO_SUPABASE_SERVICE_KEY');
  if (!url || !key) {
    throw new Error('Missing BOSCO_SUPABASE_URL or BOSCO_SUPABASE_SERVICE_KEY');
  }
  _service = createClient(url, key, { auth: { persistSession: false } });
  return _service;
}

export const MEDIA_BUCKET = () => env('PIANETA_MEDIA_BUCKET') || 'pianeta-media-photos';

// Seleziona i campi foto + usages annidati (join via Supabase embedded select).
// usages è la fonte di verità per "dove viene usata questa foto".
export const PHOTO_SELECT_FIELDS =
  'id, storage_path, thumbnail_path, caption, pos_x, pos_y, color_avg_hex, project_slug, tags, is_favorite, metadata, photographer, captured_at, gps_lat, gps_lng, pianeta_media_usages(id, content_type, content_slug, field)';

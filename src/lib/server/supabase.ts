import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let _anon: SupabaseClient | null = null;
let _service: SupabaseClient | null = null;

export function supabaseAnon(): SupabaseClient {
  if (_anon) return _anon;
  const url = env('NUXT_PUBLIC_SUPABASE_URL') || env('SUPABASE_URL');
  const key = env('SUPABASE_ANON_KEY');
  _anon = createClient(url, key, { auth: { persistSession: false } });
  return _anon;
}

export function supabaseService(): SupabaseClient {
  if (_service) return _service;
  const url = env('NUXT_PUBLIC_SUPABASE_URL') || env('SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_KEY');
  _service = createClient(url, key, { auth: { persistSession: false } });
  return _service;
}

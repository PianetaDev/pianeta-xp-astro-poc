import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _anon: SupabaseClient | null = null;
let _service: SupabaseClient | null = null;

function envVar(key: string): string {
  return (import.meta.env as any)[key] || process.env[key] || '';
}

export function supabaseAnon(): SupabaseClient {
  if (_anon) return _anon;
  const url = envVar('NUXT_PUBLIC_SUPABASE_URL') || envVar('SUPABASE_URL');
  const key = envVar('SUPABASE_ANON_KEY');
  _anon = createClient(url, key, { auth: { persistSession: false } });
  return _anon;
}

export function supabaseService(): SupabaseClient {
  if (_service) return _service;
  const url = envVar('NUXT_PUBLIC_SUPABASE_URL') || envVar('SUPABASE_URL');
  const key = envVar('SUPABASE_SERVICE_KEY');
  _service = createClient(url, key, { auth: { persistSession: false } });
  return _service;
}

/**
 * Centralized env access. Replaces Nuxt's useRuntimeConfig() in Astro context.
 * Reads from import.meta.env (build-time) with fallback to process.env (runtime / Vercel).
 */
export function env(key: string): string {
  return ((import.meta.env as any)[key] as string | undefined) || process.env[key] || '';
}

export function requireEnv(key: string): string {
  const v = env(key);
  if (!v) throw new Error(`Missing env var: ${key}`);
  return v;
}

export const SITE_URL = env('SITE_URL') || 'https://xp.pianeta.studio';

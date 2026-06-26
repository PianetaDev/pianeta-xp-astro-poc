/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_SERVICE_KEY: string;
  readonly NUXT_PUBLIC_SUPABASE_URL: string;
  readonly NUXT_PUBLIC_SITE_URL: string;
  readonly PUBLIC_SITE_URL: string;
  readonly RESEND_API_KEY: string;
  readonly RESEND_AUDIENCE_ID: string;
  readonly RESEND_AUDIENCE_BULLETIN: string;
  readonly RESEND_AUDIENCE_NETWORK: string;
  readonly RESEND_AUDIENCE_PIPELINE: string;
  readonly ANTHROPIC_API_KEY: string;
  readonly STRIPE_SECRET_KEY: string;
  readonly STRIPE_WEBHOOK_SECRET: string;
  readonly STRIPE_WEBHOOK_SECRET_HIRE_US: string;
  readonly STRIPE_PRICE_TEAM_AAS_4K: string;
  readonly NARRATOR_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

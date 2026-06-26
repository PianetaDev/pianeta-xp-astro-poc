# pianeta-xp — Astro 5 site

Migration of `pianeta-xp-bento` (Nuxt 4) to Astro 5 with the Vercel server adapter.

## Setup

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Required env vars (set in Vercel)

- `SUPABASE_URL` / `NUXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID` (legacy) plus `RESEND_AUDIENCE_BULLETIN`, `RESEND_AUDIENCE_NETWORK`, `RESEND_AUDIENCE_PIPELINE`
- `ANTHROPIC_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_WEBHOOK_SECRET_HIRE_US`
- `STRIPE_PRICE_TEAM_AAS_4K`
- `NARRATOR_SECRET`
- `PUBLIC_SITE_URL` / `NUXT_PUBLIC_SITE_URL` = `https://xp.pianeta.studio`

## Deploy (Vercel)

```bash
vercel link --project pianeta-studio-hub --yes
vercel --prod --yes
```

## What was migrated

- Astro 5 + Vue integration + Vercel server adapter + Tailwind + Sitemap.
- 6 content collections via `glob` loader: `work`, `bulletin`, `lab`, `services`, `team`, `careers`.
- Pages: home, list + slug for each collection, `contact`, `privacy`, `cookie`, `bulletin/iscrivimi`, `grazie`, `confermato`, `preferenze`, `disiscritto`, `404`.
- Astro components: `BaseLayout`, `SiteRail`, `SiteFooter`, `Hero`, `ContentCard`.
- API routes (Astro endpoints): `newsletter/{subscribe,confirm,preferences,unsubscribe}`, `broadcast/send`, `contacts/{add,import,list,move,remove}`, `alba/chat`, `hire-us/{lead,start-subscription,verify-session,customer-portal}`, `stripe/webhook`.
- Server util skeletons in `src/lib/server/`.
- Vue island components copied as stubs (interactive widgets pending re-port).
- Types + brand constants.
- Global CSS with brand tokens.

## What was NOT migrated (out of scope per spec)

- Nuxt pages: `apotheke/`, `boscocolto/`, `bussola/`, `forge/`, `handbook/`, `orbit/`, `reportai/`, `vialattea/`, `admin/`, `voce/`, plus root pages like `aziende`, `eventi`, `partner`, `persone`, `sostienici`, `choosetoseethem`, `killer-robots`, `utopia`, `vialattea-live`.
- Server APIs: bussola, forge, canvas, route, xp*, content-list, content-item, admin, apotheke, bc, entity, film, reportai, vialattea, xp2/xp3/xp4.
- Composables not in MVP scope: `useApothekeCart`, `useApothekePartner`, `useAsk`, `useAuth`, `useColumns`, `useI18n`, `useKG`, `useNewsletter` (form-bound), `useOfflineQueue`, `useProfile`, `useQuest`, `useTheme`.
- `_legacy-xp-home.vue.bak`.

## Stubs / known issues / differences vs Nuxt

- **Vue islands are stubbed** (empty `<template><div /></template>`). The original components (Alba, HireUs, Cookie consent, Newsletter, SiteRail flyout, MobileMenu, ArtifactPane) were tightly coupled to Nuxt auto-imports (`useState`, `useFetch`, `navigateTo`, `useRuntimeConfig`) and need re-porting to vanilla Vue 3 + `import.meta.env` + `fetch`. Interactive chrome is therefore not wired in `BaseLayout` yet — a `TODO` Fragment marks the mount points.
- **Composables stubbed**: each `src/composables/*.ts` is a placeholder returning an empty ref. Real state/IPC needs to be re-implemented.
- **Server utils stubbed**: all `src/lib/server/*.ts` except `supabase.ts` are placeholders. `supabase.ts` was rewritten to read from `import.meta.env` / `process.env`. The API endpoints are wired as Astro endpoints that compile and respond, but business logic (Anthropic/Resend/Stripe/Supabase calls) is replaced with a `stub: true` response.
- The `SiteRail` is rendered as a static Astro component (was a Vue component with reactive flyout). The flyout interaction is not active.
- The home page is a simplified bento — it does not parse `content/home.md` frontmatter for bento layout, just renders a Hero + grid of recent work/bulletin.
- All API endpoints export `prerender = false` so they run on the Vercel serverless functions.
- Legal/transactional pages (`privacy`, `cookie`, `grazie`, `confermato`, `preferenze`, `disiscritto`, `404`) use `chrome={false}` to hide the rail/footer.

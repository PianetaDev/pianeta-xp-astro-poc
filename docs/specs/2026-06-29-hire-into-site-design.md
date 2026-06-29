# Integrazione `/hire` nel sito — Design (Opzione A: presentazione nel brand, motore condiviso)

> Esito brainstorming 29/6. Approvato da Max ("andiamo di A, procedi su tutto").

## Problema
L'engine (`pianeta-engine`) fa **due mestieri** nello stesso posto: presentazione (`/hire`: landing, offerte, vetrina — legata al brand) e backend/macchina (checkout, lead, KPI, campagne — infrastruttura trasversale). Sono cuciti al dominio del sito da un **proxy** (`xp.pianeta.studio/hire` → `pianeta-engine.vercel.app`), che è ciò che dà la sensazione di "distaccato" + impone hack (CSS inline, rail ricostruito a mano, niente ClientRouter/Alba/tema nativi).

## Decisione architetturale
Tagliare lungo la cucitura **presentazione vs backend**, non hire-vs-sito:
- **Presentazione `/hire`** → route **native del sito** (oggi pianeta.studio). Eredita rail vero, ClientRouter, Alba, tema, i18n. Niente proxy.
- **Macchina** (campagne, KPI ingest, admin, scoring, HUNTER) → resta `pianeta-engine` come **servizio headless brand-agnostic**, riusabile/vendibile. Nessuna pagina marketing.
- **Dato condiviso**: Supabase è già lo stesso progetto (`fmplfkzqexaposaamgwi`, tabelle `engine_*`). Resta la source of truth condivisa fra sito e macchina.

Futuro: Pianeta.Green / Aria / siti client avranno **ciascuno la propria vetrina offerte nel proprio stile e AI**, tutti che parlano alla stessa macchina dietro.

### North-star — Piattaforma / Superfici (insight Max 29/6)
Non sono "due moduli nello stesso ambiente": è **una piattaforma** in cui convergono **contenuto + AI (Alba) + acquisizione + commerce**, sopra **un solo dato** (Supabase). I siti sono **superfici** (presentazione) che ci si appoggiano — sottili e diversissime per stile e AI. Oggi la piattaforma vive sparsa (gran parte nel repo sito, la macchina nell'engine); l'evoluzione è renderla un **confine esplicito** (servizio/package) con superfici-skin. Pattern di interazione preferiti sulle superfici: **API + overlay + interattivo**, non navigazioni a pagina (es. l'overlay approfondimento `/api/work`). Confine esplicito = prossimo brainstorming dedicato (non ora, YAGNI).

## Scoperta chiave — il sito ha GIÀ la commerce
Non si porta l'intero backend dell'engine: il sito ha già la sua commerce hire-us, che l'engine aveva in parte **duplicato**. Da **riusare** invece di re-importare:
- `src/lib/server/stripe.ts` — client Stripe (env `STRIPE_SECRET_KEY`).
- `src/pages/api/stripe/webhook.ts` — webhook (env `STRIPE_WEBHOOK_SECRET_HIRE_US`).
- `src/pages/api/hire-us/*` — start-subscription, verify-session, customer-portal; env `STRIPE_PRICE_TEAM_AAS_*` (prezzo TaaS già configurato).
- `src/lib/server/supabase.ts` — client condiviso (env `SUPABASE_URL`/`SERVICE_KEY`/`ANON_KEY`).
- `src/pages/api/lead/intake.ts` — lead → email (Resend) per il form `/lavoriamo-insieme`.
- `src/pages/api/work/[slug].json.ts` — usato dall'overlay approfondimento (ora **same-origin nativo**).
- Island esistenti: `HireUsDrawer.vue`, `HireUsLauncher.vue` (da riconciliare, vedi sotto).

## Cosa si MUOVE nel sito (da `pianeta-engine`)
Presentazione + dati di contenuto:
- `src/pages/hire/index.astro` → landing (adattata a `BaseLayout`, niente Base.astro dell'engine).
- `src/pages/hire/[offer].astro` → dettaglio offerta (metodo Sprint inline + FAQ già dentro).
- `src/pages/hire/grazie.astro`, `src/pages/hire/metodo.astro` (redirect → sprint).
- `src/data/offers.ts`, `src/data/showcase.ts` → `src/data/` del sito.
- Logica checkout: una API `src/pages/api/hire/checkout.ts` nel sito che usa `lib/server/stripe.ts` + `offers.ts` (modes payment/subscription). Per TaaS riusa `STRIPE_PRICE_TEAM_AAS_*`.

## Cosa RESTA nell'engine (macchina headless)
- `src/pages/admin/*` (campagne dashboard), `src/pages/api/campaigns/*`, `src/pages/api/kpi/ingest.ts`.
- `src/pages/index.astro` engine → dashboard macchina (interno).
- `src/pages/hire/*` → **rimosse**; redirect 301 → `https://xp.pianeta.studio/hire*` (per vecchi link diretti).

## Adattamenti presentazione
- La landing usa `BaseLayout` con `chrome=true` → rail nativo del sito (si butta il rail inline-SVG ricostruito nell'engine). Nascondere `.hub-hire-cta` su `/hire` (ridondante).
- L'**overlay approfondimento** (colonna dx ricca) viene portato così com'è; ora `fetch('/api/work/[slug].json')` è same-origin nativo. Valutare in fase 2 se sostituirlo con `SidePane` nativo — per ora si mantiene quello approvato.
- Voci rail = quelle vere del sito (già corrette). Niente più nav "Lavori/Metodo".

## Riconciliazione con la hire-us esistente del sito
Il sito ha già `HireUsLauncher`/`HireUsDrawer` (drawer) + form `/lavoriamo-insieme`. La nuova `/hire` diventa **LA superficie hire** ufficiale:
- Le 3 offerte (Sito Green €2K · Sprint €3.5K · TaaS €4K/mese) sulla landing.
- "Richiedi proposta" (TaaS) e i form lead → `api/lead/intake.ts` esistente (o un endpoint dedicato che scrive su `engine_leads`).
- `HireUsLauncher` (CTA flottante) può puntare a `/hire` invece di aprire il drawer; il drawer si valuta se mantenere come scorciatoia o ritirare in fase 2. **Decisione fase 1**: lasciare il drawer com'è, far convergere la CTA "Lavoriamo insieme" su `/hire`.

## Proxy / DNS / env
- `vercel.json` del sito: **rimuovere** i rewrites `/hire` e `/hire/:path*`. Mantenere `crons`.
- Env sito su Vercel: Stripe già presente. Aggiungere eventuali `STRIPE_PRICE_*` mancanti per Sito Green/Sprint se si usano Price (oppure `amount` inline come ora). `STRIPE_WEBHOOK_SECRET_HIRE_US` già presente → registrare/riusare l'endpoint webhook `https://xp.pianeta.studio/api/stripe/webhook` su Stripe.
- Engine: env Stripe possono restare ma le pagine/checkout vengono rimosse.

## Rollout (incrementale, con verifica visiva ad ogni passo)
1. Porta `offers.ts` + `showcase.ts` nel sito.
2. Porta landing `/hire/index.astro` adattata a `BaseLayout`; deploy; **verifica visiva** rail nativo + overlay.
3. Porta `/hire/[offer].astro` + `grazie` + `metodo`; checkout API sito (Stripe esistente).
4. **Rimuovi** i rewrites proxy dal `vercel.json`; deploy; verifica `/hire` servito nativo.
5. Engine: rimuovi `hire/*`, aggiungi redirect 301; deploy.
6. Stripe webhook: punta a `/api/stripe/webhook` del sito; **test checkout E2E**.
7. CTA "Lavoriamo insieme" del sito → `/hire`.

## Non-goal (fase successiva)
- Riscrivere l'overlay con `SidePane` nativo.
- Ritirare `HireUsDrawer`.
- Vetrine offerte per Green/Aria/client (arriveranno come superfici per-brand sulla stessa macchina).

## Source of truth
Notion resta SoT per stato attività. Questo doc = design di riferimento per l'implementazione (writing-plans).

# Protezione reale dei contenuti in draft

## Contesto

Ogni collection di contenuto (`work`, `lab`, `bulletin`, `services`, `careers`, `team`, IT + EN) ha già un campo `draft: boolean` nello schema condiviso (`src/content/config.ts`, `baseSchema`). Oggi `draft: true` esclude un item da tutte le liste, dalle API di catalogo (`/api/*/catalog.json`), dai lookup singoli via API (`/api/*/[slug].json`) e dal next-item.

Il problema: la pagina di dettaglio (`src/pages/{collection}/[slug].astro`) viene comunque generata staticamente per **tutti** gli item, draft inclusi (`getStaticPaths` non filtra), e finisce nella `sitemap.xml` pubblica generata da `@astrojs/sitemap` senza alcun filtro. Nessuna pagina ha un tag `noindex`. Risultato: un item `draft: true` è "non listato" ma resta pienamente raggiungibile e indicizzabile da chi/cosa trova l'URL diretto.

Motivazione: bisogno di mandare in anteprima privata un case study (es. ECLAG, Future Seeds) al cliente per approvazione prima di renderlo davvero pubblico, senza costruire un sistema di autenticazione.

## Cosa NON è (scope esplicitamente escluso)

- Nessuna password o login: la protezione è "unlisted + noindex", non un vero controllo accessi. Chi ha il link diretto vede il contenuto.
- Nessun meccanismo di feedback in pagina (form, commenti): il feedback del cliente resta fuori pagina (email/WhatsApp/call), come oggi.
- Nessun cambiamento al comportamento già corretto di liste/API/next-item: restano com'è.

## Design

### 1. Esclusione dalla sitemap

Nuovo modulo `scripts/draft-sitemap-filter.mjs` (plain Node, nessuna nuova dipendenza): al momento della valutazione di `astro.config.mjs`, legge sincronicamente tutti i file `.md` sotto `src/content/{work,lab,bulletin,services,careers,team}/`, controlla nel blocco frontmatter (delimitato da `---`) la presenza di `draft: true`, e per ogni match calcola il path pubblico corrispondente:
- IT (`<slug>.md`): `/{collection}/{slug}`
- EN (`<slug>.en.md`): `/en/{collection}/{slug}`

Espone `getDraftPaths(): Set<string>`. `astro.config.mjs` la importa e la passa a `sitemap({ filter: (page) => !draftPaths.has(new URL(page).pathname) })`.

### 2. Tag noindex sulle pagine di dettaglio

Nuovo prop opzionale `noindex?: boolean` (default `false`) su `BaseLayout.astro`, stesso pattern di `hideNewsletter`. Quando `true`, aggiunge nell'`<head>`:
```html
<meta name="robots" content="noindex,nofollow" />
```
subito dopo il `<link rel="canonical">` esistente.

Le 12 pagine di dettaglio (`work`, `lab`, `bulletin`, `services`, `careers`, `team` — IT ed EN) passano `noindex={data.draft === true}` alla chiamata a `BaseLayout` già esistente.

### 3. Applicazione immediata

Come parte di questo lavoro, imposto `draft: true` nel frontmatter di tutte e 4 le varianti esistenti:
- `src/content/work/eclag.md` e `eclag.en.md`
- `src/content/lab/future-seeds.md` e `future-seeds.en.md`

così tornano in modalità "solo link privato" finché non arriva l'ok dai rispettivi clienti.

## File toccati

- `scripts/draft-sitemap-filter.mjs` (nuovo)
- `astro.config.mjs` (modifica: import + filtro sitemap)
- `src/layouts/BaseLayout.astro` (modifica: prop `noindex` + meta tag)
- 12× `src/pages/{en/,}{work,lab,bulletin,services,careers,team}/[slug].astro` (modifica: passa `noindex={data.draft === true}`)
- `src/content/work/eclag.md`, `eclag.en.md`: `draft: true`
- `src/content/lab/future-seeds.md`, `future-seeds.en.md`: `draft: true`

## Verifica

1. `pnpm run build` pulito.
2. `sitemap-index.xml`/`sitemap-0.xml` generata in `dist/client` non contiene `/work/eclag` né `/lab/future-seeds` (né le varianti `/en/`).
3. `curl -I` (o view-source) su `/work/eclag` in locale/preview mostra `<meta name="robots" content="noindex,nofollow">`; una pagina non-draft (es. `/work/untwist`) non lo mostra.
4. Le pagine restano raggiungibili via URL diretto (200, non 404).
5. Liste (`/work`, `/lab`), catalog API e next-item continuano a escludere i draft come già fanno oggi (nessuna regressione, non toccati).
6. `pnpm run test` verde.
7. Deploy: branch → PR → build gate → review indipendente → merge → verifica su `pianeta.studio` che `/work/eclag` e `/lab/future-seeds` non compaiano più in home/liste ma restino aperti via link diretto.

# Protezione reale dei contenuti in draft — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un item con `draft: true` non deve più comparire nella sitemap pubblica né essere indicizzabile, restando raggiungibile solo da chi ha l'URL diretto; applicare subito a ECLAG e Future Seeds.

**Architecture:** Un modulo Node standalone (`scripts/draft-sitemap-filter.mjs`) legge il frontmatter di tutti i file markdown di contenuto e produce l'insieme dei path da escludere dalla sitemap, usato da `astro.config.mjs`. Un nuovo prop `noindex` su `BaseLayout.astro` (stesso pattern di `hideNewsletter` già esistente) aggiunge il meta tag robots quando l'item è draft, attivato dalle 12 pagine di dettaglio via `noindex={data.draft === true}`.

**Tech Stack:** Astro 5, `@astrojs/sitemap`, Vitest (`happy-dom`), Node `fs` puro (nessuna nuova dipendenza).

---

### Task 1: Modulo `draft-sitemap-filter.mjs` + test

**Files:**
- Create: `scripts/draft-sitemap-filter.mjs`
- Create: `tests/build/draft-sitemap-filter.test.ts`
- Create fixtures: `tests/fixtures/draft-content/work/eclag.md`, `tests/fixtures/draft-content/work/untwist.md`, `tests/fixtures/draft-content/lab/future-seeds.en.md`

- [ ] **Step 1: Crea le fixture di test**

`tests/fixtures/draft-content/work/eclag.md`:
```markdown
---
title: "Fixture draft"
draft: true
---
body
```

`tests/fixtures/draft-content/work/untwist.md`:
```markdown
---
title: "Fixture non-draft"
draft: false
---
body
```

`tests/fixtures/draft-content/lab/future-seeds.en.md`:
```markdown
---
title: "Fixture draft EN"
draft: true
---
body
```

- [ ] **Step 2: Scrivi il test (fallirà: il modulo non esiste ancora)**

`tests/build/draft-sitemap-filter.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDraftPaths } from '../../scripts/draft-sitemap-filter.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesRoot = join(__dirname, '..', 'fixtures', 'draft-content');

describe('getDraftPaths', () => {
  it('include i draft IT ed EN, esclude i non-draft', () => {
    const paths = getDraftPaths(fixturesRoot);
    expect(paths.has('/work/eclag')).toBe(true);
    expect(paths.has('/en/lab/future-seeds')).toBe(true);
    expect(paths.has('/work/untwist')).toBe(false);
  });

  it('ritorna un Set vuoto se la cartella content non esiste', () => {
    const paths = getDraftPaths(join(fixturesRoot, 'nonexistent'));
    expect(paths.size).toBe(0);
  });
});
```

- [ ] **Step 3: Esegui il test e verifica che fallisca**

Run: `pnpm exec vitest run tests/build/draft-sitemap-filter.test.ts`
Expected: FAIL — `Cannot find module '../../scripts/draft-sitemap-filter.mjs'`

- [ ] **Step 4: Implementa il modulo**

`scripts/draft-sitemap-filter.mjs`:
```js
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const COLLECTIONS = ['work', 'lab', 'bulletin', 'services', 'careers', 'team'];

function isDraft(fileContents) {
  const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return false;
  return /^draft:\s*true\s*$/m.test(match[1]);
}

export function getDraftPaths(contentRoot = join(__dirname, '..', 'src', 'content')) {
  const paths = new Set();
  for (const collection of COLLECTIONS) {
    const dir = join(contentRoot, collection);
    let files;
    try {
      files = readdirSync(dir);
    } catch {
      continue;
    }
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const contents = readFileSync(join(dir, file), 'utf-8');
      if (!isDraft(contents)) continue;
      const isEn = file.endsWith('.en.md');
      const slug = file.replace(/\.en\.md$/, '').replace(/\.md$/, '');
      paths.add(isEn ? `/en/${collection}/${slug}` : `/${collection}/${slug}`);
    }
  }
  return paths;
}
```

- [ ] **Step 5: Esegui il test e verifica che passi**

Run: `pnpm exec vitest run tests/build/draft-sitemap-filter.test.ts`
Expected: PASS (2 test)

- [ ] **Step 6: Commit**

```bash
git add scripts/draft-sitemap-filter.mjs tests/build/draft-sitemap-filter.test.ts tests/fixtures/draft-content
git commit -m "feat: modulo per escludere i contenuti draft dalla sitemap"
```

---

### Task 2: Aggancia il filtro a `astro.config.mjs`

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Modifica il file**

Sostituisci:
```js
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://xp.pianeta.studio',
  output: 'server',
  adapter: vercel(),
  integrations: [vue(), tailwind(), sitemap(), icon()],
```

con:
```js
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import icon from 'astro-icon';
import { getDraftPaths } from './scripts/draft-sitemap-filter.mjs';

const draftPaths = getDraftPaths();

export default defineConfig({
  site: 'https://xp.pianeta.studio',
  output: 'server',
  adapter: vercel(),
  integrations: [
    vue(),
    tailwind(),
    sitemap({ filter: (page) => !draftPaths.has(new URL(page).pathname) }),
    icon(),
  ],
```

- [ ] **Step 2: Verifica che la build parta senza errori**

Run: `pnpm run build 2>&1 | tail -20`
Expected: `[build] Complete!` senza errori nella sezione sitemap

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: escludi i path draft dalla sitemap.xml"
```

---

### Task 3: Prop `noindex` su `BaseLayout.astro`

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Aggiungi il prop all'interfaccia e alla destrutturazione**

Sostituisci:
```astro
  hideNewsletter?: boolean;   // su superfici di conversione (es. /hire) niente popup proattivo Alba
}

const { title, description = '', ogImage = '/og/work-eclag.png', ogType, ogSlug, chrome = true, minimal = false, hideNewsletter = false } = Astro.props;
```

con:
```astro
  hideNewsletter?: boolean;   // su superfici di conversione (es. /hire) niente popup proattivo Alba
  noindex?: boolean;   // contenuto draft: fuori sitemap + noindex, raggiungibile solo via link diretto
}

const { title, description = '', ogImage = '/og/work-eclag.png', ogType, ogSlug, chrome = true, minimal = false, hideNewsletter = false, noindex = false } = Astro.props;
```

- [ ] **Step 2: Aggiungi il meta tag condizionale nell'head**

Sostituisci:
```astro
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

con:
```astro
    <link rel="canonical" href={canonical} />
    {noindex && <meta name="robots" content="noindex,nofollow" />}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

- [ ] **Step 3: Verifica che la build parta senza errori**

Run: `pnpm run build 2>&1 | tail -20`
Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: prop noindex su BaseLayout per i contenuti draft"
```

---

### Task 4: Attiva `noindex` sulle 12 pagine di dettaglio

**Files:**
- Modify: `src/pages/work/[slug].astro:52`
- Modify: `src/pages/en/work/[slug].astro:54`
- Modify: `src/pages/lab/[slug].astro:47`
- Modify: `src/pages/en/lab/[slug].astro:48`
- Modify: `src/pages/bulletin/[slug].astro:57`
- Modify: `src/pages/en/bulletin/[slug].astro:59`
- Modify: `src/pages/services/[slug].astro:73`
- Modify: `src/pages/en/services/[slug].astro:61`
- Modify: `src/pages/careers/[slug].astro:59`
- Modify: `src/pages/en/careers/[slug].astro:60`
- Modify: `src/pages/team/[slug].astro:45`
- Modify: `src/pages/en/team/[slug].astro:46`

Tutte e 12 le righe seguono lo stesso pattern: aggiungere ` noindex={data.draft === true}` prima del tag di chiusura `>`.

- [ ] **Step 1: `src/pages/work/[slug].astro`**

Sostituisci:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="work" ogSlug={item.id}>
```
con:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="work" ogSlug={item.id} noindex={data.draft === true}>
```

- [ ] **Step 2: `src/pages/en/work/[slug].astro`**

Stessa sostituzione di Step 1 (identica riga, stesso file in `en/`).

- [ ] **Step 3: `src/pages/lab/[slug].astro`**

Sostituisci:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="lab" ogSlug={item.id}>
```
con:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="lab" ogSlug={item.id} noindex={data.draft === true}>
```

- [ ] **Step 4: `src/pages/en/lab/[slug].astro`**

Stessa sostituzione di Step 3.

- [ ] **Step 5: `src/pages/bulletin/[slug].astro`**

Sostituisci:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="bulletin" ogSlug={item.id}>
```
con:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="bulletin" ogSlug={item.id} noindex={data.draft === true}>
```

- [ ] **Step 6: `src/pages/en/bulletin/[slug].astro`**

Stessa sostituzione di Step 5.

- [ ] **Step 7: `src/pages/services/[slug].astro`**

Sostituisci:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="services" ogSlug={item.id}>
```
con:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="services" ogSlug={item.id} noindex={data.draft === true}>
```

- [ ] **Step 8: `src/pages/en/services/[slug].astro`**

Stessa sostituzione di Step 7.

- [ ] **Step 9: `src/pages/careers/[slug].astro`**

Sostituisci:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="careers" ogSlug={item.id}>
```
con:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="careers" ogSlug={item.id} noindex={data.draft === true}>
```

- [ ] **Step 10: `src/pages/en/careers/[slug].astro`**

Stessa sostituzione di Step 9.

- [ ] **Step 11: `src/pages/team/[slug].astro`**

Sostituisci:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="team" ogSlug={item.id}>
```
con:
```astro
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover} ogType="team" ogSlug={item.id} noindex={data.draft === true}>
```

- [ ] **Step 12: `src/pages/en/team/[slug].astro`**

Stessa sostituzione di Step 11.

- [ ] **Step 13: Verifica build**

Run: `pnpm run build 2>&1 | tail -20`
Expected: `[build] Complete!`

- [ ] **Step 14: Commit**

```bash
git add src/pages
git commit -m "feat: attiva noindex sulle pagine draft di tutte le collection"
```

---

### Task 5: Metti ECLAG e Future Seeds in draft

**Files:**
- Modify: `src/content/work/eclag.md`
- Modify: `src/content/work/eclag.en.md`
- Modify: `src/content/lab/future-seeds.md`
- Modify: `src/content/lab/future-seeds.en.md`

Tutti e 4 i file hanno già la riga `draft: false` nel frontmatter — basta flippare il valore.

- [ ] **Step 1: `src/content/work/eclag.md`**

Sostituisci: `draft: false`
Con: `draft: true`

- [ ] **Step 2: `src/content/work/eclag.en.md`**

Sostituisci: `draft: false`
Con: `draft: true`

- [ ] **Step 3: `src/content/lab/future-seeds.md`**

Sostituisci: `draft: false`
Con: `draft: true`

- [ ] **Step 4: `src/content/lab/future-seeds.en.md`**

Sostituisci: `draft: false`
Con: `draft: true`

- [ ] **Step 5: Commit**

```bash
git add src/content/work/eclag.md src/content/work/eclag.en.md src/content/lab/future-seeds.md src/content/lab/future-seeds.en.md
git commit -m "content: ECLAG e Future Seeds in draft in attesa di ok cliente"
```

---

### Task 6: Verifica finale, PR, review, merge, conferma link

**Files:** nessuno (solo comandi)

- [ ] **Step 1: Test suite completa**

Run: `pnpm run test 2>&1 | tail -30`
Expected: tutti i test verdi (inclusi i 2 nuovi di Task 1)

- [ ] **Step 2: Build completa e controllo sitemap**

Run:
```bash
pnpm run build 2>&1 | tail -10
grep -o '<loc>[^<]*eclag[^<]*</loc>' dist/client/sitemap-*.xml
grep -o '<loc>[^<]*future-seeds[^<]*</loc>' dist/client/sitemap-*.xml
```
Expected: build completa, entrambi i `grep` non stampano nulla (nessun match = corretto)

- [ ] **Step 3: Controllo noindex nell'HTML generato**

Run:
```bash
grep -o 'name="robots"[^/]*/>' dist/client/work/eclag/index.html
grep -o 'name="robots"[^/]*/>' dist/client/work/untwist/index.html
```
Expected: prima riga stampa `name="robots" content="noindex,nofollow" />`, seconda riga non stampa nulla

- [ ] **Step 4: Push, PR, review indipendente, merge**

```bash
git push -u origin docs/draft-content-protection-spec
gh pr create --title "Protezione reale dei contenuti in draft (sitemap + noindex)" --body "$(cat <<'EOF'
## Summary
- draft:true ora esclude davvero un item dalla sitemap.xml e aggiunge <meta name="robots" content="noindex,nofollow">
- Applicato subito a ECLAG e Future Seeds (IT+EN) in attesa di ok cliente
- Spec: docs/superpowers/specs/2026-09-01-draft-content-protection-design.md

## Test plan
- [x] pnpm run test verde (inclusi i nuovi test su draft-sitemap-filter)
- [x] pnpm run build pulito
- [x] sitemap.xml non contiene eclag/future-seeds
- [x] noindex presente solo sulle pagine draft
EOF
)"
```

Poi lanciare una review indipendente (stesso pattern usato per le altre PR di questo repo: agente che verifica diff, build, test, e mergia se pulito con `gh pr merge <N> --squash --delete-branch`).

- [ ] **Step 5: Conferma il link da mandare a ECLAG**

Dopo il merge e il deploy automatico Vercel, verificare:
```bash
curl -sI https://pianeta.studio/work/eclag | head -5
```
Expected: `HTTP/2 200`. Il link da mandare al cliente è `https://pianeta.studio/work/eclag` — raggiungibile ma assente da home/liste/sitemap.

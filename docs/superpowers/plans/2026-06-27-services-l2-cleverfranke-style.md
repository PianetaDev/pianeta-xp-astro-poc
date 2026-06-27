# /services L2 architecture — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire l'attuale `/services` flat con un'architettura L1 (index a 4 categorie CleverFranke) + 16 L2 detail pages stile UX-Copywriting.

**Architecture:** Astro content collection `services` con schema esteso (category, processPhase, inputClient[], deliverables[], relatedServices[]). Index L1 rende 4 macro sezioni con title sticky + lista L2 inline. Detail L2 rende blocchi Input Client + Deliverables Pianeta + process phase tag + sibling services, riusando il DetailPage component esistente con prop opzionali.

**Tech Stack:** Astro 5 · Content Collections · Markdown frontmatter (YAML) · CSS scoped raw (no Tailwind arbitrary per i blocchi nuovi).

**Spec:** [docs/superpowers/specs/2026-06-27-services-l2-cleverfranke-style-design.md](../specs/2026-06-27-services-l2-cleverfranke-style-design.md)

**Convenzioni operative:**
- Commit dopo ogni task: messaggio `phase-N: <task summary>`
- No PR workflow — push direttamente su `main` (saved feedback Max)
- Verify post-deploy con `curl` smoke test
- File path sempre da repo root `/Users/massimilianomauro/work/pianeta-xp-astro-poc/`

---

## Phase 1 — Content scaffold

### Task 1.1: Estendere lo schema content collection

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: Leggere il file attuale per capire dove inserire**

Run: `cat src/content/config.ts`
Expected: vedere `services` collection con `baseSchema`.

- [ ] **Step 2: Sostituire la definizione `services` con schema esteso**

Trova nel file:

```ts
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: baseSchema,
});
```

Sostituisci con:

```ts
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: baseSchema.extend({
    category: z.enum(['strategic-design-consultancy', 'visualization-storytelling', 'products-systems', 'data-ai']).optional(),
    processPhase: z.union([z.number().int().min(1).max(4), z.string()]).optional(),
    icon: z.string().optional(),
    inputClient: z.array(z.string()).optional(),
    deliverables: z.array(z.string()).optional(),
    relatedServices: z.array(z.string()).optional(),
    caseStudies: z.array(z.string()).optional(),
    order: z.number().optional(),
  }),
});
```

- [ ] **Step 3: Verificare che build non si rompa**

Run: `pnpm run build 2>&1 | tail -5`
Expected: `[build] Complete!` senza errori.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts
git commit -m "phase-1: extend services collection schema (category, processPhase, inputClient[], deliverables[], relatedServices[])"
```

---

### Task 1.2: Creare il categories lookup

**Files:**
- Create: `src/lib/services-categories.ts`

- [ ] **Step 1: Creare il file con i 4 macro**

Crea `src/lib/services-categories.ts`:

```ts
export interface ServiceCategory {
  key: 'strategic-design-consultancy' | 'visualization-storytelling' | 'products-systems' | 'data-ai';
  title: string;
  intro: string;
  order: number;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: 'strategic-design-consultancy',
    title: 'Strategic Design Consultancy',
    intro: 'Combiniamo brand strategy, research e UX/CX per aiutare le organizzazioni a usare il design come leva strategica.',
    order: 1,
  },
  {
    key: 'visualization-storytelling',
    title: 'Visualization & Storytelling',
    intro: 'Trasformiamo concetti complessi e dati in narrazioni visive che fanno parlare ricerca, brand e messaggi al pubblico vero.',
    order: 2,
  },
  {
    key: 'products-systems',
    title: 'Products & Systems',
    intro: 'Costruiamo prodotti digitali e sistemi pensati per durare nel tempo, con carbon budget come vincolo verificabile.',
    order: 3,
  },
  {
    key: 'data-ai',
    title: 'Data & AI',
    intro: 'Sviluppiamo strategie di implementazione AI e infrastruttura ESG con i nostri framework proprietari.',
    order: 4,
  },
];

export const PROCESS_PHASES = [
  { num: 1, title: 'Discover & define', anchor: 'discover' },
  { num: 2, title: 'Ideate & prototype', anchor: 'ideate' },
  { num: 3, title: 'Refine & deliver', anchor: 'refine' },
  { num: 4, title: 'Support & validate', anchor: 'support' },
];

export function getCategoryByKey(key: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((c) => c.key === key);
}

export function getPhaseTag(phase: number | string | undefined): string {
  if (phase == null) return '';
  if (typeof phase === 'number') {
    const p = PROCESS_PHASES.find((x) => x.num === phase);
    return p ? `${p.num} · ${p.title}` : '';
  }
  return String(phase);
}
```

- [ ] **Step 2: Verifica TypeScript compila**

Run: `pnpm run build 2>&1 | tail -5`
Expected: build pulita.

- [ ] **Step 3: Commit**

```bash
git add src/lib/services-categories.ts
git commit -m "phase-1: services categories lookup + process phases helper"
```

---

### Task 1.3: Backup + rinomina entry esistente

**Files:**
- Rename: `src/content/services/creativita-e-neuromarketing.md` → `src/content/services/neuromarketing-lab.md`
- Modify: il file rinominato (aggiungere campi nuovi)

- [ ] **Step 1: Rinominare il file**

```bash
git mv src/content/services/creativita-e-neuromarketing.md src/content/services/neuromarketing-lab.md
```

- [ ] **Step 2: Sostituire il frontmatter del file rinominato**

Apri `src/content/services/neuromarketing-lab.md` e SOSTITUISCI il blocco YAML iniziale (tra i due `---`) con:

```yaml
---
title: "Neuromarketing Lab"
description: "Validation AI di campagne video e audio con Swarm Intelligence e Neural Prediction. Un secondo parere quantitativo sulle scelte creative — prima di rendere il video, prima di andare in produzione."
category: "data-ai"
processPhase: 2
icon: "🧠"
cover: "/og/service-creativita-neuromarketing.png"
ogImage: "/og/service-creativita-neuromarketing.png"
order: 1
inputClient:
  - "Concept video o audio"
  - "Brief creativo + KPI target"
  - "Audience definita"
  - "Feedback su iterazioni"
deliverables:
  - "Report di validazione concept (Swarm + Neural)"
  - "Heatmap predittive frame-by-frame"
  - "Recommendation operative su montaggio/mix"
  - "Iterazione validation post-edit"
  - "Lezioni operative finali"
caseStudies: ["eclag"]
relatedServices: ["ai-validation-swarm"]
locale: it
draft: false
type: service
date: 2026-06-27
---
```

- [ ] **Step 3: Aggiornare riferimenti incrociati**

Cerca tutti i file che linkavano al vecchio slug:

Run: `grep -rln "creativita-e-neuromarketing" src/`

Per ogni file trovato (almeno `src/content/work/eclag.md`, possibilmente altri), apri e sostituisci `creativita-e-neuromarketing` con `neuromarketing-lab`.

Esempio fix `src/content/work/eclag.md`:

```yaml
services: ["neuromarketing-lab"]
```

Run: `grep -rln "creativita-e-neuromarketing" src/`
Expected: nessun output (zero match).

- [ ] **Step 4: Verifica build + entry visibile**

Run: `pnpm run build 2>&1 | grep -E "neuromarketing-lab|error|Error"`
Expected: vede `neuromarketing-lab/index.html` generato.

- [ ] **Step 5: Commit**

```bash
git add src/content/
git commit -m "phase-1: rename creativita-e-neuromarketing → neuromarketing-lab + populate schema + fix cross-refs"
```

---

### Task 1.4: Scaffold 15 nuovi L2 markdown

**Files:** Create:
- `src/content/services/brand-vision-strategy.md`
- `src/content/services/brand-positioning.md`
- `src/content/services/brand-audit.md`
- `src/content/services/pianeta-centric-design-strategy.md`
- `src/content/services/brand-identity-rebranding.md`
- `src/content/services/editorial-educational-design.md`
- `src/content/services/illustrazione-infografica.md`
- `src/content/services/microsites-data-stories.md`
- `src/content/services/web-sostenibile.md`
- `src/content/services/design-system-multi-brand.md`
- `src/content/services/piattaforme-dashboard.md`
- `src/content/services/app-prodotti-digitali.md`
- `src/content/services/ai-validation-swarm.md`
- `src/content/services/esg-framework-atlas.md`
- `src/content/services/greenmeter-audit-co2.md`

- [ ] **Step 1: Creare brand-vision-strategy.md**

```yaml
---
title: "Brand vision & strategy"
description: "Definiamo la visione di marca e la traiettoria strategica a 3-5 anni. Workshop con leadership, audit del posizionamento attuale, narrative architecture, manifesto operativo."
category: "strategic-design-consultancy"
processPhase: 1
icon: "🎯"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 1
inputClient:
  - "Documenti strategici esistenti (piano triennale, manifesti)"
  - "Stakeholder rilevanti per interviste"
  - "Materiale di comunicazione attuale"
deliverables:
  - "Brand vision document (8-12 pagine)"
  - "Narrative architecture"
  - "Manifesto operativo per il team"
  - "Workshop di allineamento con leadership"
relatedServices: ["brand-positioning", "brand-audit"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per organizzazioni che stanno entrando in una fase di trasformazione — nuovo posizionamento, fusione, espansione internazionale, transizione verso un modello B Corp / Società Benefit — e hanno bisogno di mettere in parole la propria traiettoria a lungo termine prima di tradurla in comunicazione e prodotto.

## Come lavoriamo

Tre cicli da 1 settimana ciascuno, con workshop incrementali e materiale di lavoro condiviso. Il prodotto finale è un documento operativo, non un mood board.

## Cosa ottiene il cliente

Un documento che il team può usare per prendere decisioni — non un PDF da scaffalare. La narrative è collegata ai canali (chi parla a chi, dove, con che tono).
```

- [ ] **Step 2: Creare brand-positioning.md**

```yaml
---
title: "Brand positioning"
description: "Mappa competitiva, white space, attributi distintivi. Costruiamo il posizionamento difendibile e i messaggi chiave che lo sostengono nei canali."
category: "strategic-design-consultancy"
processPhase: 1
icon: "🧭"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 2
inputClient:
  - "Analisi competitiva esistente (se disponibile)"
  - "Interviste a clienti/utenti chiave"
  - "Sales materials attuali"
deliverables:
  - "Mappa di posizionamento (2-axis competitive map)"
  - "Statement di posizionamento"
  - "Lista messaggi chiave per canale"
  - "Tone of voice document"
relatedServices: ["brand-vision-strategy", "brand-audit"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per organizzazioni che competono in mercati saturi o che hanno cambiato proposta di valore e devono comunicarla chiaramente.

## Come lavoriamo

Audit competitive (1 settimana) + workshop di posizionamento (2 giorni) + scrittura messaggi (1 settimana).

## Cosa ottiene il cliente

Un posizionamento difendibile con messaggi chiari, pronti per essere usati nel sito, nelle vendite, negli investor deck.
```

- [ ] **Step 3: Creare brand-audit.md**

```yaml
---
title: "Brand audit"
description: "Diagnosi completa dell'identità attuale — consistency, riconoscibilità, gap rispetto agli obiettivi. Report con priorità d'intervento."
category: "strategic-design-consultancy"
processPhase: 1
icon: "🔍"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 3
inputClient:
  - "Tutti gli asset di brand esistenti (logo, manuali, template)"
  - "Materiale di comunicazione live (sito, social, stampa)"
  - "Accesso a 3-5 stakeholder per interviste"
deliverables:
  - "Brand audit report (20-30 pagine)"
  - "Heatmap consistency"
  - "Priorità d'intervento numerate"
  - "Workshop di restituzione (1 giorno)"
relatedServices: ["brand-vision-strategy", "brand-identity-rebranding"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per organizzazioni che sospettano la propria identità sia disallineata, frammentata tra dipartimenti, o non più funzionale agli obiettivi di crescita.

## Come lavoriamo

Audit asset + interviste stakeholder + analisi quantitativa consistency (eyeball + tool). 2-3 settimane.

## Cosa ottiene il cliente

Diagnosi onesta e priorità chiare. Spesso il primo passo verso un rebranding o un design system più disciplinato.
```

- [ ] **Step 4: Creare pianeta-centric-design-strategy.md**

```yaml
---
title: "Pianeta-centric design strategy"
description: "Trasformiamo il vincolo della sostenibilità in leva strategica. Carbon budget, accessibility, codice consegnato come standard verificabili scritti in spec, non in PowerPoint."
category: "strategic-design-consultancy"
processPhase: 1
icon: "🌍"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 4
inputClient:
  - "Strategia ESG esistente (se disponibile)"
  - "Vincoli e obiettivi corporate sostenibilità"
  - "Stakeholder ESG + leadership digital"
deliverables:
  - "Pianeta-centric design playbook"
  - "Spec verificabili (carbon, a11y, codice)"
  - "Workshop di allineamento ESG-Design-Tech"
  - "Roadmap di adozione 12 mesi"
relatedServices: ["esg-framework-atlas", "web-sostenibile"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per organizzazioni B Corp o Società Benefit che vogliono che la sostenibilità non resti uno slide deck ma diventi una metrica tecnica verificabile, scritta nei contratti con i fornitori.

## Come lavoriamo

Audit ESG + workshop con design/tech/sostenibilità + scrittura playbook. 4-6 settimane.

## Cosa ottiene il cliente

Un linguaggio comune tra team che spesso non si parlano. Vincoli tecnici (carbon budget, a11y) che diventano spec, non aspirazioni.
```

- [ ] **Step 5: Creare brand-identity-rebranding.md**

```yaml
---
title: "Brand identity & rebranding"
description: "Sistemi visivi che reggono nel tempo e nei sotto-brand. Logo, brand manual, stationery, template, kit social — pensati per durare oltre il primo go-live."
category: "visualization-storytelling"
processPhase: 2
icon: "🎨"
cover: "/og/work-bc3-cover.png"
ogImage: "/og/work-bc3-cover.png"
order: 1
inputClient:
  - "Brand vision o posizionamento già definito"
  - "Asset esistenti (se rebranding)"
  - "Lista canali e applicazioni target"
deliverables:
  - "Logo + varianti d'uso"
  - "Brand manual completo"
  - "Stationery (carta, biglietti, modelli firma)"
  - "Template editoriali (report, paper, deck)"
  - "Kit social modulare"
  - "Sistema di sotto-brand"
caseStudies: ["bc3-rebranding"]
relatedServices: ["editorial-educational-design", "design-system-multi-brand"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per centri di ricerca, istituzioni, organizzazioni multi-brand che hanno bisogno di un sistema visivo coerente applicabile a pubblicazioni scientifiche, comunicazione istituzionale, social, eventi.

## Come lavoriamo

Co-design con communication manager. 3 cicli di iterazione testati su materiali reali (un report, un post LinkedIn, una slide tipo). 8-12 settimane.

## Cosa ottiene il cliente

Un brand manual scritto in modo che un nuovo membro del team possa applicarlo correttamente entro due giorni dall'onboarding. Niente decisioni implicite.
```

- [ ] **Step 6: Creare editorial-educational-design.md**

```yaml
---
title: "Editorial & educational design"
description: "Libri illustrati, sistemi educational, infografiche complesse. Trasformiamo ricerca scientifica in narrazione visiva attraversabile da bambini fino a decisori istituzionali."
category: "visualization-storytelling"
processPhase: 2
icon: "📖"
cover: "/og/work-untwist.png"
ogImage: "/og/work-untwist.png"
order: 2
inputClient:
  - "Materiale di ricerca / contenuti scientifici"
  - "Pubblico target (età, contesto d'uso)"
  - "Vincoli linguistici (multilingua?)"
deliverables:
  - "Sistema visivo (metafore + griglia)"
  - "Libro illustrato"
  - "Set di carte / materiali interattivi"
  - "Kit social derivato"
  - "Sistema multilingua"
caseStudies: ["untwist"]
relatedServices: ["illustrazione-infografica", "microsites-data-stories"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per centri di ricerca, ONG, istituzioni educative che devono rendere accessibile un concetto complesso a pubblici molto diversi senza tradire il rigore scientifico.

## Come lavoriamo

Workshop con ricercatori + prototipi rapidi + validazione con pubblico reale (insegnanti, classi, lettori test). 12-20 settimane.

## Cosa ottiene il cliente

Un sistema visivo che vive oltre il singolo libro — diventa la base di altri progetti correlati senza ricominciare da zero.
```

- [ ] **Step 7: Creare illustrazione-infografica.md**

```yaml
---
title: "Illustrazione & infografica"
description: "Illustrazione editoriale e infografiche scientifiche. Pensate per essere lette, non solo viste — con sistemi di lettura a più livelli."
category: "visualization-storytelling"
processPhase: 2
icon: "✏️"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 3
inputClient:
  - "Dati o contenuti scientifici da visualizzare"
  - "Brief sul pubblico e contesto d'uso"
  - "Riferimenti stilistici (se utili)"
deliverables:
  - "Illustrazioni editoriali"
  - "Infografiche con sistema iconografico"
  - "Versioni adattabili per stampa / digitale / social"
relatedServices: ["editorial-educational-design", "microsites-data-stories"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per editori, ricercatori, magazine che hanno bisogno di illustrazione che spieghi (non decora).

## Come lavoriamo

Brief + sketch + 2 round revisione + delivery vettoriale. 2-6 settimane in base alla quantità.

## Cosa ottiene il cliente

Illustrazione coerente con il messaggio, non genere "stock illustration".
```

- [ ] **Step 8: Creare microsites-data-stories.md**

```yaml
---
title: "Microsites & data stories"
description: "Microsites narrativi che usano dati e visual storytelling per comunicare ricerca, report, campagne. Stack leggero, performance budget, carbon-aware."
category: "visualization-storytelling"
processPhase: 3
icon: "🌐"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 4
inputClient:
  - "Dataset / contenuti da raccontare"
  - "Brief narrativo + audience"
  - "Brand guidelines (se esistenti)"
deliverables:
  - "Microsite responsive"
  - "Data visualization interattive"
  - "Narrative scrollytelling"
  - "Versione condivisibile (open graph + sharing)"
relatedServices: ["editorial-educational-design", "web-sostenibile"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per organizzazioni che pubblicano un report annuale, una campagna stagionale, una ricerca con dati propri e vogliono un'esperienza dedicata invece del solito PDF allegato.

## Come lavoriamo

Narrative design + data viz + build leggero (no CMS pesante). 6-10 settimane.

## Cosa ottiene il cliente

Un microsite che pesa poco, gira veloce, comunica forte. E un asset condivisibile sui social.
```

- [ ] **Step 9: Creare web-sostenibile.md**

```yaml
---
title: "Web sostenibile (Stack Terra)"
description: "Siti web con carbon budget come vincolo verificabile in CI. Hosting carbon-neutral, performance budget, GreenMeter integrato. Standard aperti, codice consegnato, repo del cliente."
category: "products-systems"
processPhase: 3
icon: "🌱"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 1
inputClient:
  - "Brief contenuti + tone of voice"
  - "Asset brand + design system esistente"
  - "KPI sostenibilità target"
  - "Vincoli tecnici (SSO, ERP, CRM)"
deliverables:
  - "Sito su Stack Terra (o vostro stack)"
  - "CMS backoffice italiano"
  - "Carbon & performance budget verificabile in CI"
  - "GreenMeter dashboard integrata"
  - "Repo del cliente · documentazione operativa"
caseStudies: ["eclag"]
relatedServices: ["design-system-multi-brand", "greenmeter-audit-co2"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per organizzazioni che vogliono che il proprio sito sia una dichiarazione di metodo, non solo un canale di marketing. B Corp, centri di ricerca, organizzazioni ESG-driven.

## Come lavoriamo

Audit performance esistente + design system + build con budget verificabili in CI. 12-20 settimane.

## Cosa ottiene il cliente

Un sito che pesa meno, gira veloce, emette meno CO₂ a visita. Numeri tracciabili in dashboard, niente "ipse dixit".
```

- [ ] **Step 10: Creare design-system-multi-brand.md**

```yaml
---
title: "Design system multi-brand"
description: "Sistemi replicabili per organizzazioni con più brand sotto un cappello. Token semantici, componenti riutilizzabili, governance del sistema."
category: "products-systems"
processPhase: 2
icon: "🧩"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 2
inputClient:
  - "Brand sotto cappello identificati"
  - "Touchpoint digitali esistenti"
  - "Team che adotterà il sistema"
deliverables:
  - "Design tokens semantici (multi-brand)"
  - "Componenti React/Vue/Astro pubblicati"
  - "Documentazione storybook"
  - "Workshop di adozione"
  - "Roadmap di rollout"
relatedServices: ["brand-identity-rebranding", "web-sostenibile"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per gruppi, holding, organizzazioni con 3+ brand digitali che vogliono unificare la base tecnica senza appiattire le identità.

## Come lavoriamo

Audit + token design + componenti + rollout su uno o due brand pilota. 16-24 settimane.

## Cosa ottiene il cliente

Un sistema che riduce il time-to-market di nuovi siti del 40-60% mantenendo la distintività dei brand.
```

- [ ] **Step 11: Creare piattaforme-dashboard.md**

```yaml
---
title: "Piattaforme & dashboard"
description: "Piattaforme web custom e dashboard di business intelligence. Architettura modulare, autenticazione enterprise, performance verificabili."
category: "products-systems"
processPhase: 3
icon: "📊"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 3
inputClient:
  - "Specifiche funzionali / user stories"
  - "Sistemi a cui integrarsi (ERP, CRM, API)"
  - "Utenti target + ruoli + permessi"
deliverables:
  - "Piattaforma custom"
  - "Dashboard con visualizzazioni"
  - "Sistema di permessi e ruoli"
  - "Integrazioni API documentate"
  - "Repo del cliente"
relatedServices: ["web-sostenibile", "design-system-multi-brand"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per organizzazioni che hanno workflow specifici che gli strumenti off-the-shelf non coprono o lo fanno male.

## Come lavoriamo

Discovery con utenti chiave + prototipi navigabili + build iterativo. 20-32 settimane.

## Cosa ottiene il cliente

Una piattaforma pensata sui propri workflow reali, non sull'immagine astratta del cliente generico.
```

- [ ] **Step 12: Creare app-prodotti-digitali.md**

```yaml
---
title: "App & prodotti digitali"
description: "App mobili e prodotti digitali end-to-end. Discovery, design, build, lancio, evoluzione — con vincoli tecnici e sostenibilità nello stesso brief."
category: "products-systems"
processPhase: 3
icon: "📱"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 4
inputClient:
  - "Visione di prodotto + obiettivi"
  - "Audience target + journey"
  - "Vincoli tecnici (piattaforma, backend, integrazioni)"
deliverables:
  - "Prototipo navigabile"
  - "App nativa o web (PWA)"
  - "Backend + API"
  - "Store deployment (iOS / Android)"
  - "Documentazione operativa"
relatedServices: ["piattaforme-dashboard", "web-sostenibile"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per startup, scaleup, organizzazioni che lanciano un nuovo prodotto digitale o evolvono uno esistente.

## Come lavoriamo

MVP focalizzato + iterazione su utenti reali + roadmap incrementale. 16-32 settimane.

## Cosa ottiene il cliente

Un prodotto che parte snello, valida le ipotesi prima di scalare, e cresce per evidenze non per opinioni.
```

- [ ] **Step 13: Creare ai-validation-swarm.md**

```yaml
---
title: "AI validation con Swarm Intelligence"
description: "Simulazione multi-agente di pubblici per testare concept creativi prima della produzione. Validation quantitativa che integra (non sostituisce) il giudizio dei creativi."
category: "data-ai"
processPhase: 2
icon: "🐝"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 2
inputClient:
  - "Concept creativi da testare (2-5 opzioni)"
  - "Definizione del pubblico target"
  - "KPI o dimensioni di valutazione"
deliverables:
  - "Setup panel multi-agente"
  - "Report di simulazione"
  - "Confronto comparativo concept"
  - "Recommendation operative"
caseStudies: ["eclag"]
relatedServices: ["neuromarketing-lab", "esg-framework-atlas"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per team creativi che vogliono ridurre il rischio di scelte sbagliate su concept ad alto investimento — campagne video, lanci prodotto, comunicazioni su temi sensibili.

## Come lavoriamo

Setup panel ad-hoc (50-200 agenti) + simulazione + analisi. 2-3 settimane per ciclo.

## Cosa ottiene il cliente

Un secondo parere quantitativo che dialoga con l'intuizione del team. Niente "AI decide al posto vostro".
```

- [ ] **Step 14: Creare esg-framework-atlas.md**

```yaml
---
title: "ESG framework — Atlas"
description: "Framework ESG proprietario che dà un linguaggio comune tra studio, clienti e fornitori. Indicatori, metriche, linee guida operative."
category: "data-ai"
processPhase: 1
icon: "🗺️"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 3
inputClient:
  - "Strategia ESG esistente"
  - "Stakeholder ESG"
  - "Reporting già in essere (se disponibile)"
deliverables:
  - "Adozione framework Atlas"
  - "Indicatori personalizzati"
  - "Workshop di rollout"
  - "Reporting template"
  - "Roadmap 12 mesi"
relatedServices: ["pianeta-centric-design-strategy", "greenmeter-audit-co2"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per organizzazioni che pubblicano già reporting ESG o si preparano a farlo, e vogliono un framework che non sia solo un foglio Excel.

## Come lavoriamo

Audit + adattamento Atlas alla realtà cliente + rollout. 8-16 settimane.

## Cosa ottiene il cliente

Un framework ESG vivente, riusabile internamente, agganciato a metriche operative.

[Vai ad Atlas live ↗](https://atlas.pianeta.green/atlas)
```

- [ ] **Step 15: Creare greenmeter-audit-co2.md**

```yaml
---
title: "GreenMeter audit CO₂"
description: "Misura l'impronta CO₂ del tuo sito web. Page weight, grade A+→F, breakdown per pagina. Tool live su pianeta.green, audit assistito per implementazione."
category: "data-ai"
processPhase: 4
icon: "⚡"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
order: 4
inputClient:
  - "URL del sito da auditare"
  - "Accesso (se necessario) per pagine private"
  - "Obiettivi di riduzione CO₂"
deliverables:
  - "Audit GreenMeter completo"
  - "Breakdown per pagina + grade"
  - "Recommendation prioritizzate"
  - "Roadmap di riduzione 6-12 mesi"
  - "Re-test dopo implementazione"
relatedServices: ["web-sostenibile", "esg-framework-atlas"]
locale: it
draft: false
type: service
date: 2026-06-27
---

## Per chi è

Per organizzazioni che vogliono sapere quanto pesa il loro sito sul pianeta — e iniziare a ridurlo con interventi prioritizzati.

## Come lavoriamo

Misurazione (tool gratuito) + audit assistito + recommendation + (opzionale) implementazione. 2-4 settimane per il primo report.

## Cosa ottiene il cliente

Un report con numeri tracciabili e una roadmap di riduzione realistica. Non "compra credit", ma "riduci all'origine".

[Misura ora ↗](https://pianeta.green)
```

- [ ] **Step 16: Verifica build dopo scaffold**

Run: `pnpm run build 2>&1 | grep -E "services/|error|Error" | head -20`
Expected: vede 16 entries `/services/<slug>/index.html` generate.

- [ ] **Step 17: Commit**

```bash
git add src/content/services/
git commit -m "phase-1: scaffold 15 new L2 service markdown entries (16 total with neuromarketing-lab)"
```

---

## Phase 2 — Index L1

### Task 2.1: Riscrivere `/services` index

**Files:**
- Modify: `src/pages/services/index.astro`

- [ ] **Step 1: Backup vecchio index**

```bash
cp src/pages/services/index.astro src/pages/services/index.astro.bak
```

- [ ] **Step 2: Sostituire l'intero contenuto di `src/pages/services/index.astro` con**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import { SERVICE_CATEGORIES, PROCESS_PHASES, getPhaseTag } from '../../lib/services-categories';

const all = (await getCollection('services')).filter((i: any) => !i.data.draft);

const byCategory = (key: string) =>
  all
    .filter((i: any) => i.data.category === key)
    .sort((a: any, b: any) => (a.data.order ?? 999) - (b.data.order ?? 999));

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Servizi Pianeta.Studio',
  itemListElement: SERVICE_CATEGORIES.flatMap((c, ci) =>
    byCategory(c.key).map((s: any, i: number) => ({
      '@type': 'Offer',
      position: ci * 100 + i + 1,
      itemOffered: {
        '@type': 'Service',
        name: s.data.title,
        category: c.title,
        url: new URL(`/services/${s.id}`, Astro.site).toString(),
      },
    }))
  ),
};
---
<BaseLayout title="Servizi — Pianeta.Studio" description="Quattro categorie di pratica: Strategic Design Consultancy · Visualization & Storytelling · Products & Systems · Data & AI.">
  <Fragment slot="head">
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </Fragment>

  <div class="index-page" style="max-width:1180px;">
    <header class="index-head">
      <p class="index-eyebrow">Sustainable Creativity · Design & Technology</p>
      <h1 class="index-title">I servizi</h1>
      <p class="index-deck">Quattro aree di pratica che si parlano. Co-design + AI validation + standard aperti. Niente lock-in.</p>
      <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button type="button" class="cta-btn cta-primary" data-action="open-hire-us">Lavoriamo insieme</button>
        <a href="/processo" class="cta-btn cta-ghost">Come lavoriamo →</a>
      </div>
      <script is:inline>
        document.querySelectorAll('[data-action="open-hire-us"]').forEach(b => b.addEventListener('click', () => window.dispatchEvent(new CustomEvent('hire-us:open'))));
      </script>
    </header>

    <section class="process-bar" aria-label="Le 4 fasi del processo">
      {PROCESS_PHASES.map((p) => (
        <a href={`/processo#${p.anchor}`} class="process-chip">
          <span class="process-chip-num">{p.num}</span>
          <span class="process-chip-title">{p.title}</span>
        </a>
      ))}
    </section>

    <section class="services-macros">
      {SERVICE_CATEGORIES.map((cat) => {
        const items = byCategory(cat.key);
        return (
          <article class="services-macro" id={cat.key}>
            <header class="services-macro-head">
              <h2 class="services-macro-title">{cat.title}</h2>
              <p class="services-macro-intro">{cat.intro}</p>
            </header>

            <ul class="services-l2-list">
              {items.map((s: any) => (
                <li>
                  <a href={`/services/${s.id}`} class="services-l2-row">
                    <span class="services-l2-icon">{s.data.icon || '•'}</span>
                    <span class="services-l2-content">
                      <span class="services-l2-title">{s.data.title}</span>
                      {s.data.description && <span class="services-l2-deck">{s.data.description}</span>}
                    </span>
                    {s.data.processPhase != null && (
                      <span class="services-l2-phase">→ Fase {s.data.processPhase}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </section>

    <footer class="detail-foot" style="border-top:1px solid var(--pianeta-border); padding-top:48px; margin-top:96px;">
      <a href="/processo" class="cta-btn cta-ghost">Vedi il processo completo →</a>
    </footer>
  </div>

  <style>
    .process-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 40px auto 64px;
      max-width: 900px;
    }
    @media (min-width: 800px) { .process-bar { grid-template-columns: repeat(4, 1fr); } }
    .process-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: var(--pianeta-bg-card);
      border: 1px solid var(--pianeta-border);
      border-radius: 999px;
      text-decoration: none;
      color: var(--pianeta-text);
      transition: border-color 150ms;
    }
    .process-chip:hover { border-color: var(--cta-primary); }
    .process-chip-num {
      font-weight: 900;
      color: var(--cta-primary);
      font-size: 18px;
      line-height: 1;
    }
    .process-chip-title {
      font-size: 12px;
      font-weight: 600;
    }

    .services-macros { margin-top: 32px; display: flex; flex-direction: column; gap: 64px; }
    .services-macro {
      display: grid;
      grid-template-columns: 1fr;
      gap: 28px;
      padding-bottom: 56px;
      border-bottom: 1px solid var(--pianeta-border);
    }
    .services-macro:last-child { border-bottom: 0; padding-bottom: 0; }
    @media (min-width: 900px) { .services-macro { grid-template-columns: 280px 1fr; gap: 56px; } }
    .services-macro-head { position: sticky; top: 24px; align-self: start; }
    .services-macro-title {
      font-size: clamp(1.4rem, 2.2vw, 1.85rem);
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin: 0 0 12px;
    }
    .services-macro-intro { font-size: 14px; color: var(--pianeta-muted); line-height: 1.55; margin: 0; }

    .services-l2-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
    .services-l2-row {
      display: grid;
      grid-template-columns: 32px 1fr auto;
      gap: 16px;
      align-items: start;
      padding: 18px 8px;
      border-bottom: 1px solid var(--pianeta-border);
      text-decoration: none;
      color: inherit;
      transition: background 150ms;
    }
    .services-l2-row:hover { background: rgba(255,107,51,0.06); }
    .services-l2-icon { font-size: 20px; line-height: 1; }
    .services-l2-content { display: flex; flex-direction: column; gap: 4px; }
    .services-l2-title { font-size: 16px; font-weight: 700; color: var(--pianeta-text); }
    .services-l2-deck { font-size: 13px; color: var(--pianeta-muted); line-height: 1.45; }
    .services-l2-phase {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--cta-primary);
      font-weight: 600;
      align-self: center;
      white-space: nowrap;
    }
  </style>
</BaseLayout>
```

- [ ] **Step 3: Build + verify locale**

Run: `pnpm run build 2>&1 | tail -5`
Expected: `[build] Complete!`

- [ ] **Step 4: Rimuovere backup**

```bash
rm src/pages/services/index.astro.bak
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/services/
git commit -m "phase-2: rewrite /services index — 4 macro sections + process bar + 16 L2 rows"
```

---

## Phase 3 — L2 detail

### Task 3.1: Riscrivere `/services/[slug]`

**Files:**
- Modify: `src/pages/services/[slug].astro`

- [ ] **Step 1: Leggere il file attuale**

Run: `cat src/pages/services/\[slug\].astro`

- [ ] **Step 2: Sostituire l'intero contenuto con**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import DetailPage from '../../components/detail/DetailPage.astro';
import { getCollection, render } from 'astro:content';
import { pickNextItem, toNextProp } from '../../lib/next-item';
import { getCategoryByKey, getPhaseTag } from '../../lib/services-categories';

export const prerender = true;
export async function getStaticPaths() {
  const items = await getCollection('services');
  return items.map((item) => ({ params: { slug: item.id }, props: { item, allItems: items } }));
}

const { item, allItems } = Astro.props as any;
const { Content } = await render(item);
const data: any = item.data;
const title = data.title || item.id;
const cover = data.cover || data.ogImage;
const caseStudies: string[] = data.caseStudies || [];
const relatedServiceSlugs: string[] = data.relatedServices || [];

const category = data.category ? getCategoryByKey(data.category) : null;
const phaseTag = getPhaseTag(data.processPhase);

const eyebrowParts: Array<{label:string;href?:string}> = [{ label: 'Servizi', href: '/services' }];
if (category) eyebrowParts.push({ label: category.title, href: `/services#${category.key}` });

// Sibling services (stessa categoria, escluso corrente, top 3)
const siblings = allItems
  .filter((s: any) => s.data.category === data.category && s.id !== item.id && !s.data.draft)
  .sort((a: any, b: any) => (a.data.order ?? 999) - (b.data.order ?? 999))
  .slice(0, 3);

const relatedFromCaseStudies = caseStudies.map((slug: string) => ({ type: 'work', slug }));

const nextItem = toNextProp(pickNextItem(allItems, item.id), 'services');

const metaInline = [
  category && { label: 'Categoria', value: category.title, href: `/services#${category.key}` },
  phaseTag && { label: 'Fase process', value: phaseTag, href: '/processo' },
  data.team?.length && { label: 'Team', value: data.team.join(', ') },
].filter(Boolean);

const url = new URL(`/services/${item.id}`, Astro.site).toString();
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': url,
  name: title,
  description: data.description,
  url,
  image: data.ogImage || cover,
  serviceType: category?.title || title,
  category: category?.title || 'Design & Technology',
  provider: { '@type': 'Organization', name: 'Pianeta.Studio', url: 'https://xp.pianeta.studio' },
  areaServed: { '@type': 'AdministrativeArea', name: 'Europa' },
  ...(data.deliverables?.length && {
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Deliverable inclusi',
      itemListElement: data.deliverables.map((d: string, i: number) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: { '@type': 'Service', name: d },
      })),
    },
  }),
};
---
<BaseLayout title={`${title} — Pianeta.Studio`} description={data.description} ogImage={data.ogImage || cover}>
  <DetailPage
    eyebrowParts={eyebrowParts}
    title={title}
    deck={data.description}
    cover={cover}
    primaryCta={{ label: 'Lavoriamo insieme', action: 'open-hire-us' }}
    secondaryCta={{ label: 'Come lavoriamo', href: '/processo' }}
    backHref="/services"
    backLabel="Tutti i servizi"
    related={relatedFromCaseStudies}
    relatedTitle="Case study"
    nextItem={nextItem}
    metaInline={metaInline}
    twoCol={(item.body?.length ?? 0) > 2400}
    jsonLd={jsonLd}
  >
    <Content />

    {(data.inputClient?.length || data.deliverables?.length) && (
      <div class="service-blocks">
        {data.inputClient?.length > 0 && (
          <section class="service-block">
            <h3 class="service-block-title">Input Client</h3>
            <ul class="service-block-list">
              {data.inputClient.map((d: string) => <li>{d}</li>)}
            </ul>
          </section>
        )}
        {data.deliverables?.length > 0 && (
          <section class="service-block is-highlight">
            <h3 class="service-block-title">Deliverables Pianeta</h3>
            <ul class="service-block-list">
              {data.deliverables.map((d: string) => <li>{d}</li>)}
            </ul>
          </section>
        )}
      </div>
    )}

    {siblings.length > 0 && (
      <section class="service-siblings">
        <h3 class="service-siblings-title">Altri servizi in {category?.title || 'questa categoria'}</h3>
        <ul class="service-siblings-list">
          {siblings.map((s: any) => (
            <li>
              <a href={`/services/${s.id}`} class="service-sibling-card">
                <span class="service-sibling-icon">{s.data.icon || '•'}</span>
                <div>
                  <span class="service-sibling-title">{s.data.title}</span>
                  {s.data.description && <span class="service-sibling-deck">{s.data.description}</span>}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    )}
  </DetailPage>

  <style is:global>
    .service-blocks {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      margin: 56px 0 32px;
    }
    @media (min-width: 800px) { .service-blocks { grid-template-columns: 1fr 1fr; gap: 32px; } }
    .service-block {
      padding: 24px 28px;
      background: var(--pianeta-bg-card);
      border: 1px solid var(--pianeta-border);
      border-radius: 16px;
    }
    .service-block.is-highlight { border-color: var(--cta-primary); }
    .service-block-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--pianeta-muted);
      font-weight: 700;
      margin: 0 0 14px;
    }
    .service-block.is-highlight .service-block-title { color: var(--cta-primary); }
    .service-block-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
    .service-block-list li {
      padding-left: 20px;
      position: relative;
      font-size: 14px;
      line-height: 1.5;
    }
    .service-block-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--cta-primary);
      font-weight: 700;
    }

    .service-siblings { margin: 56px 0 32px; padding-top: 32px; border-top: 1px solid var(--pianeta-border); }
    .service-siblings-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--pianeta-muted);
      font-weight: 700;
      margin: 0 0 16px;
    }
    .service-siblings-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
    @media (min-width: 700px) { .service-siblings-list { grid-template-columns: 1fr 1fr 1fr; } }
    .service-sibling-card {
      display: grid;
      grid-template-columns: 28px 1fr;
      gap: 12px;
      padding: 16px;
      background: var(--pianeta-bg-card);
      border: 1px solid var(--pianeta-border);
      border-radius: 12px;
      text-decoration: none;
      color: inherit;
      transition: border-color 150ms;
    }
    .service-sibling-card:hover { border-color: var(--cta-primary); }
    .service-sibling-icon { font-size: 18px; }
    .service-sibling-title { display: block; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
    .service-sibling-deck { display: block; font-size: 12px; color: var(--pianeta-muted); line-height: 1.4; }
  </style>
</BaseLayout>
```

- [ ] **Step 3: Build + verify locale**

Run: `pnpm run build 2>&1 | tail -5`
Expected: `[build] Complete!` con 16 services entries generate.

- [ ] **Step 4: Commit**

```bash
git add src/pages/services/\[slug\].astro
git commit -m "phase-3: rewrite /services/[slug] — UX-Copywriting pattern (Input Client + Deliverables + siblings)"
```

---

## Phase 4 — Verify

### Task 4.1: Push + smoke test live

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Wait deploy + smoke test**

```bash
until curl -s -o /dev/null -w '%{http_code}' "https://xp.pianeta.studio/services/web-sostenibile" | grep -q 200; do sleep 8; done
echo "deploy live"
```

- [ ] **Step 3: Verify tutti i 16 URL + index**

```bash
SLUGS="brand-vision-strategy brand-positioning brand-audit pianeta-centric-design-strategy brand-identity-rebranding editorial-educational-design illustrazione-infografica microsites-data-stories web-sostenibile design-system-multi-brand piattaforme-dashboard app-prodotti-digitali neuromarketing-lab ai-validation-swarm esg-framework-atlas greenmeter-audit-co2"
echo "=== Index ==="
CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://xp.pianeta.studio/services")
printf "  /services → %s\n" "$CODE"
echo "=== L2 ==="
for S in $SLUGS; do
  CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://xp.pianeta.studio/services/$S")
  printf "  /services/%-40s → %s\n" "$S" "$CODE"
done
```

Expected: tutti `200`. Se qualcuno non è 200 → fix lo specifico file md.

- [ ] **Step 4: Verify cross-link case study presenti**

```bash
curl -sL https://xp.pianeta.studio/services/neuromarketing-lab | grep -oE '/work/eclag' | head -1
curl -sL https://xp.pianeta.studio/services/brand-identity-rebranding | grep -oE '/work/bc3-rebranding' | head -1
curl -sL https://xp.pianeta.studio/services/editorial-educational-design | grep -oE '/work/untwist' | head -1
```

Expected: ogni comando ritorna il link `/work/<slug>` come match.

- [ ] **Step 5: Verify Input Client + Deliverables visibili in HTML**

```bash
curl -sL https://xp.pianeta.studio/services/neuromarketing-lab | grep -c "Input Client"
curl -sL https://xp.pianeta.studio/services/neuromarketing-lab | grep -c "Deliverables Pianeta"
```

Expected: `1` per ognuno.

- [ ] **Step 6: Verify process chip → /processo**

```bash
curl -sL https://xp.pianeta.studio/services | grep -oE 'href="/processo#[a-z]+"' | sort -u
```

Expected: 4 anchor (`#discover`, `#ideate`, `#refine`, `#support`).

- [ ] **Step 7: Verifica `/processo` ha gli anchor**

Se manca, modifica `src/pages/processo.astro` aggiungendo `id={s.anchor}` ai 5 step (oppure ai 4 — i nomi della spec sono Discover/Ideate/Refine/Support; lo step "Measure & evolve" può prendere `id="measure"`).

Run: `grep -E 'id="(discover|ideate|refine|support)"' src/pages/processo.astro` → se vuoto, edit + commit + push + re-deploy.

- [ ] **Step 8: Final commit (se cambi processo.astro)**

```bash
git add src/pages/processo.astro
git commit -m "phase-4: aggiungere id ancore (discover/ideate/refine/support) per chip /services"
git push origin main
```

---

## Sanity check finale

- [ ] Aprire [https://xp.pianeta.studio/services](https://xp.pianeta.studio/services) — vedere 4 macro sections + process bar + 16 L2 rows
- [ ] Cliccare su un L2 (es. neuromarketing-lab) — vedere Input Client + Deliverables + sibling card
- [ ] Cliccare un chip della process bar — atterrare su `/processo#discover` (etc)
- [ ] Cliccare "Categoria" nel breadcrumb dell'L2 — tornare a `/services#data-ai` (etc)
- [ ] Cliccare un case study collegato — atterrare su `/work/<slug>`

Se tutti verdi: **done.**

---

## Out of scope (esplicito)

- Pricing pubblico nelle L2 (non chiesto)
- FAQ per servizio
- Video embed nelle L2
- Riga "Bundle / Package" (combinazione di più L2)
- Form lead-magnet specifico per servizio

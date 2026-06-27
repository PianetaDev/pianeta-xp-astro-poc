# /services — L2 architecture (CleverFranke-style)

**Status**: draft · **Author**: Max + Claude · **Date**: 2026-06-27

## Goal

Sostituire l'attuale `/services` flat con un'architettura a due livelli sul modello di [cleverfranke.com/services](https://www.cleverfranke.com/services):

- **L1 (index)** — 4 macro categorie con descrizione + elenco dei servizi della categoria
- **L2 (dettaglio)** — pagina per ogni singolo servizio con pattern *UX-Copywriting* (descrizione + Input Client + Deliverables + case + process tag)

Le 4 fasi del process restano una **linea narrativa trasversale** (vivono già su `/processo`), non diventano pagine. Ogni L2 è "taggato" con la fase di appartenenza.

## Context

Stato corrente: `src/pages/services/index.astro` mostra 4 macro hardcoded con sub-services flat (no detail page per ognuno). Esiste 1 sola content entry `creativita-e-neuromarketing.md`.

Problema individuato da Max:
1. Pattern CleverFranke con livello 2 mancante (ogni servizio merita una scheda dedicata)
2. Servizi forti (Neuromarketing Lab, Web sostenibile) non hanno proprio una pagina
3. Senza struttura il catalogo si dilata e i servizi signature si perdono

## Architecture

### Le 4 categorie (nomi CleverFranke)

| # | Categoria | Cosa contiene |
|---|---|---|
| 1 | **Strategic Design Consultancy** | Brand strategy, posizionamento, audit, Pianeta-centric design strategy |
| 2 | **Visualization & Storytelling** | Brand identity, editorial, illustrazione, microsites |
| 3 | **Products & Systems** | Web sostenibile, design system, piattaforme, app |
| 4 | **Data & AI** | Neuromarketing Lab, AI validation, Atlas ESG, GreenMeter |

### I 16 L2 services (URL slug)

**1 · Strategic Design Consultancy** → 4 L2
- `brand-vision-strategy`
- `brand-positioning`
- `brand-audit`
- `pianeta-centric-design-strategy`

**2 · Visualization & Storytelling** → 4 L2
- `brand-identity-rebranding`
- `editorial-educational-design`
- `illustrazione-infografica`
- `microsites-data-stories`

**3 · Products & Systems** → 4 L2
- `web-sostenibile` *(Stack Terra)*
- `design-system-multi-brand`
- `piattaforme-dashboard`
- `app-prodotti-digitali`

**4 · Data & AI** → 4 L2
- `neuromarketing-lab`
- `ai-validation-swarm`
- `esg-framework-atlas`
- `greenmeter-audit-co2`

### Le 4 fasi del process (linea narrativa)

Già esistenti su `/processo`. Ogni L2 dichiara la fase nel frontmatter (`processPhase: 1 | 2 | 3 | 4 | "1-2" | "2-3"` etc).

| # | Fase |
|---|---|
| 1 | Discover & define |
| 2 | Ideate & prototype |
| 3 | Refine & deliver |
| 4 | Support & validate |

## Page structure

### L1 — `/services` (index)

```
HERO
├─ eyebrow: "Sustainable Creativity · Design & Technology"
├─ title: "I servizi"
├─ deck: "Quattro aree di pratica…"
└─ CTAs: "Lavoriamo insieme" + "Come lavoriamo →" (link a /processo)

PROCESS BAR (sticky o full-width)
├─ 4 chip orizzontali con le fasi (linkano a /processo#fase-N)

CATEGORIE (4 sezioni)
├─ Per ogni categoria:
│   ├─ macro title (sticky-left desktop)
│   ├─ macro intro (1-2 paragrafi)
│   └─ lista L2 — ognuno è un link a /services/<slug>
│       └─ titolo + 1 riga descrizione + chip fase
```

### L2 — `/services/<slug>` (detail page)

```
HERO
├─ eyebrow: "<Category name>"
├─ title: "<Service name>"
├─ icon: round (lucide o emoji)
└─ deck: "<1 frase forte>"

BODY (UX-Copywriting style)
├─ Descrizione lunga (2-4 paragrafi)
├─ INPUT CLIENT (lista bullets)
├─ DELIVERABLES PIANETA (lista bullets)
├─ Process phase tag: "→ Fase N · <nome>"
├─ Related case studies (link a /work/<slug>)
└─ Sibling services nella stessa categoria (cross-link)

CTA FOOTER
├─ "Lavoriamo insieme" (orange — apre Hire Us drawer)
└─ Back to /services
```

## Data model

### Frontmatter schema esteso per `src/content/services/*.md`

```yaml
---
title: "Neuromarketing Lab"                   # service name
slug: neuromarketing-lab                       # url slug (= filename)
description: "<short deck>"                    # 1 frase
category: "data-ai"                            # 1 of 4 categories
processPhase: 2                                # 1|2|3|4 or string "2-3"
icon: "🧠"                                     # emoji or lucide:icon-name
cover: "/og/service-neuro.png"                 # optional
order: 1                                       # ordering within category
inputClient:                                   # bullets
  - "Concept video o audio"
  - "Brief creativo + KPI target"
deliverables:                                  # bullets
  - "Report di validazione"
  - "Heatmap predittive"
caseStudies: ["eclag"]                         # work slugs
relatedServices: ["ai-validation-swarm"]       # service slugs
locale: it
draft: false
type: service
---

Markdown body (descrizione lunga).
```

### Categories table (in `src/lib/services-categories.ts`)

```ts
export const SERVICE_CATEGORIES = [
  { key: 'strategic-design-consultancy', title: 'Strategic Design Consultancy', intro: '…' },
  { key: 'visualization-storytelling',   title: 'Visualization & Storytelling',   intro: '…' },
  { key: 'products-systems',             title: 'Products & Systems',             intro: '…' },
  { key: 'data-ai',                      title: 'Data & AI',                      intro: '…' },
];
```

## URL routing

- `/services` → index L1 (statico, prerender)
- `/services/<slug>` → L2 detail (prerender via getStaticPaths sulla collection `services`)
- `/processo` → invariata, già esistente
- No L1 per categoria (le categorie sono solo raggruppamenti visuali nell'index)

## Components

### Riusiamo

- `DetailPage.astro` — già esistente, ottimo per L2. Aggiungeremo prop opzionali per `inputClient[]`, `deliverables[]`, `processPhaseTag`
- `IndexCard.astro` — non adatto, le entry L2 dell'index sono righe minimal, non card immagine

### Nuovi

- `ServicesL1Section.astro` — una macro categoria nell'index, con title sticky + lista L2
- `ServicesL1Row.astro` — singola riga L2 nell'index (title + descrizione 1-riga + chip fase)
- `ServiceInputDeliverables.astro` — block riusabile "Input Client / Deliverables Pianeta"

## Migration plan

### Fase 1 — content scaffold (~30 min)
1. Creare i 16 file `.md` con frontmatter completo + body minimo (anche placeholder 200 parole)
2. Categorie + intro in `src/lib/services-categories.ts`
3. Estendere `content/config.ts` con nuovo schema (campi: category, processPhase, icon, inputClient[], deliverables[], relatedServices[])
4. **Mantenere** l'entry esistente `creativita-e-neuromarketing.md` come redirect/alias verso `neuromarketing-lab` (oppure rinominare)

### Fase 2 — index L1 (~45 min)
5. Riscrivere `src/pages/services/index.astro` con 4 sezioni macro che pescano i L2 dalla collection
6. Process bar in cima con link a `/processo#fase-N`
7. JSON-LD `OfferCatalog` esteso con tutte le 16 voci

### Fase 3 — L2 detail (~45 min)
8. Aggiornare `src/pages/services/[slug].astro` per renderizzare il pattern UX-Copywriting (Input Client + Deliverables Pianeta + process tag + related services)
9. Estendere `DetailPage.astro` con prop opzionali per il pattern UX-Cop
10. JSON-LD `Service` esteso con `category`, `hasOfferCatalog` (deliverables)

### Fase 4 — verify (~15 min)
11. Smoke test 16 URL + index
12. Verificare process tag → `/processo#fase-N` (anchor)
13. Verificare case study cross-link (ECLAG, UNTWIST, BC3 dove citati)
14. Commit + push

## Out of scope

- Pricing pubblico (Max decide se vuole aggiungerlo dopo)
- FAQ per servizio (per ora si tiene fuori, eventualmente aggiunta a singoli L2 più avanti)
- Video embed nei L2 (Max ha materiale video selezionato? Per ora no)
- A11y audit del nuovo flow (assumiamo che i pattern semantic restino ok come gli altri DetailPage)

## Success criteria

- 16 URL `/services/<slug>` rispondono 200
- Ogni L2 ha: eyebrow categoria · titolo · descrizione lunga · Input Client · Deliverables Pianeta · process tag · case (almeno per i 5 più forti)
- Index `/services` mostra le 4 categorie in 4 sezioni con i 4 L2 sotto ognuna
- Almeno 5 L2 hanno case study collegato (Neuromarketing Lab → ECLAG · Brand identity → BC3 · Editorial → UNTWIST · Web sostenibile → EPOS/Susdef · Atlas → atlas.pianeta.green)
- Niente regressioni su `/processo` o `/work/*`

## Open questions

Nessuna — gli L2 vuoti li scriviamo con contenuto placeholder e Max li popola incrementalmente.

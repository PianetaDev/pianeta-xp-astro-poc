---
title: "A new platform for Susdef"
description: "We designed and built the new digital platform for Fondazione Sviluppo Sostenibile: editorial site, 33,000+ document archive, full-text search and a generative AI layer. 12 weeks. Live since 16 July 2026."
client: "Fondazione Sviluppo Sostenibile (Susdef)"
category: "Platform"
year: 2026
date: 2026-09-09
sector: "Foundations · Environmental policy · Research"
services: ["piattaforme-dashboard", "app-prodotti-digitali"]
team: ["max", "fabrizio"]
links:
  live: "https://susdef.pianeta.green"
  bulletin: ["percorso-susdef"]
locale: en
draft: true
type: work
tags: ["cms", "archive", "nuxt", "payload-cms", "meilisearch", "accessibility", "sustainability", "foundations"]
tour:
  enabled: true
  chapters:
    - title: "The project"
      key_facts:
        - "Fondazione Sviluppo Sostenibile coordinates Italy's National Forum for Sustainable Development"
        - "New editorial platform + twenty-year document archive"
        - "Co-produced with Latte Creative"
    - title: "Stack and migration"
      key_facts:
        - "Nuxt 3 + Payload CMS + MeiliSearch"
        - "33,000+ records migrated"
        - "WCAG 2.1 AA · EU servers · GDPR"
    - title: "The result"
      key_facts:
        - "12 weeks from contract to go-live"
        - "Live at susdef.pianeta.green since 16 July 2026"
        - "DocumentAI module: semantic search, AI-generated abstracts, automated ingestion"
---

**TLDR.** We designed and built the new digital platform for Fondazione Sviluppo Sostenibile (Susdef): editorial site, a **33,000+ record** document archive built over twenty years, and a generative AI layer for querying the archive in natural language. **12 weeks · WCAG 2.1 AA · live at [susdef.pianeta.green](https://susdef.pianeta.green) since 16 July 2026.**

## The project

Fondazione Sviluppo Sostenibile coordinates Italy's National Forum for Sustainable Development — one of the key actors in the Italian ecological transition. It produces policy reports, research documents, and Forum proceedings: years of editorial output that the old site could no longer manage or make accessible.

When Susdef opened a competitive selection to redesign the platform, we entered alongside Latte Creative — as co-producers, not as a subcontractor. We won the selection and delivered in 12 weeks.

**Partner agency**: Latte Creative (creative direction and client relationship on the design side).

## The stack

The brief did not prescribe technology. The default answer for an editorial client is WordPress. We had a solid reason to propose something different.

We chose **Nuxt 3 (SSG) + Payload CMS + MeiliSearch**:

- **Payload CMS** — editorial management with live preview, native TypeScript, no plugin ecosystem to maintain. The application code is Susdef's property, delivered in full. No lock-in to us.
- **MeiliSearch** — full-text search across the archive with sub-50ms latency even at that scale, configurable relevance.
- **Nuxt 3 (SSG)** — performant, typed frontend with automatic asset optimisation.
- **WCAG 2.1 AA** — a brief requirement, integrated into the architecture from the start, not bolted on afterwards.
- **European hosting, GDPR-compliant** — servers in Europe, data under the client's jurisdiction.

## The migration

The archive is the heart of the project: twenty years of annual reports, policy positions, and Forum materials — to be migrated, cleaned, and normalised into a coherent schema.

The number: **over 33,000 records migrated** at the handover on 16 July 2026.

The migration pipeline was built as part of the project, not as an afterthought. Each record carries historical metadata to preserve and content relationships to maintain. The result is a structured archive built to last.

## The DocumentAI module

Susdef uses the platform in its full configuration: alongside the core CMS and search, the **DocumentAI module** is live — the generative AI layer on top of the archive:

- **AI ingestion** — automated processing of PDFs and publications, structured extraction of content and metadata
- **Automatic abstracts** — AI-generated summaries for each document, no manual editorial effort
- **Semantic search** — query the archive in natural language, not just exact keyword matches

The module uses external AI provider APIs. The "zero data outside jurisdiction" claim applies to the core platform (European hosting, client data), not to the generative AI layer.

## Three numbers

**33,000+** records migrated &nbsp;·&nbsp; **12** weeks from contract to go-live &nbsp;·&nbsp; **WCAG 2.1 AA** verified

## What Susdef keeps

- **The full application codebase** — client's property, with technical architecture documentation. They can take it to another vendor without us having any leverage.
- **A trained internal team** — capable of managing content, updating categories, and uploading documents independently.
- **A stack with no licence lock-in** — Payload CMS and Nuxt are open-source frameworks with active communities. No vendor can unilaterally change the terms.

## Read more

→ [How we won the Susdef pitch: Nuxt, Payload, and 33,000 records to search](/bulletin/percorso-susdef)

## FAQ

**Do you only use this stack for large archives?**
No. Nuxt + Payload + MeiliSearch scales in both directions. The principles — full-text search, code delivered in full, no lock-in — hold for smaller archives too. The cost scales down proportionally with complexity.

**Does working with you require going through Latte Creative?**
No. Susdef was a co-production with Latte Creative, who led the creative direction. We also work directly with foundations and research organisations on their own mandates.

**What happens if your studio closes?**
The code is the client's property, delivered in full with technical documentation. The platform runs independently of us — there is no Pianeta.Studio-managed service that needs to stay active for the site to work.

**Is the DocumentAI module available as a standalone service?**
It is an add-on to the Terra platform, not a standalone product. It is evaluated case by case, on a custom quote, for organisations with archives similar to Susdef.

## For a similar project

**[Talk to Alba →](/)**

*Partner agency: [Latte Creative](https://www.lattecreative.it)*

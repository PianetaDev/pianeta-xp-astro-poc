---
title: "Susdef prima/dopo — 33.000 contenuti su Payload + Nuxt (con numeri reali)"
description: "Fondazione Sviluppo Sostenibile aveva vent'anni di archivio documentale e un sito che non reggeva. Abbiamo migrato 33.000 contenuti su Nuxt 3 + Payload CMS + MeiliSearch in 12 settimane. Prima e dopo, con metriche reali."
date: 2026-09-07
draft: true
locale: it
tags: ["cms", "archivio", "nuxt", "payload-cms", "sostenibilità", "before-after", "web-sostenibile"]
type: bulletin
authors: ["max"]
readingTime: "6 min"
category: "Web sostenibile"
---

<!-- BOZZA COMPASS (PIA-1333) — richiede revisione prosa MUSE prima di rimuovere draft: true -->
<!-- ATTENZIONE MUSE: I numeri "prima" (LCP pre-intervento, page weight pre-intervento) devono essere verificati -->
<!-- con il team Susdef o con misurazioni archiviate prima del lancio. Non inventare. I numeri "dopo" -->
<!-- (33k record, 12 settimane, LCP <2.5s, 100% rinnovabile) sono verificati — vedi PIA-1333 audit. -->
<!-- Questo bulletin è DISTINTO da percorso-susdef.md (narrativa di gara/metodo) — -->
<!-- qui il focus è before/after tecnico e ambientale, non il percorso della selezione. -->

**TLDR.** La Fondazione Sviluppo Sostenibile aveva un archivio di oltre 33.000 documenti costruito in vent'anni — bloccato in un sistema che rendeva difficile trovare, aggiornare e mostrare quei contenuti. Abbiamo migrato tutto su Nuxt 3 + Payload CMS + MeiliSearch in 12 settimane. I numeri del prima e del dopo.

## Il contesto: un archivio importante che non si trovava

Susdef — Fondazione Sviluppo Sostenibile, coordinatrice del Forum Nazionale per lo Sviluppo Sostenibile — produce documentazione di policy, report di ricerca, materiali per ministeri e centri di ricerca da oltre vent'anni.

Il problema non era la quantità dei contenuti. Era l'accesso: un archivio inaccessibile è un archivio che non esiste. I documenti c'erano, ma non si trovavano.

<!-- MUSE: inserire qui 2-3 dati specifici sulla situazione precedente (page weight, LCP, tempo medio -->
<!-- di caricamento, eventuale piattaforma precedente). Verificare con team Susdef prima del lancio. -->

## Prima: [DATI DA VERIFICARE CON SUSDEF]

| Metrica | Prima |
|---|---|
| Piattaforma | [da verificare] |
| Page weight home | [da verificare] |
| LCP | [da verificare] |
| Record archivio accessibili via ricerca | [da verificare] |
| Hosting | [da verificare] |

## Dopo: cosa è cambiato in 12 settimane

| Metrica | Dopo |
|---|---|
| Piattaforma | Nuxt 3 + Payload CMS + MeiliSearch |
| Record migrati | >33.000 |
| LCP | <2.5s |
| Ricerca semantica archivio | Sì (query per concetto, non solo parole chiave) |
| Hosting | Europeo, GDPR-compliant |
| CO₂ per visita | [da misurare con GreenMeter post-lancio] |
| Tempo di consegna | 12 settimane dalla firma |

## Cosa significa "archivio interrogabile"

La differenza non è solo velocità di caricamento. È il tipo di accesso che diventa possibile.

Con il vecchio sistema, trovare un documento significava sapere già cosa cercare. Con MeiliSearch integrato su 33.000 record, è possibile fare una query come "documenti sulla fiscalità delle rinnovabili prima del 2020" e ottenere risultati pertinenti anche quando i testi non contengono esattamente quelle parole.

È la differenza tra un archivio che si cerca e un archivio che si interroga.

## Il nodo della sostenibilità

Susdef è una fondazione che lavora sulla transizione ecologica. Il sito che rappresenta quella fondazione doveva riflettere lo stesso metodo.

L'hosting è europeo e alimentato a energia rinnovabile — non come optional, come requisito di progetto integrato nell'architettura. Il carbon budget del sito è stato definito insieme al performance budget: due vincoli tecnici verificabili, non dichiarazioni di intento.

## Cosa ha ottenuto Susdef

- **33.000+ record migrati** — tutto l'archivio storico, non un subset
- **Codice di proprietà di Susdef** — possono portarlo da qualsiasi fornitore futuro
- **Team interno formato** — gestiscono contenuti e aggiornamenti in autonomia
- **Stack open source** — nessun vendor che può cambiare i termini unilateralmente
- **Ricerca semantica** — l'archivio è interrogabile per concetto
- **WCAG 2.1 AA** — accessibilità strutturale, non retroattiva

## Se hai un archivio simile

Ogni organizzazione con anni di produzione editoriale ha una versione di questo problema: contenuti preziosi che nessuno riesce a trovare, su una piattaforma che non regge il carico, con una migrazione che sembra impossibile.

Non è impossibile. Richiede un piano di migrazione costruito nel progetto, non aggiunto alla fine.

Parla con Alba per capire se il tuo caso è simile a quello di Susdef — oppure scrivi a [info@pianeta.studio](mailto:info@pianeta.studio).

---

*Vedi anche: [percorso-susdef](/bulletin/percorso-susdef) — come abbiamo partecipato alla selezione e perché abbiamo vinto.*

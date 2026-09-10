---
title: "Stack Terra: perché Payload CMS + Nuxt + MeiliSearch"
description: "Non ottimizziamo singoli componenti — progettiamo sistemi che si ottimizzano insieme. Perché abbiamo scelto questo stack specifico, cosa fa ogni pezzo, e perché la combinazione conta più delle singole parti."
date: 2026-09-07
draft: true
locale: it
tags: ["cms", "nuxt", "payload-cms", "meilisearch", "stack", "architettura", "web sostenibile"]
type: bulletin
authors: ["max"]
readingTime: "6 min"
category: "Web sostenibile"
---

**TLDR.** Payload CMS + Nuxt 3 + MeiliSearch è lo stack su cui abbiamo costruito i progetti editoriali e documentali più complessi degli ultimi due anni. Non è una scelta di default — è una scelta deliberata, verificata su archivi reali con migliaia di contenuti. Ecco cosa fa ogni pezzo e perché la combinazione funziona.

## Il principio

Non ottimizziamo singoli componenti. Progettiamo sistemi che si ottimizzano insieme — ogni layer conosce gli altri.

Questo significa che scegliere uno stack non è scegliere tre strumenti separati: è scegliere come quei tre strumenti si parlano, si scambiano dati, si aggiornano insieme. Il CMS deve sapere cosa fa il motore di ricerca. Il frontend deve sapere cosa ottimizzare. L'infrastruttura deve supportare le esigenze degli altri due.

## Payload CMS — perché non WordPress (e non Contentful)

WordPress è il default di settore. È la risposta che ricevi da qualsiasi agenzia che non ha un motivo solido per proporre altro.

Abbiamo un motivo solido.

**Payload CMS è open source, TypeScript-first, senza plugin.** Non ha un ecosistema di plugin di terze parti che invecchiano in modo incontrollato — l'API è definita in codice, non in configurazione. Questo significa che il progetto che consegniamo oggi è leggibile e modificabile da qualsiasi sviluppatore tra tre anni, senza dover capire quale versione di quale plugin era attiva nel 2026.

Il codice applicativo che costruiamo è **proprietà del cliente** — consegnato integralmente con documentazione tecnica. Un altro dev può subentrare con un HANDOFF.md chiaro. Non c'è nessun lock-in verso di noi, e non c'è lock-in verso il CMS (Payload è framework aperto, non licenza commerciale).

Per archivi documentali: Payload gestisce schemi di dati strutturati complessi — relazioni tra documenti, metadati multipli per tipo di contenuto, controllo granulare degli accessi (utile per embargo, draft, contenuti per soli partner). Live preview nativo.

**Perché non Contentful o Sanity**: entrambi sono SaaS — il dato vive sui loro server, il prezzo scala con il volume, la dipendenza è strutturale. Con Payload il dato è tuo e gira su un server che controlli.

## Nuxt 3 — frontend con performance native

Nuxt 3 gestisce il frontend con SSG (Static Site Generation) — le pagine vengono pre-generate, non calcolate a ogni richiesta. Questo significa performance native senza sacrificare dinamismo dove serve (form, ricerca, componenti interattivi).

**Carbon budget e performance budget** si integrano in CI: ogni deploy viene misurato automaticamente. Se una modifica fa superare il budget di peso pagina o di LCP, il sistema lo segnala prima che vada in produzione. Non è un controllo post-lancio — è un vincolo durante lo sviluppo.

TypeScript forte su tutta la codebase: il codice che consegniamo è leggibile, tipizzato, documentato. La manutenzione da parte di un terzo non richiede di "decifrare" lo stack esistente.

## MeiliSearch — ricerca su scala senza costi SaaS

La domanda classica per archivi documentali: Algolia o Elasticsearch?

Algolia è eccellente — e costa il doppio ogni anno da quando sei dipendente. Elasticsearch è potente — e richiede competenze di infrastruttura che la maggior parte dei team non ha internamente.

**MeiliSearch è open source, self-hosted, e gestisce ricerca full-text con latenza <50ms** su dataset di decine di migliaia di documenti. Non ha costi SaaS scalanti. Gira sullo stesso server del resto dell'infrastruttura, gestito da noi o consegnato al cliente.

La ricerca semantica su MeiliSearch permette di interrogare l'archivio per significato — non solo per parole chiave esatte. Una query come "documenti sulla fiscalità ambientale" restituisce risultati pertinenti anche quando quell'esatta combinazione di parole non compare nei testi.

## Come i tre layer interagiscono

```
Payload CMS          →    fonte del dato strutturato
       ↓                         ↓
   Nuxt 3 (frontend)        MeiliSearch (ricerca)
   (pagine pre-generate)    (indice full-text aggiornato
                             a ogni publish di Payload)
```

Quando un documento viene pubblicato o aggiornato in Payload, l'indice MeiliSearch si aggiorna automaticamente. Non c'è sincronizzazione manuale, non c'è doppio aggiornamento, non c'è stato divergente tra "quello che c'è nel CMS" e "quello che si trova cercando".

Il frontend Nuxt pre-genera le pagine dal dato Payload — il sito è veloce perché non c'è logica da eseguire a runtime per le pagine statiche. La ricerca usa MeiliSearch direttamente dal browser.

## Il vincolo di sistema

Il risultato di questa architettura non è "tre buoni strumenti" — è un sistema che:
- Si aggiorna in modo coerente tra CMS e ricerca
- Ha performance verificabili in CI, non solo al lancio
- Consegna il codice al cliente senza lock-in
- Funziona su hosting europeo self-hosted, GDPR-compliant per struttura

Verificato in produzione su archivi reali: Fondazione per lo Sviluppo Sostenibile, >33.000 contenuti, sito live dal 16 luglio 2026.

---

*Questo è lo stack che chiamiamo Terra — il layer CMS dell'ecosistema Pianeta.Studio. I dettagli sull'ecosistema completo (hosting + CMS + design system) sono su [pianeta.green](https://pianeta.green).*

*Per il caso d'uso documentale in dettaglio: [Susdef prima e dopo](/bulletin/susdef-prima-dopo).*

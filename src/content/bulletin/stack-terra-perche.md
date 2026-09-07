---
title: "Stack Terra: perché abbiamo scelto Payload + Nuxt + MeiliSearch"
description: "Ogni progetto web potrebbe girare su WordPress. Quando non lo fa — e perché — è una scelta tecnica che vale la pena spiegare. Questo è lo stack che usiamo per siti editoriali, piattaforme documentali e CMS complessi, e le ragioni concrete dietro ogni scelta."
date: 2026-09-07
draft: true
locale: it
tags: ["stack-terra", "payload-cms", "nuxt", "meilisearch", "cms", "architettura", "web-sostenibile"]
type: bulletin
authors: ["max"]
readingTime: "6 min"
category: "Web sostenibile"
---

<!-- BOZZA COMPASS (PIA-1333) — richiede revisione prosa MUSE prima di rimuovere draft: true -->
<!-- Persona: valutatori tecnici e comm manager tech-savvy che stanno valutando un cambio di piattaforma. -->
<!-- NON nominare EPOS-ERIC in questo bulletin (NDA). -->
<!-- Tone: diretto e tecnico ma non accademico. Spiega le scelte, non vantarti delle tecnologie. -->

**TLDR.** Potremmo usare WordPress per ogni progetto — è il default di settore. Non lo facciamo per i progetti complessi perché il default di settore scarica il debito tecnico sul cliente. Questo è lo stack che usiamo invece, e perché ogni scelta ha senso.

## Il problema con il default

WordPress funziona. È la risposta corretta per milioni di siti e la sbagliata per alcuni tipi di progetti.

Il tipo sbagliato: siti editoriali con grandi archivi di contenuti, requisiti di ricerca avanzata, accessibilità strutturale, e aspettativa di vita lunga. Su quel tipo di progetto, WordPress accumula debito — plugin che invecchiano, performance che degradano, migrazioni future che diventano costose.

Non è un difetto di WordPress. È una questione di fit.

## I tre layer di Terra

[VERBATIM da pianeta.green] "Non ottimizziamo singoli componenti. Progettiamo sistemi che si ottimizzano insieme — ogni layer conosce gli altri."

**Terra** è il nome del nostro stack per siti e piattaforme content-driven. È composto da tre layer che lavorano come sistema:

### Payload CMS — il backoffice

Payload CMS è open source, TypeScript-first, senza vendor lock-in sulle licenze. Il codice applicativo che costruiamo su Payload è del cliente — può portarlo da qualsiasi altro fornitore con la documentazione in mano.

[VERBATIM da pianeta.green] "Un altro dev può subentrare con un HANDOFF.md chiaro. Codice consegnato."

Non è una promessa commerciale. È una caratteristica tecnica: lo schema dati è nel codice, la documentazione è nel repo, la struttura è leggibile da chiunque sappia leggere TypeScript.

Cosa gestisce Payload:
- Content types personalizzati (niente schema rigido preimpostato)
- Access control granulare
- API REST e GraphQL native
- Localizzazione integrata
- Upload e gestione media

### Nuxt 3 — il frontend

Nuxt 3 è il framework Vue per il frontend. Gestisce rendering ibrido (SSR/SSG/ISR) per performance native su ogni tipo di contenuto — pagine statiche dove ha senso, rendering dinamico dove serve.

Perché Nuxt e non un'altra opzione: ecosistema Vue maturo, TypeScript-first, integrazione nativa con Payload. Le Core Web Vitals sono buone per definizione di architettura, non per ottimizzazione successiva.

### MeiliSearch — la ricerca

MeiliSearch gestisce la ricerca full-text sull'archivio con latenza sotto i 50ms anche su dataset di grande dimensione. Supporta ricerca semantica — query per concetto, non solo per keyword esatta.

La differenza pratica: su un archivio di 33.000 documenti come quello di Susdef, la ricerca semantica è la differenza tra un archivio che si cerca e un archivio che si interroga.

### Mycelium — l'hosting

Il layer hosting di Terra è **Mycelium**: alimentato al 100% da energia rinnovabile certificata, CDN Cloudflare con edge node italiano, uptime SLA 99.7%.

Il carbon budget del sito è un vincolo verificabile in CI — non una dichiarazione di marketing.

## Le scelte che fanno la differenza

**TypeScript ovunque.** Schema dati, API, componenti frontend — tutto tipizzato. Riduce i bug in produzione, rende il codice manutenibile da chi non ha scritto la prima versione.

**Accessibilità strutturale.** WCAG 2.1 AA come requisito di architettura, non come retrofitting. I componenti di Hederae (il design system) sono built per accessibilità.

**Nessun plugin critico di terze parti.** La stabilità a lungo termine di un sito WordPress dipende dai plugin — da chi li mantiene, quando si aggiornano, se sono compatibili tra loro. Su Terra, la dipendenza esterna critica è il framework, non i plugin.

**Codice consegnato.** Il repo è del cliente. Il HANDOFF.md è parte della consegna. Non c'è leva tecnica che ci mantiene in posizione di fornitore indispensabile.

## Quando ha senso

Terra è la scelta giusta per:
- Archivi documentali di media/grande dimensione (da qualche centinaio a decine di migliaia di record)
- Siti con requisiti di ricerca avanzata
- Organizzazioni che vogliono proprietà reale del codice — non solo dell'hosting
- Progetti con vincoli di accessibilità (WCAG) e GDPR strutturali
- B Corp, fondazioni, centri di ricerca, NGO con aspettativa di vita del sito >5 anni

Quando non ha senso: un sito vetrina semplice, un blog personale, un e-commerce standard senza requisiti archivio. In quei casi usiamo strumenti più leggeri.

## La domanda giusta da fare

Quando stai valutando un cambio di piattaforma, la domanda non è "qual è lo stack più moderno". È "quale stack regge ancora bene tra cinque anni con il mio volume di contenuti e i miei requisiti?".

Se la risposta a quella domanda non è ovvia, vale la pena parlarne prima di scrivere il capitolato.

Parla con Alba — oppure scrivi a [info@pianeta.studio](mailto:info@pianeta.studio).

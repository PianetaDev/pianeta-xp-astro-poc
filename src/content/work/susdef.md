---
title: "Una nuova piattaforma per Susdef"
description: "Abbiamo progettato e sviluppato la nuova piattaforma di Fondazione Sviluppo Sostenibile: sito editoriale, archivio documentale di 33.000+ record, ricerca full-text e layer AI generativo. 12 settimane. Live dal 16 luglio 2026."
client: "Fondazione Sviluppo Sostenibile (Susdef)"
category: "Platform"
year: 2026
date: 2026-09-09
sector: "Fondazioni · Politica ambientale · Ricerca"
services: ["piattaforme-dashboard", "app-prodotti-digitali"]
team: ["max", "fabrizio"]
links:
  live: "https://susdef.pianeta.green"
  bulletin: ["percorso-susdef"]
locale: it
draft: true
type: work
tags: ["cms", "archivio", "nuxt", "payload-cms", "meilisearch", "accessibilità", "sostenibilità", "fondazioni"]
tour:
  enabled: true
  chapters:
    - title: "Il progetto"
      key_facts:
        - "Fondazione Sviluppo Sostenibile coordina il Forum Nazionale per lo Sviluppo Sostenibile"
        - "Nuova piattaforma editoriale + archivio documentale ventennale"
        - "Co-produzione con Latte Creative"
    - title: "Stack e migrazione"
      key_facts:
        - "Nuxt 3 + Payload CMS + MeiliSearch"
        - "33.000+ record migrati"
        - "WCAG 2.1 AA · server europei · GDPR"
    - title: "Il risultato"
      key_facts:
        - "12 settimane dalla firma al go-live"
        - "Live su susdef.pianeta.green dal 16 luglio 2026"
        - "Modulo DocumentAI: ricerca semantica, abstract automatici, ingestione AI"
---

**TLDR.** Abbiamo progettato e sviluppato la nuova piattaforma digitale di Fondazione Sviluppo Sostenibile (Susdef): sito editoriale, archivio documentale di **33.000+ record** costruito in vent'anni, e un layer AI generativo per interrogare l'archivio in linguaggio naturale. **12 settimane · WCAG 2.1 AA · live su [susdef.pianeta.green](https://susdef.pianeta.green) dal 16 luglio 2026.**

## Il progetto

Fondazione Sviluppo Sostenibile coordina il Forum Nazionale per lo Sviluppo Sostenibile — uno degli attori di riferimento per la transizione ecologica italiana. Produce report di policy, documenti di ricerca, atti del Forum: anni di produzione editoriale che il vecchio sito non riusciva più a gestire né a rendere accessibile.

Quando Susdef ha aperto la selezione per riprogettare la piattaforma digitale, abbiamo partecipato insieme a Latte Creative — co-produttori, non subfornitori. Abbiamo vinto la selezione e consegnato in 12 settimane.

**Agenzia partner**: Latte Creative (direction creativa e relazione cliente sul piano del design).

## Lo stack

Il capitolato non prescriveva tecnologia. La risposta di default per un cliente editoriale è WordPress. Avevamo un motivo solido per proporre altro.

Abbiamo scelto **Nuxt 3 (SSG) + Payload CMS + MeiliSearch**:

- **Payload CMS** — gestione editoriale con live preview, TypeScript nativo, nessun ecosistema di plugin da manutenere. Il codice applicativo è proprietà di Susdef, consegnato integralmente. Nessun lock-in verso di noi.
- **MeiliSearch** — ricerca full-text sull'archivio con latenza sotto i 50ms anche a quella scala, rilevanza configurabile.
- **Nuxt 3 (SSG)** — frontend performante e tipizzato, ottimizzazione automatica degli asset.
- **WCAG 2.1 AA** — requisito del capitolato, integrato nell'architettura dall'inizio, non aggiunto a posteriori.
- **Hosting europeo, GDPR-compliant** — server in Europa, dati sotto la giurisdizione del cliente.

## La migrazione

L'archivio è il cuore del progetto: vent'anni di report annuali, posizioni di policy, materiali del Forum — da migrare, pulire e normalizzare in uno schema coerente.

Il numero: **oltre 33.000 record migrati** all'handover del 16 luglio 2026.

La pipeline di migrazione è stata costruita come parte del progetto, non come attività postuma. Ogni record porta metadati storici da preservare e relazioni tra contenuti da mantenere. Il risultato è un archivio strutturato che reggera nel tempo.

## Il modulo DocumentAI

Susdef usa la piattaforma nella versione completa: oltre al core CMS + ricerca, è attivo il **modulo DocumentAI** — il layer AI generativo sull'archivio:

- **Ingestione AI** — elaborazione automatica di PDF e pubblicazioni, estrazione strutturata di contenuto e metadati
- **Abstract automatici** — sintesi generate per ogni documento senza intervento redazionale
- **Ricerca semantica** — interrogazione dell'archivio in linguaggio naturale, non solo per parole chiave esatte

Il modulo usa API di provider AI esterni. La claim "zero data fuori dalla giurisdizione" vale per il core della piattaforma (hosting europeo, dati del cliente), non per il layer AI generativo.

## Tre numeri

**33.000+** record migrati &nbsp;·&nbsp; **12** settimane dalla firma al go-live &nbsp;·&nbsp; **WCAG 2.1 AA** verificato

## Cosa resta a Susdef

- **Il codice applicativo, per intero** — proprietà del cliente, con documentazione tecnica dell'architettura. Possono portarlo da un altro fornitore senza che Pianeta abbia leva.
- **Un team interno formato** — in grado di gestire contenuti, aggiornare categorie e caricare documenti in autonomia.
- **Uno stack senza lock-in di licenza** — Payload CMS e Nuxt sono framework open source con community attive. Nessun vendor può cambiare i termini unilateralmente.

## Approfondimento

→ [Come abbiamo vinto la gara Susdef: Nuxt, Payload, e 33.000 contenuti da interrogare](/bulletin/percorso-susdef)

## FAQ

**Usate questo stack solo per archivi grandi?**
No. Nuxt + Payload + MeiliSearch scala in entrambe le direzioni. I principi — ricerca full-text, codice consegnato, nessun lock-in — restano gli stessi anche per archivi più piccoli. Il costo si riduce proporzionalmente alla complessità.

**Lavorare con voi richiede di passare per Latte Creative?**
No. Susdef è una co-produzione con Latte Creative, che ha curato la direction creativa. Lavoriamo anche direttamente con fondazioni e centri di ricerca su mandati propri.

**Cosa succede se il vostro studio chiude o smette di esistere?**
Il codice è proprietà del cliente, consegnato in toto con documentazione tecnica. La piattaforma funziona indipendentemente da noi — non c'è nessun servizio gestito da Pianeta.Studio che deve restare attivo per far girare il sito.

**Il modulo DocumentAI è disponibile come servizio separato?**
È un add-on della piattaforma Terra, non un prodotto standalone. Si valuta caso per caso, su preventivo, per organizzazioni con archivi documentali simili a Susdef.

## Per un progetto simile

**[Parla con Alba →](/)**

*Agenzia partner: [Latte Creative](https://www.lattecreative.it)*

---
title: "Susdef prima e dopo: cosa cambia quando 33.000 documenti diventano trovabili"
description: "Fondazione per lo Sviluppo Sostenibile aveva 33.000 contenuti su un WordPress costruito in vent'anni. Nessuno riusciva più a trovarli. Abbiamo migrato tutto su Nuxt + Payload + MeiliSearch in 12 settimane. I numeri prima e dopo."
date: 2026-09-07
draft: true
locale: it
tags: ["cms", "archivio", "nuxt", "payload-cms", "meilisearch", "sostenibilità", "prima-dopo", "susdef"]
type: bulletin
authors: ["max"]
readingTime: "4 min"
category: "Web sostenibile"
---

**TLDR.** Fondazione per lo Sviluppo Sostenibile aveva oltre 33.000 contenuti su WordPress, costruiti in vent'anni di produzione editoriale. L'archivio era tecnicamente intatto e praticamente inaccessibile — anche al team interno. Abbiamo migrato tutto su Nuxt 3 + Payload CMS + MeiliSearch in 12 settimane. Qui i numeri concreti del prima e del dopo.

> Nota: se cerchi la storia estesa — come è nata la selezione, perché abbiamo scelto questo stack, le scelte tecniche — è in [Come abbiamo vinto la gara Susdef](/bulletin/percorso-susdef). Questo articolo è solo i numeri.

## Prima

| Dato | Situazione |
|---|---|
| Piattaforma | WordPress — costruita nel corso di 20 anni |
| Volume archivio | >33.000 contenuti (articoli, documenti, pubblicazioni) |
| Ricerca | Ricerca per titolo esatto — se non sai già come si chiama il documento, non lo trovi |
| Accessibilità interna | Il team Susdef cercava manualmente nelle categorie o Google site: per trovare i propri materiali |
| Accessibilità esterna | Ministeri, centri di ricerca, fondazioni partner: stessa esperienza — archivio esistente ma innavigabile |
| Accessibilità WCAG | Non verificata strutturalmente |
| Dipendenza dal fornitore | Codice e configurazione WordPress legati al setup esistente |

## Dopo

| Dato | Situazione |
|---|---|
| Piattaforma | Nuxt 3 + Payload CMS + MeiliSearch — stack open source, server europei |
| Volume migrato | **>33.000 record** all'handover del 16 luglio 2026 |
| Ricerca | Full-text su tutto l'archivio con latenza <50ms — interrogabile per domande, non solo per parole chiave esatte |
| Accessibilità interna | Il team gestisce tutto in autonomia dal CMS backoffice — carica documenti, aggiorna categorie, pubblica senza dipendere da noi |
| Accessibilità esterna | Archivio navigabile e interrogabile per partner, ricercatori, giornalisti |
| Accessibilità WCAG | WCAG 2.1 AA verificata a livello di componente — requisito del capitolato, integrato nell'architettura |
| Dipendenza dal fornitore | **Zero**: codice applicativo di proprietà di Susdef, consegnato con documentazione tecnica completa. Un altro fornitore può subentrare domani con un HANDOFF.md chiaro. |

## I numeri che contano

**12 settimane** dalla firma al go-live — con migrazione completa dell'archivio, test di accessibilità, formazione del team interno, redirect 301 su tutti gli URL storici.

**>33.000 record migrati** — non un'importazione grezza. Ogni record porta metadati storici da pulire, relazioni tra contenuti da preservare, tag e categorizzazioni da normalizzare in uno schema coerente.

**Ricerca semantica live**: una query come "documenti sulla fiscalità delle rinnovabili prima del 2020" restituisce risultati pertinenti anche quando i testi non contengono esattamente quelle parole. La differenza tra un archivio che si cerca e un archivio che si interroga.

**Hosting europeo e GDPR-compliant per requisito**, non per opzione — VPS gestito da Fabrizio Ciampini, backup giornalieri, SSL/HSTS/CSP.

## Cosa non è cambiato (nel senso giusto)

Il contenuto che Susdef ha prodotto in vent'anni è intatto — con tutti i metadati, le relazioni tra documenti, le categorizzazioni originali dove ricostruibili. La migrazione non è stata un'approssimazione da rifinire in produzione: è stata parte del progetto, con la stessa attenzione alla qualità del dato che si dà allo sviluppo.

Il team interno non ha perso continuità editoriale — ha guadagnato un ambiente di training dedicato (separato dalla produzione) su cui esercitarsi prima del go-live, e una formazione inclusa nel progetto.

---

## Applicabile al tuo caso?

L'architettura Nuxt + Payload + MeiliSearch scala in entrambe le direzioni — verso archivi più grandi e verso organizzazioni più piccole con archivi da qualche centinaio di documenti. I principi restano gli stessi: ricerca semantica, codice consegnato, nessun lock-in.

Se hai un archivio documentale che nessuno riesce più a navigare davvero, parliamone prima di scrivere il capitolato.

**[Parla con noi ↗](https://cal.com/maxmauro)**

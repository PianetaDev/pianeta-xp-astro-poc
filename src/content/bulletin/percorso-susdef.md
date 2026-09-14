---
title: "Il percorso Susdef: dall'ascolto alla proposta che va oltre"
description: "Fondazione Sviluppo Sostenibile aveva esigenze chiare e trent'anni di archivio documentale da far funzionare meglio. Siamo partiti da lì — non dalla nostra soluzione preferita. Il percorso, e cosa ha aperto."
date: 2026-08-27
draft: true
locale: it
tags: ["cms", "archivio", "nuxt", "payload-cms", "sostenibilità", "metodo"]
type: bulletin
authors: ["max"]
readingTime: "6 min"
category: "Metodo"
---

**TLDR.** Fondazione Sviluppo Sostenibile aveva requisiti definiti e un archivio di trent'anni che non riusciva a valorizzare. Siamo partiti dalle loro esigenze — non dalla nostra risposta standard. Da quella conversazione è emerso uno stack diverso da quello atteso, una migrazione di oltre 33.000 contenuti, e proposte che non erano nel capitolato originale.

## Da dove siamo partiti

La Fondazione Sviluppo Sostenibile — Susdef — coordina il Forum Nazionale per lo Sviluppo Sostenibile, produce da trent'anni report, documenti di policy e materiali di ricerca che ministeri e centri di ricerca usano come riferimento. Quando ci hanno coinvolto nella selezione, avevano le idee abbastanza chiare: sito rinnovato, CMS gestibile in autonomia dal team interno senza dipendere dal fornitore per ogni modifica, accessibilità WCAG 2.1 AA (requisito contrattuale, non opzionale), hosting europeo GDPR-compliant.

Quello che non avevano ancora risolto era l'archivio: **oltre 33.000 contenuti** costruiti in trent'anni di produzione editoriale — articoli, report, download, categorizzazioni stratificate nel tempo — difficili da trovare, difficili da connettere tra loro, difficili da tenere vivi.

Siamo partiti da lì.

## Lo stack: non la risposta attesa, ma quella giusta

Il capitolato non prescriveva tecnologia. La risposta più semplice sarebbe stata WordPress: è il default del settore, riduce la frizione nella valutazione, funziona benissimo per archivi più piccoli.

Ma guardando la scala dei dati di Susdef e la traiettoria che avevano davanti — un archivio che cresce, un team che vuole autonomia operativa, la necessità di non ritrovarsi tra tre anni con un sistema da rifare — WordPress avrebbe rimandato il problema, non risolto.

Abbiamo proposto **Nuxt 3 + Payload CMS + MeiliSearch**. Non perché fosse la nostra scelta preferita in astratto: perché era la risposta ai loro vincoli concreti. Nessun vendor da cui dipendere per le licenze — Payload CMS è un framework open source con community attiva. Performance native su un dataset di questa dimensione. Codice applicativo che rimane proprietà di Susdef: possono portarlo da qualunque altro fornitore, senza che noi abbiamo leva. Nessun lock-in.

Susdef ha riconosciuto la differenza tra uno stack che regge e uno che rinvia. L'ha scelta.

## Dall'archivio che si cerca all'archivio che risponde

Questo è il punto in cui il percorso è andato oltre il capitolato.

Un archivio di 33.000 contenuti che funziona sulla ricerca tradizionale — parole chiave, filtri per categoria, anno, autore — è già un valore. Ma non risolve il problema reale di chi cerca: spesso non conosce le parole esatte usate nel documento che gli serve. Sa la domanda, non il titolo.

Ascoltando le persone che usano l'archivio ogni giorno, era evidente: cercano risposte, non documenti. Abbiamo proposto di rendere l'archivio interrogabile — in grado di rispondere a domande in linguaggio naturale, non solo di filtrare per metadati. Una query come *"documenti sulla fiscalità delle rinnovabili prima del 2020"* restituisce risultati pertinenti anche quando i testi non contengono esattamente quelle parole.

Questa proposta non era nel capitolato. Era emersa dall'ascolto.

## Il risultato e cosa ha aperto

Dalla firma al go-live: **12 settimane**. Oltre 33.000 record migrati con metadati puliti, relazioni preservate, categorizzazioni normalizzate. Formazione al team interno inclusa. Handover documentato.

Susdef ha ora un archivio che il loro team gestisce in autonomia, su uno stack senza scadenze di licenza, con il codice applicativo interamente di loro proprietà.

La parte più interessante, per noi, è quello che questo percorso ha aperto. Lavorare con un archivio di questa scala ha fatto emergere possibilità che non erano visibili all'inizio — e alcune si sono trasformate in proposte concrete per sviluppi successivi. Non erano nel contratto originale. Sono nate dall'ascolto di cosa serviva davvero, una volta che il sistema funzionava.

Non sempre il lavoro più interessante è quello che si vede nel capitolato.

## Vedi anche

→ Case study Susdef — in arrivo

## Parlane con noi

Se hai un archivio documentale che non riesce a valorizzare quello che contiene — per dimensione, complessità, o uno stack che è diventato un ostacolo — scrivici prima di scrivere il capitolato.

**[max@pianeta.studio](mailto:max@pianeta.studio)**

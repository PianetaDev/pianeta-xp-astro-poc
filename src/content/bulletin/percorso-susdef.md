---
title: "Come abbiamo vinto la gara Susdef: Nuxt, Payload, e 33.000 contenuti da interrogare"
description: "Fondazione Sviluppo Sostenibile ha selezionato Pianeta.Studio in una gara aperta. Abbiamo scelto Nuxt 3 + Payload CMS invece di WordPress, migrato oltre 33.000 record da vent'anni di archivio editoriale, reso l'archivio interrogabile con AI. Consegna in 12 settimane. Il percorso, le scelte tecniche, le ragioni."
date: 2026-08-27
draft: false
locale: it
tags: ["cms", "archivio", "nuxt", "payload-cms", "sostenibilità", "metodo", "gara"]
type: bulletin
authors: ["max"]
readingTime: "7 min"
category: "Metodo"
---

**TLDR.** Fondazione Sviluppo Sostenibile ha selezionato Pianeta.Studio e Latte Creative in una gara aperta. Abbiamo proposto Nuxt 3 + Payload CMS invece di WordPress, migrato oltre 33.000 record da un archivio costruito in vent'anni, reso l'archivio interrogabile con AI. Consegna in 12 settimane, codice di proprietà del cliente. Questo è il percorso.

## La selezione

La Fondazione Sviluppo Sostenibile — più nota come Susdef — coordina il Forum Nazionale per lo Sviluppo Sostenibile, produce report e documenti di policy, è uno degli attori di riferimento per la transizione ecologica italiana. Quando ha deciso di riprogettare il sito e l'archivio documentale, ha aperto una selezione competitiva.

Abbiamo partecipato insieme a Latte Creative — co-produttori, non subfornitori anonimi — e abbiamo vinto.

Non è la prima volta che entriamo in selezioni aperte in questo settore e le portiamo a casa. Fondazioni, NGO, enti di ricerca ci scelgono in competizione perché il modo in cui ci presentiamo alle gare corrisponde al modo in cui poi lavoriamo. È utile dirlo esplicitamente: in un settore dove chi gestisce il sito può creare dipendenza, bloccare migrazioni future, rendere la tecnologia un fardello invece di uno strumento, la coerenza tra proposta e metodo è la prima forma di riduzione del rischio.

## Perché Nuxt e Payload, non WordPress

Il capitolato non prescriveva tecnologia. La risposta di default per un cliente con contenuti editoriali è WordPress: è il default di settore, la prima risposta di qualsiasi agenzia che non ha un motivo solido per proporre altro.

Avevamo un motivo solido.

L'archivio di Susdef conta **oltre 33.000 contenuti**, costruiti in più di vent'anni di produzione editoriale. Con WordPress, a quella scala, il problema non è oggi: è tra tre anni, quando la base di plugin è invecchiata, quando le performance degradano sotto carico, quando la migrazione verso qualcosa di più solido costerebbe il doppio di quello che sarebbe costato costruire bene adesso.

Abbiamo proposto **Nuxt 3 + Payload CMS + MeiliSearch**. Payload CMS è open source come framework — codice pubblico, community attiva, nessun vendor da cui dipendere per le licenze. Il codice applicativo che abbiamo costruito per Susdef è però proprietà di Susdef: lo possono portare da un altro fornitore domani, se lo decidono. Nessun lock-in verso di noi.

Nuxt 3 gestisce il frontend con performance native e tipizzazione forte. MeiliSearch gestisce la ricerca full-text sull'archivio con latenza sotto i 50ms anche su dataset di questa dimensione. WCAG 2.1 AA era un requisito del capitolato: lo abbiamo integrato nell'architettura dall'inizio, non retrofit.

La proposta tecnica è stata parte della selezione. Susdef ha scelto questa strada perché capisce la differenza tra uno stack che regge e uno che rimanda il problema.

## Vent'anni di archivio da migrare

L'archivio è il cuore del progetto, non un'appendice. I documenti di Susdef — report annuali, posizioni di policy, materiali del Forum — sono usati come riferimento da ministeri, centri di ricerca, fondazioni. Renderli trovabili in modo efficace è la trasformazione centrale.

Il numero grezzo: **oltre 33.000 record migrati** all'handover del 16 luglio 2026.

La migrazione di un archivio così non è un import da CSV. Ogni record porta metadati storici da pulire, relazioni tra contenuti da preservare, tag e categorizzazioni da normalizzare in uno schema coerente. La pipeline di migrazione è stata costruita come parte del progetto — non come attività postuma, non come approssimazione da rifinire in produzione.

La ricerca vettoriale integrata su MeiliSearch permette oggi di interrogare l'archivio per domande, non solo per parole chiave. Una query come "documenti sulla fiscalità delle rinnovabili prima del 2020" restituisce risultati pertinenti anche quando i testi non contengono esattamente quelle parole. È la differenza tra un archivio che si cerca e un archivio che si interroga.

## Dodici settimane

Dalla firma al go-live: **12 settimane**. Handover documentato. Formazione al team interno inclusa.

Questo dettaglio non è un vanto di efficienza operativa. È rilevante per chi sta valutando un fornitore per un progetto con vincoli di calendario reali — spesso contrattuali, nel caso di fondazioni con finanziamenti co-progettati. Rispettare una scadenza dichiarata, con tutto quello che comporta su migrazione, test, accessibilità e formazione, è una prova di metodo, non di velocità.

Lo stack scelto aiuta: niente black box, niente plugin critici di terze parti che si aggiornano in modo incontrollato, niente personalizzazioni che diventano debito tecnico al primo aggiornamento. L'hosting è europeo e GDPR-compliant per requisito, non per opzione.

## Cosa resta a Susdef

- **Il codice applicativo, per intero** — proprietà del cliente, consegnato con la documentazione tecnica dell'architettura. Possono portarlo da un altro fornitore senza che noi abbiamo leva.
- **Un team interno formato**, in grado di gestire contenuti, aggiornare categorie e caricare documenti in autonomia senza dipendere da noi per ogni modifica.
- **Uno stack che non invecchia per licenza** — Payload CMS e Nuxt sono framework open source con community attive. Non c'è un vendor che può cambiare i termini unilateralmente.
- **WCAG 2.1 AA e hosting GDPR-compliant** come caratteristiche strutturali, non come certificazioni da rinnovare.

Il sistema che abbiamo costruito non dipende da noi per funzionare. Dipende da noi se vogliono continuare a migliorarlo — ma quella è una scelta che Susdef può fare liberamente, con qualsiasi fornitore.

## FAQ

**Possiamo applicare lo stesso approccio a un archivio più piccolo?**
Sì. La pipeline di migrazione e l'architettura Nuxt + Payload scalano verso il basso. I principi — ricerca semantica, codice consegnato, nessun lock-in — restano gli stessi. Il costo si riduce proporzionalmente alla complessità.

**Lavorare con voi richiede di passare per Latte Creative?**
No. Susdef è una co-produzione con Latte Creative, che ha curato la direction creativa e la relazione con il cliente sul piano del design. Lavoriamo anche direttamente con fondazioni e centri di ricerca su mandati propri.

**Quanto tempo richiede la partecipazione a una selezione del genere?**
La nostra parte — proposta tecnica, preventivo, eventuali incontri di chiarimento — è tipicamente una settimana. I tempi della selezione dipendono dal cliente.

**Ci sono soglie di budget?**
Non pubblichiamo tariffe. La risposta onesta è che un progetto con migrazione di archivio di questa complessità richiede un investimento che vale la pena discutere prima di scrivere il capitolato, non dopo. Scriveteci prima.

## Vedi anche

→ Case study Susdef completo — in arrivo con il lancio del sito

## Parlane con noi

Se stai preparando una selezione per un progetto simile — sito editoriale, archivio documentale, CMS con requisiti di accessibilità e GDPR — scrivici prima di chiudere il capitolato.

**[max@pianeta.studio](mailto:max@pianeta.studio)**

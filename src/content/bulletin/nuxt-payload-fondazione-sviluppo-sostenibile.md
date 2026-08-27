---
title: "33.000 contenuti, zero plugin. Il nuovo sito della Fondazione per lo Sviluppo Sostenibile"
description: "Abbiamo sostituito un WordPress di anni con uno stack Nuxt 3 + Payload CMS + MeiliSearch, migrando oltre 33.000 record dell'archivio della Fondazione. Cosa significa farlo in dodici settimane, per chi deve scegliere un'agenzia per un progetto simile."
date: 2026-08-27
authors: ["max"]
tags: ["web", "cms", "no-profit", "metodo", "nuxt", "payload"]
readingTime: "6 min"
locale: it
draft: false
type: bulletin
relatedWork: []
category: "Metodo"
---

**TLDR.** Per la Fondazione per lo Sviluppo Sostenibile abbiamo progettato e sviluppato il nuovo sito istituzionale sostituendo un WordPress con uno stack Nuxt 3 + Payload CMS + MeiliSearch. **33.000+ contenuti migrati · 12 settimane · 0 plugin · live dal 16 luglio 2026.** Non è la prima volta che vinciamo una selezione competitiva in questo settore. Quello che segue è il racconto del percorso — e un elenco di domande da fare a qualsiasi agenzia tu stia valutando per un progetto simile.

## Non è un caso isolato

Non è la prima volta che veniamo scelti per un progetto di questo tipo. Negli ultimi anni abbiamo lavorato con ECLAG, con Agesci, e ora con la Fondazione per lo Sviluppo Sostenibile: organizzazioni che operano con capitolati esigenti, stakeholder interni eterogenei, e una sola opportunità di fare bene il lancio.

Il pattern ricorrente è questo: enti con un archivio digitale significativo, un team redazionale che deve essere autonomo, e una storia passata di dipendenza da un WordPress che nel tempo è diventato difficile da gestire. Non è un difetto di WordPress — è una conseguenza naturale di un sito che cresce senza una strategia tecnica ed editoriale unificata.

Il progetto Susdef è nato da una selezione competitiva e si è sviluppato in collaborazione con Latte Creative, che ha curato il rapporto diretto con la Fondazione e le fasi di visual design e identità grafica.

## Il sito come lo abbiamo trovato

Prima di proporre qualsiasi cosa, abbiamo misurato. Dati reali del sito WordPress della Fondazione al 17 marzo 2026:

- **190 KB** di solo HTML — pesante prima ancora di caricare contenuti
- **56 script JavaScript** — uno per uno, tutti bloccanti
- **27 file CSS** — fogli di stile in competizione tra loro
- **12 plugin attivi** — ogni plugin è un vettore di vulnerabilità e un aggiornamento da tenere sotto controllo
- WordPress **6.0.9** — versione datata, aggiornamenti critici mancanti
- **TTFB 302ms** — il server impiega quasi un terzo di secondo prima di iniziare a rispondere
- Caricamento percepito su mobile: **4–6 secondi**

Questi non sono numeri astratti. Significano che un ricercatore che cerca un documento del 2011 dall'archivio della Fondazione carica una pagina lenta su una ricerca che funziona male, con risultati inaffidabili.

La prima opzione che abbiamo valutato è stata "un WordPress nuovo, pulito, senza plugin inutili". L'abbiamo scartata. Il problema non era WordPress mal configurato: era WordPress come architettura per un ente con 33.000 contenuti e un team redazionale che deve aggiornare autonomamente. Un sistema dove ogni aggiornamento è un potenziale punto di rottura non è un sistema su cui costruire autonomia editoriale duratura.

## Perché Nuxt + Payload, e non qualcos'altro

La scelta di Nuxt 3 + Payload CMS risponde a tre priorità specifiche del progetto.

**Autonomia editoriale reale.** Payload CMS — framework open-source — offre live preview nativa: l'editor vede la pagina reale mentre scrive, non un'approssimazione. Il team della Fondazione può pubblicare, modificare e riorganizzare contenuti senza passare da noi, e senza il rischio di rompere la visualizzazione per gli utenti finali.

**Zero dipendenze da plugin.** Dodici plugin attivi significavano dodici vettori di vulnerabilità e dodici punti dove un aggiornamento poteva interrompere qualcosa. Con Nuxt + Payload tutta la logica applicativa è scritta nel codice del progetto: si aggiorna quando e se decidiamo di aggiornarla, non quando un plugin di terze parti rilascia una patch.

**Il codice appartiene alla Fondazione.** Non c'è licensing, non c'è lock-in verso di noi né verso nessun altro fornitore. Alla consegna del progetto abbiamo trasferito il repository completo: codice, configurazione, documentazione tecnica. Se la Fondazione decidesse di lavorare con un'altra agenzia tra cinque anni, parte con tutti gli asset in mano.

## 33.000 contenuti da rendere trovabili

La migrazione è stata la parte più densa del progetto.

Il vecchio WordPress della Fondazione conteneva anni di produzione editoriale: articoli, documenti scaricabili, pubblicazioni, atti di convegni, report. Questi contenuti esistevano, ma erano di fatto inaccessibili — sepolti in un'architettura di ricerca inadeguata, senza filtri, senza tassonomie coerenti.

**Il numero finale: oltre 33.000 record migrati** — tutti disponibili, filtrabili e ricercabili dalla prima ora dopo il lancio.

Per la ricerca abbiamo integrato **MeiliSearch**: un motore full-text open-source che indicizza in tempo reale tutti i contenuti e vive all'interno della stessa infrastruttura del sito. La ricerca è locale, privata, e restituisce risultati istantanei senza dipendenze esterne.

Le collezioni che abbiamo definito in Payload CMS — News, Downloads/Library, Eventi, Network, Pubblicazioni — corrispondono al modo in cui la Fondazione organizza concretamente il proprio lavoro. Non le abbiamo costruite su un template generico: le abbiamo modellate con il team nelle settimane di co-design prima dello sviluppo.

## Cosa rimane al cliente

Dodici settimane di sviluppo dall'addendum tecnico di aprile 2026. Lancio il 16 luglio 2026.

Quello che rimane alla Fondazione al termine del progetto:

- **Sito live** con accessibilità **WCAG 2.1 AA** — verificata a livello di componente e di pagina, non aggiunta come patch in fase di QA
- **CMS autonomo** — il team redazionale ha completato la formazione e gestisce in piena autonomia News, documenti, eventi e pubblicazioni
- **Hosting europeo** — VPS in Europa, backup automatici giornalieri, HTTPS forzato, header di sicurezza configurati. Conformità GDPR nativa
- **Analytics privacy-first** — Matomo self-hosted al posto di Google Analytics; i dati degli utenti restano sulla stessa infrastruttura del sito
- **Repository completo** — codice, configurazione, documentazione tecnica e screencast formativi per i redattori
- **Garanzia 30 giorni** post-lancio con SLA 4 ore lavorative per urgenze editoriali

## Le domande da fare a qualsiasi agenzia

Se stai valutando un'agenzia per un progetto simile — una fondazione, un ente di ricerca, un'organizzazione no-profit con un archivio digitale e un team redazionale da formare — queste sono le domande che vale la pena porre:

**Chi possiede il codice alla fine del progetto?** Se la risposta non è "voi", cambia fornitore.

**Come viene gestita l'accessibilità?** WCAG 2.1 AA come prerequisito di progettazione costa meno di WCAG come correzione finale. Chiedete il piano di test e quando viene eseguito nel processo.

**Come funziona la ricerca interna?** "La ricerca di WordPress" non è una risposta per un archivio da decine di migliaia di contenuti. Chiedete quale motore, come indicizza, come si aggiorna.

**Cosa succede se volete cambiare agenzia tra tre anni?** La risposta a questa domanda rivela il modello di business del vostro fornitore più di qualsiasi documento commerciale.

**Potete pubblicare autonomamente senza chiamare l'agenzia?** Se la risposta è "dipende" o "vi formiamo ma poi vi ricontattiamo per le cose complesse", state costruendo una dipendenza operativa che costerà ogni mese.

## Vedi anche

→ [Validare una campagna video prima di produrla — il caso ECLAG](/bulletin/validare-una-campagna-prima-di-produrla)

## Parlane con Alba

Se hai un progetto di sito istituzionale, archivio digitale o CMS per un ente no-profit, fondazione o organizzazione di ricerca, capiamo insieme se la nostra esperienza è utile per il tuo caso.

**[Parla con Alba →](/)**

---

*Progetto realizzato in collaborazione con Latte Creative · Stack: Nuxt 3 · Payload CMS (open-source) · MeiliSearch · VPS europeo · Matomo*

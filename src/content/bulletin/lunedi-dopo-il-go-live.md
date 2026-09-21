---
title: "Il lunedì dopo il go-live: come il vostro team pubblica da solo"
cover: "/og/placeholder-brand.png"
description: "La domanda che conta nella valutazione di un progetto CMS: dopo il go-live, il vostro team riesce a gestirlo da solo? Bozze, storico versioni, live preview, ruoli, backup notturno: gli strumenti che abbiamo costruito per non essere indispensabili."
date: 2026-09-21
draft: true
locale: it
tags: ["cms", "payload-cms", "redazione", "backup", "autonomia", "fondazione", "gestione-contenuti"]
type: bulletin
authors: ["max"]
readingTime: "6 min"
category: "Web sostenibile"
---

**TLDR.** Due ruoli (Admin e Member), bozze con storico versioni ripristinabile, anteprima dal vivo su mobile/tablet/desktop, backup automatico ogni notte alle 03:30 con ripristino dal pannello, dieci sezioni di guida dentro l'admin. Una fondazione senza IT interno può pubblicare, correggere errori e gestire la continuità operativa da sola — senza chiamarci per le operazioni quotidiane.

## La domanda che conta davvero

Nella trattativa per un progetto CMS, la domanda tecnica arriva presto: quale piattaforma, quali funzioni, come si migrano i dati. La domanda operativa arriva dopo, a volte troppo dopo: *e poi? riusciamo a tenerlo noi?*

Per un'organizzazione senza IT interno — una fondazione, un ente di ricerca, un'associazione con uno staff editoriale ma senza sviluppatori — questa è la domanda che conta. La risposta dipende dall'architettura e dagli strumenti scelti.

Il go-live è venerdì. Il lunedì mattina arriva la prima novità, il primo aggiornamento da pubblicare, il primo errore da correggere. Chi lo fa? Come? E se va storto, come si torna indietro?

## Bozza e pubblicato: il ciclo editoriale

Articoli, pagine, argomenti e progetti hanno uno stato: bozza o pubblicato. Il sito pubblico non vede mai una bozza.

Questo è il punto di partenza del lavoro quotidiano: si scrive in bozza, si rivede, si usa l'anteprima, si pubblica. Il contenuto diventa visibile fuori soltanto quando si preme Pubblica — non quando si salva. Chi ha bisogno di più tempo per rileggere, o di un secondo paio di occhi, lascia in bozza e condivide il link di anteprima.

Nessun contenuto a metà finisce per sbaglio sul sito.

## Lo storico versioni: l'errore che si corregge

Ogni modifica a un contenuto crea una nuova versione. Se si pubblica qualcosa e ci si accorge subito di un errore — un titolo sbagliato, un'immagine errata, un paragrafo mancante — si apre la scheda, si va nello storico e si ripristina la versione precedente. L'operazione avviene nel pannello, senza accesso al server.

La funzione è accessibile a chi gestisce i contenuti, direttamente dalla scheda del documento.

## Vedere prima di pubblicare

Ogni contenuto ha un'anteprima dal vivo: mobile (375 px), tablet (768 px), desktop (1440 px). Si apre dentro il pannello, mentre si sta ancora scrivendo o rivedendo. Si vede come apparirà esattamente sul sito — con il proprio testo, le proprie immagini, la propria struttura — prima che qualcuno lo legga fuori.

Utile per verificare che un titolo lungo non si spezzi male su telefono, o che un blocco di testo regga la lettura su schermo piccolo, senza dover pubblicare per scoprirlo.

## Due ruoli, zero ambiguità

Il sistema ha due ruoli:

- **Admin**: accesso completo — contenuti, backup, gestione utenti, funzioni di sistema.
- **Member**: può creare e modificare contenuti, non tocca le funzioni di sistema.

Un redattore entra come Member: scrive, salva, pubblica. Un responsabile di redazione o chi gestisce l'infrastruttura entra come Admin. Non serve decidere ogni volta chi ha accesso a cosa: i ruoli ci pensano loro.

Quando entra una persona nuova nel team editoriale, si crea un account Member. Punto.

## La notte lavora il backup

Ogni notte alle 03:30 il sistema fa un dump completo del database e sincronizza i media su un secondo storage offsite. La ritenzione segue uno schema GFS: 7 backup giornalieri, 4 settimanali, 3 mensili.

Funziona in autonomia, senza intervento manuale.

Dalla pagina `/admin/backup` si vede l'esito dell'ultimo backup, il log dell'esecuzione e c'è un bottone per lanciarne uno manuale on-demand — utile prima di una riorganizzazione importante dei contenuti, o prima di un import di dati storici.

Il ripristino funziona in modo non-distruttivo: il dump viene caricato su un database temporaneo, validato, e solo allora scambiato con quello attivo.

## La guida è dentro il pannello

Dieci sezioni raggiungibili direttamente dall'admin: dashboard, contenuti, pagine, impostazioni sito, backup, e altro. Scritte per chi usa il sistema ogni giorno senza background tecnico — e sempre aggiornate con il sistema, perché vivono dentro di esso.

Quando arriva una persona nuova nel team, la guida è già lì, dentro lo stesso strumento con cui lavorerà.

## Cosa resta da noi

Il lavoro editoriale quotidiano — pubblicare, correggere, aggiornare, organizzare contenuti — è completamente in mano al team della fondazione dal primo giorno.

Quello che richiede uno sviluppatore è il deploy di una nuova versione del sito: quando si aggiunge una funzione, si modifica la struttura di una pagina, si integra un nuovo servizio. È un'operazione rara e intenzionale, ben distinta dal lavoro editoriale ordinario.

Se qualcosa va storto in modi che il team non sa gestire, siamo raggiungibili. Ma la struttura è pensata perché la chiamata non sia necessaria per le operazioni quotidiane.

---

**[info@pianeta.studio](mailto:info@pianeta.studio)**

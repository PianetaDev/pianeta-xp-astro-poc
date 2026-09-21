---
title: "Se Pianeta domani sparisce, il tuo archivio continua a funzionare"
cover: "/og/placeholder-brand.png"
description: "Prima di firmare un progetto CMS o archivio documentale, la domanda giusta è: se il fornitore sparisce o cambia, cosa succede al sistema? Dipende da come è costruito. Qui spieghiamo come costruiamo noi — e perché la risposta è sì."
date: 2026-09-21
draft: true
locale: it
tags: ["cms", "archivio", "lock-in", "gdpr", "business-continuity", "payload-cms", "open-source", "terra"]
type: bulletin
authors: ["max"]
readingTime: "5 min"
category: "Web sostenibile"
---

**TLDR.** Prima di firmare un progetto CMS o archivio documentale, un referente IT dovrebbe porre una domanda sola: se il fornitore sparisce o decidiamo di cambiare, il sistema si ferma? La risposta dipende interamente da come è stato costruito. Con l'architettura che usiamo, la risposta è no — non per fiducia reciproca, ma per scelta tecnica e contrattuale.

## La domanda che dovresti fare prima della firma

C'è una domanda che spesso arriva tardi nel processo di valutazione, quando il contratto è quasi chiuso: *se cambiamo fornitore, o il fornitore chiude, cosa succede all'archivio?*

È la domanda giusta. Dovrebbe arrivare prima.

La risposta non è una questione di buona volontà del fornitore — è una questione di architettura. Un sistema costruito con dipendenze strutturali dal fornitore non diventa indipendente perché il fornitore promette disponibilità futura. Un sistema costruito senza lock-in funziona in autonomia dal primo giorno di consegna.

La distinzione non è sottile. È la differenza tra un archivio che sopravvive al cambio di fornitore e uno che si blocca.

## Il codice è tuo

Il codice applicativo che costruiamo — il sito, il CMS, le integrazioni, gli script di migrazione — viene consegnato integralmente al cliente alla fine del progetto. Non è un'opzione contrattuale aggiuntiva: è il modello di partenza.

Cosa significa in concreto: il repository è del cliente. Qualsiasi sviluppatore che conosce il framework può clonarlo, leggerlo, modificarlo, mandarlo in produzione. Non c'è codice sorgente che rimane da nostra parte, non c'è chiave di licenza che scade, non c'è funzionalità bloccata dietro un abbonamento a Pianeta.

Consegniamo con il codice un **HANDOFF.md** — documentazione tecnica che descrive l'architettura, le dipendenze, le procedure operative: deploy, backup, aggiornamenti. Non è un documento formale scritto per metterlo in un cassetto. È scritto per il prossimo sviluppatore che deve mettere le mani sul sistema senza nessuno di noi disponibile.

## I framework non hanno proprietari commerciali

Lo stack su cui costruiamo — **Payload CMS**, **MeiliSearch**, **Nuxt** — è open source nel senso tecnico corretto: licenza aperta, repository pubblici, comunità attiva, migliaia di sviluppatori che lo conoscono e lo mantengono. Nessuna licenza commerciale, nessun vendor che decide prezzi e roadmap in modo unilaterale.

Questo ha una conseguenza diretta per la business continuity: quando cerchi un nuovo sviluppatore che possa subentrare, stai cercando una competenza di mercato, non una competenza proprietaria. Non devi formare qualcuno su un sistema chiuso che esiste solo dentro la nostra agenzia. Non devi pagare un canone per continuare a usare il CMS. Non devi aspettare che un vendor decida di supportare la funzionalità che ti serve.

Il codice applicativo che consegniamo è proprietà del cliente — i framework su cui si basa sono aperti. Le due cose insieme fanno sì che l'archivio continui a funzionare indipendentemente da quello che succede a Pianeta.

## I dati sono su server che controlli tu

Il sistema gira su un VPS europeo — di proprietà del cliente, o gestito da un provider che il cliente sceglie. I dati non vivono su infrastruttura Pianeta, non transitano da server americani, non dipendono da un account SaaS che scade se non si rinnova l'abbonamento.

Per le fondazioni e gli enti pubblici che operano sotto GDPR, questo ha implicazioni concrete: il dato documentale rimane nella giurisdizione europea, è gestibile direttamente, e il suo ciclo di vita è completamente in mano al cliente. Il backup, la retention, l'accesso — tutto sotto il controllo dell'organizzazione, non del fornitore.

**Un perimetro da chiarire sul layer AI**: quando il progetto include funzionalità di intelligenza artificiale — ingestione automatica di documenti, abstract generati, ricerca semantica — questi layer si appoggiano ad API di provider esterni. Il dato che transita per questi moduli segue regole di governance diverse dal core del sistema. Su questo punto siamo espliciti in fase contrattuale: quale provider, quali dati transitano, quali garanzie DPA. Il core dell'archivio — CMS, ricerca full-text, frontend — rimane self-hosted; il layer AI add-on no.

## La business continuity non è una promessa, è un'architettura

Abbiamo migrato archivi documentali con decine di migliaia di record e consegnato ogni volta un sistema che l'organizzazione può far girare in completa autonomia — con un altro fornitore, con un team interno, o semplicemente senza bisogno di nessuno finché non cambia qualcosa.

Questo non nasce da una policy aziendale di generosità. Nasce dal fatto che costruire sistemi con lock-in verso noi stessi genera clienti dipendenti, non clienti soddisfatti. E un cliente che non può andarsene non è lo stesso di un cliente che sceglie di restare.

Se stai valutando un progetto CMS o archivio documentale e vuoi capire come funziona il modello di consegna — cosa viene trasferito, cosa no, come è strutturata la documentazione tecnica, cosa succederebbe se dovesse subentrare un altro fornitore — parliamone prima di scrivere il capitolato.

**[Parla con noi ↗](https://cal.com/maxmauro)**

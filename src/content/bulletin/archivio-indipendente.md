---
title: "Se Pianeta domani sparisce, il tuo archivio continua a funzionare"
cover: "/og/placeholder-brand.png"
description: "Prima di firmare un progetto CMS o archivio documentale, la domanda giusta è: se il fornitore sparisce o cambia, il sistema continua a funzionare? Con l'architettura che usiamo, la risposta è sì — per scelta tecnica e contrattuale."
date: 2026-09-21
draft: true
locale: it
tags: ["cms", "archivio", "lock-in", "gdpr", "business-continuity", "payload-cms", "open-source", "terra"]
type: bulletin
authors: ["max"]
readingTime: "5 min"
category: "Web sostenibile"
---

**TLDR.** Prima di firmare un progetto CMS o archivio documentale, un referente IT dovrebbe porre una domanda sola: se il fornitore sparisce o decidiamo di cambiare, il sistema continua a funzionare? Con l'architettura che usiamo, la risposta è sì — per scelta tecnica e contrattuale, a partire dal primo giorno di consegna.

## La domanda che dovresti fare prima della firma

C'è una domanda che spesso arriva tardi nel processo di valutazione, quando il contratto è quasi chiuso: *se cambiamo fornitore, o il fornitore chiude, cosa succede all'archivio?*

È la domanda giusta. Dovrebbe arrivare prima.

La risposta dipende dall'architettura del sistema, indipendentemente dalla disponibilità futura del fornitore. Un sistema costruito con dipendenze strutturali dal fornitore rimane dipendente anche quando il fornitore promette disponibilità futura. Un sistema costruito per essere consegnato funziona in autonomia dal primo giorno.

La distinzione è concreta e verificabile prima della firma.

## Il codice è tuo

Il codice applicativo che costruiamo — il sito, il CMS, le integrazioni, gli script di migrazione — viene consegnato integralmente al cliente alla fine del progetto. È il modello di partenza, incluso nel contratto.

Il repository è interamente del cliente. Qualsiasi sviluppatore che conosce il framework può clonarlo, leggerlo, modificarlo, mandarlo in produzione. Il codice sorgente viene trasferito in toto — il sistema gira senza chiavi di licenza legate a Pianeta e senza funzionalità dipendenti da un abbonamento con noi.

Con il codice consegniamo la documentazione tecnica di progetto: architettura, dipendenze, procedure operative (deploy, backup, aggiornamenti). Il modello che usiamo per questo trasferimento è pubblicato su [pianeta.green](https://pianeta.green). È documentazione pensata per il prossimo sviluppatore che deve lavorare sul sistema in autonomia.

## I framework sono aperti

Lo stack su cui costruiamo — **Payload CMS**, **MeiliSearch**, **Nuxt** — è open source nel senso tecnico corretto: licenza aperta, repository pubblici, comunità attiva, migliaia di sviluppatori che lo conoscono e lo mantengono.

Questo ha una conseguenza diretta per la business continuity: quando cerchi un nuovo sviluppatore che possa subentrare, stai cercando una competenza di mercato, disponibile e documentata pubblicamente. Il framework funziona con le stesse condizioni di licenza per chiunque usi lo stesso stack.

Il codice applicativo che consegniamo è proprietà del cliente — i framework su cui si basa sono aperti. Le due cose insieme fanno sì che l'archivio continui a funzionare indipendentemente da quello che succede a Pianeta.

## I dati sono su server europei

Il core del sistema — CMS, ricerca full-text, frontend — gira su server europei. I dati del tuo archivio documentale restano nell'infrastruttura europea, separata da quella di Pianeta.

Per le fondazioni e gli enti pubblici che operano sotto GDPR, questo ha implicazioni concrete: il dato documentale rimane nella giurisdizione europea e il suo ciclo di vita — backup, retention, accesso — è gestibile direttamente dall'organizzazione.

**Un perimetro da chiarire sul layer AI**: quando il progetto include funzionalità di intelligenza artificiale — ingestione automatica di documenti, abstract generati, ricerca semantica — questi layer si appoggiano ad API di provider esterni. Il dato che transita per questi moduli segue regole di governance diverse dal core del sistema. Su questo punto siamo espliciti in fase contrattuale: quale provider, quali dati transitano, quali garanzie DPA. Il core dell'archivio rimane self-hosted su server europei; il layer AI add-on usa API esterne.

## Business continuity: una questione di architettura

La scelta di consegnare il codice integralmente parte da una convinzione pratica: costruire sistemi con lock-in verso il fornitore genera dipendenza senza fidelizzazione autentica. La differenza tra un cliente trattenuto e uno che sceglie di restare è strutturale — e si vede nel progetto, prima ancora che nel rapporto.

Se stai valutando un progetto CMS o archivio documentale e vuoi capire come funziona il modello di consegna — cosa viene trasferito, come è strutturata la documentazione tecnica, come funzionerebbe un eventuale subentro — parliamone prima di scrivere il capitolato.

## Parlane con Alba

**[info@pianeta.studio](mailto:info@pianeta.studio)**

---
title: "Piattaforma documentale"
description: "Archivio documentale trovabile: CMS strutturato, ricerca full-text su scala, modulo AI per ingestione e ricerca semantica. Self-hosted EU, WCAG 2.1 AA, codice in licenza d'uso."
category: "technology"
processPhase: 3
icon: "🗂️"
cover: "/og/placeholder-1_1.png"
ogImage: "/og/placeholder-16_9.png"
order: 2
inputClient:
  - "Archivio documentale esistente (PDF, Word, pubblicazioni, atti)"
  - "Tassonomia e metadati correnti"
  - "Requisiti di accesso e governance (ruoli, embargo, GDPR)"
  - "Vincoli infrastrutturali e compliance"
deliverables:
  - "Piattaforma su Stack Terra (Nuxt + Payload CMS + MeiliSearch)"
  - "Archivio migrato e indicizzato"
  - "CMS backoffice gestibile in autonomia dal team"
  - "Ricerca full-text con ranking per rilevanza"
  - "Modulo DocumentAI opzionale (ingestione AI, abstract automatici, ricerca semantica)"
  - "Hosting EU gestito · GDPR · WCAG 2.1 AA"
  - "Codice in licenza d'uso al cliente · HANDOFF.md"
relatedServices: ["web-sostenibile", "piattaforme-dashboard"]
caseStudies: ["susdef"]
locale: it
draft: true
type: service
date: 2026-09-26
---

## Per chi è

Per fondazioni di ricerca, enti pubblici e consorzi scientifici europei con anni di produzione documentale che non riesce più a trovare se stessa. L'archivio esiste — report, pubblicazioni, atti, paper — ma è inaccessibile: al team interno, ai giornalisti, ai partner che chiedono quel paper specifico di tre anni fa.

Il sistema che costruiamo trasforma l'archivio statico in una superficie interrogabile e gestibile in autonomia. Il team comunicazione trova il documento giusto in secondi, non in mezz'ora di ricerca manuale nelle cartelle condivise.

## Come lavoriamo

Discovery documentale + mapping tassonomia → migrazione dell'archivio esistente → build della piattaforma → formazione del team redazionale. **12–20 settimane**, inclusa la migrazione.

Il core è **Stack Terra** (Nuxt 3 + Payload CMS + MeiliSearch): CMS strutturato con live preview, ricerca full-text ad alta precisione su decine di migliaia di record, server europei certificati. Per le organizzazioni che hanno bisogno di AI generativa sull'archivio — ingestione automatica di PDF, abstract generati, ricerca per significato invece che per parole esatte — aggiungiamo il **modulo DocumentAI** come estensione di Terra. Le API esterne usate dal modulo sono dichiarate per contratto con il relativo DPA.

**Fondazione per lo Sviluppo Sostenibile** — trent'anni di pubblicazioni, >33.000 record migrati, go-live 16 luglio 2026 in **12 settimane** di sviluppo tecnico. Il sistema gira in autonomia dal primo giorno. → [Leggi il case study](/work/susdef) · [Il percorso raccontato](/bulletin/percorso-susdef)

## Cosa ottiene il cliente

Un archivio documentale che funziona — trovabile dagli utenti interni, dai giornalisti, dai partner istituzionali. **WCAG 2.1 AA** verificato a livello di componente, requisito obbligatorio per fondi pubblici UE. Hosting su VPS europei con backup giornalieri, SSL/HSTS/CSP, monitoring attivo.

Il codice applicativo viene consegnato **in licenza d'uso al cliente** per l'uso nel proprio progetto — un altro fornitore può subentrare con il HANDOFF.md incluso, nessun lock-in tecnico verso Pianeta. La licenza non copre rivendita a terzi, sublicenza o uso come base di prodotti commerciali estranei al progetto.

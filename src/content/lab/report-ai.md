---
title: "Report AI — Documenti di ricerca con IA assistita"
description: "Workflow e tooling per produrre report di ricerca lunghi e verificabili: ingest documenti, sintesi multi-fonte, citazioni tracciate, human-in-the-loop su ogni passo."
kind: "Prodotto R&D"
year: 2026
status: "In sviluppo"
ogImage: "/og/handbook.png"
cover: "/og/handbook.png"
date: 2026-06-15
locale: it
draft: false
type: lab
tags: ["ai", "research", "documenti", "rag", "human-in-the-loop"]
---

## Cos'è Report AI

Report AI è il sistema con cui produciamo report di ricerca a lunga forma — analisi di mercato, white paper, audit di sostenibilità — senza che l'IA scriva al posto degli autori, e senza che gli autori scrivano da zero quello che l'IA può preparare meglio.

## Come funziona

1. **Ingest**: i documenti di partenza (PDF, transcript, web, dataset) vengono indicizzati con embedding ed estrazione strutturata.
2. **Outline assistito**: l'IA propone uno scheletro con sezioni e fonti per ognuna. L'autore approva, riordina, taglia.
3. **Draft sezione per sezione**: ogni paragrafo cita le fonti d'origine. L'autore vede da dove arriva ogni affermazione.
4. **Verifica**: una seconda passata controlla coerenza tra le sezioni, citazioni non supportate, contraddizioni interne.
5. **Export**: HTML interattivo + DOCX + PDF.

## Perché lo costruiamo noi

Gli strumenti commerciali nascondono cosa l'IA aggiunge "di suo" rispetto a cosa è documentato. Nei nostri progetti di sostenibilità, **una citazione non tracciata è un errore di compliance**. Report AI è progettato perché il revisore possa risalire a ogni affermazione in pochi click.

## Stato

Prima commessa pilota in corso (AGESCI 2026). Tool interno con accesso a partner R&D selezionati. Rilascio open di alcuni componenti chiave previsto per fine 2026.

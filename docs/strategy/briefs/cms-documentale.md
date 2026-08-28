---
status: brief — non ancora contenuto pubblicabile
compiled: 2026-08-27
fonte: 25P19_Epos + 26P06_Epos Platform + 25P15_Fondazione Sviluppo Sostenibile (Drive)
canale proposto: Lab (asset/prodotto proprietario, non lavoro-cliente singolo)
spoke: Pianeta.Studio (con possibile promozione a prodotto rivendibile — vedi nota strategica)
---

# Brief — CMS/piattaforma documentale AI (nato da EPOS-ERIC, riusato su Susdef)

> ## ⚠️ REGOLA DURA — non violare mai in contenuto pubblico
>
> **EPOS-ERIC è un cliente di Latte Creative. Pianeta.Studio ha lavorato come ghost/subfornitore tecnico — non si può dire "abbiamo lavorato per EPOS", non si può nominare EPOS-ERIC come cliente Pianeta, in nessun contenuto pubblico (case study, bulletin, social, sales deck rivolto all'esterno).** Confermato da Max (2026-08-27).
>
> Conseguenza pratica: **Susdef è l'unico caso nominabile pubblicamente.** EPOS resta materiale di contesto interno/strategico (utile per capire l'origine del prodotto, mai per essere citato). Se serve raccontare la genealogia del prodotto, si fa in astratto ("nato lavorando con un consorzio di ricerca europeo", senza nome) o si evita del tutto e si racconta il prodotto solo attraverso Susdef.

## Cosa sappiamo (fatti verificati dai materiali)

- **Origine**: il prodotto nasce dal progetto **EPOS-ERIC** (European Plate Observing System — consorzio di ricerca europeo, ERIC = European Research Infrastructure Consortium), vinto tramite gara pubblica **Call for Tender No. 2/2025**, contratto firmato **26 giugno 2025**. Cliente: EPOS ERIC — Communication & IT Team. **Latte Creative** è il contraente principale, Pianeta.Studio lavora come partner tecnico/AI (stesso schema di collaborazione visto su Agesci e ChildFund/WeWorld).
- **Stack tecnico** (da Progress Report EPOS #3, 25 maggio 2026):
  - Frontend: Nuxt (SSG, performance)
  - CMS: Payload — open source, live preview, no plugin
  - AI/Search: **Meilisearch + Mistral + RAG** — document discovery, OCR, Q&A in linguaggio naturale
  - Hosting: server europei, GDPR compliant
  - Accessibilità: WCAG 2.1 AA nativa
  - Analytics: Matomo (privacy-first, self-hosted)
- **Roadmap al 25 maggio 2026**: design completo, sviluppo in corso, go-live pianificato per la settimana del 7-13 luglio 2026 — **da verificare se già avvenuto** (oggi è il 27 agosto 2026, oltre un mese dopo la data target)
- **Riuso su Susdef**: la stessa architettura documentale (ingestione AI, abstract automatici, ricerca semantica) è stata riproposta per la Fondazione Sviluppo Sostenibile — Susdef è quindi la **seconda applicazione** dello stesso prodotto, non un progetto scollegato
- **Nota strategica interna** (dal materiale Susdef): il prodotto è esplicitamente pensato come **"AI documentale rivendibile"** — non un one-off per un cliente, ma un asset riutilizzabile per qualunque organizzazione (centri di ricerca, fondazioni, enti) con un grande archivio documentale sottoutilizzato

## Target della pagina di vendita del CMS (deciso 2026-08-27)

**Primario: comms/content manager** — è chi sente il dolore ogni giorno ("non troviamo più quel report") e spinge internamente per il cambio. La narrativa parla di trovabilità e autonomia del team, non di stack tecnico. **IT è target secondario**: bastano prove puntuali (codice consegnato in toto al cliente/nessun lock-in verso di noi, self-hosted, GDPR, WCAG) in una sezione dedicata per rassicurare chi valuta dopo, senza essere il filo conduttore della pagina.

> ⚠️ **Correzione (2026-08-27): il codice applicativo NON è open source.** È codice proprietario, consegnato integralmente al cliente (nessuna dipendenza esclusiva dal fornitore) — cosa diversa da "open source" in senso di licenza pubblica. Payload CMS (il framework sottostante) è sì open source, ma questo è un fatto sul tool, non sul lavoro fatto per il cliente. Non usare mai "open source" come proof point riferito al progetto — usare "codice consegnato in toto, nessun lock-in" o "proprietà del codice al cliente".

## Struttura a tre pezzi (stesso schema del triangolo ECLAG)

1. **Bulletin** — il percorso: gara vinta, perché Nuxt+Payload invece di WordPress, la sfida dei documenti da rendere interrogabili.
2. **Work** (`/work/susdef`) — case study. **Aggiornamento 2026-08-27: il sito è già live dal 16 luglio 2026** (vedi brief Susdef) — non serve più aspettare un lancio, può partire in parallelo al Bulletin.
3. **Landing/Service di vendita del CMS** — target comms manager, prova tecnica secondaria per IT. Collegata al case study Susdef come prova.

Si parte dal Bulletin (già assegnato a MUSE, PIA-1302).

**Rapporto contrattuale Susdef chiarito**: co-produzione con Latte Creative (nominabile, credito esplicito), non ghost — diverso da EPOS-ERIC. Vedi brief Susdef per il dettaglio.

## Angolo narrativo proposto (aggiornato dopo la regola ghost su EPOS)

Non si può più raccontare come "validato su due clienti" — pubblicamente esiste solo Susdef. L'angolo diventa: "abbiamo costruito un sistema che trasforma un archivio documentale morto in una superficie interrogabile con l'AI, mantenendo il controllo IP sui documenti originali", raccontato **attraverso Susdef come unico caso nominato**. È comunque il candidato più forte per la sezione **Lab** — l'asset proprietario più vicino ad Atlas/GreenMeter come framework riutilizzabile, nel dominio "AI + documenti scientifici" invece che ESG — ma la prova pubblica si regge su un solo cliente nominabile, non due.

## Cosa manca — da chiedere prima di scrivere il contenuto finale

**Materiali:**
- [ ] Conferma: EPOS-ERIC è già live? Su quale dominio pubblico?
- [ ] Screenshot del prodotto in azione (ricerca, risultato con abstract AI, pagina documento)
- [ ] Il video "Full (33 pagine)" e "Short (Interaction)" già presenti in `25P19_Epos/6_Screen video pages/` — utilizzabili come materiale visivo diretto?
- [ ] Numeri concreti: quanti documenti indicizzati su EPOS? Tempo di ricerca prima/dopo? Accuracy delle risposte AI?

**Quote:**
- [ ] Una quote dal team Comunicazione & IT di EPOS-ERIC (il progress report ha un contatto: Latte Creative, ma serve il referente EPOS diretto)
- [ ] Prospettiva di Max o Fabrizio sulla decisione di rendere il prodotto riutilizzabile invece che costruirlo ad hoc per ogni cliente

**Da chiarire con Max — punto delicato, non procedere senza risposta:**
- [x] ~~EPOS-ERIC nominabile pubblicamente?~~ **Risolto (2026-08-27): NO, mai.** Pianeta è ghost/subfornitore di Latte Creative su EPOS — vedi nota in cima al file.
- [ ] Il prodotto ha già un nome proprio (oltre "CMS documentale")? Non può chiamarsi "Epos" in pubblico visto quanto sopra — se diventa un asset Lab autonomo serve un nome che non richiami in nessun modo il cliente ghost.
- [ ] Verificare che nessun materiale visivo (screenshot, video) mostri loghi/branding EPOS-ERIC prima di usarlo per il case study — anche indirettamente in uno screenshot d'interfaccia.

---
status: brief — non ancora contenuto pubblicabile
compiled: 2026-08-27
fonte: 25P15_Fondazione Sviluppo Sostenibile (Drive) + 25P19_Epos (per il contesto tecnico condiviso)
canale proposto: Work (case study), quando il sito sarà live — nel frattempo eventualmente Lab per l'angolo prodotto
spoke: Pianeta.Studio
---

# Brief — Fondazione Sviluppo Sostenibile (Susdef)

## Rapporto contrattuale — chiarito 2026-08-27

Contratto **Latte Creative — Fondazione per lo Sviluppo Sostenibile** (firmato 8 settembre 2025). **Pianeta.Studio è co-produttore/partner tecnologico**, non ghost — stesso schema pubblico già usato per ChildFund Alliance World Index e Agesci ("Agenzia partner: Latte Creative"). **Si può nominare il progetto e Pianeta come autore**, con credito a Latte Creative come partner — diverso da EPOS-ERIC (quello sì ghost, mai nominabile, vedi `03_CMS-Documentale/00_brief/BRIEF.md`).

**Confermato da Max (22/09/2026): il progetto è stato vinto tramite gara.** Risolve il punto aperto della pre-review (PIA-1516, punto 6) — "vinta la gara" è un claim corretto, non un'invenzione.

## Cosa sappiamo (aggiornato con il documento di handover reale, 16 luglio 2026)

- **Cliente**: Fondazione per lo Sviluppo Sostenibile ("Susdef")
- **Cosa**: redesign completo del sito, migrazione da WordPress a Nuxt 3 + Payload CMS + MeiliSearch (ricerca full-text)
- **Volume migrato**: **>33.000 record** tra articoli, documenti e pubblicazioni (cifra ufficiale da handover — le stime precedenti di 3.381+2.019 erano da un'analisi tecnica preliminare, superate)
- **Stato reale: SITO GIÀ ONLINE dal 16 luglio 2026**, non più "in sviluppo" — ambiente di produzione live, handover finale (credenziali, codice sorgente) in corso a valle del saldo dell'ultima tranche contrattuale
- **Timeline**: contratto 8 set 2025, addendum tecnico (cambio stack WP→Nuxt+Payload) aprile 2026, 12 settimane di sviluppo, consegna 16 luglio 2026
- **Qualità**: WCAG 2.1 AA verificata a livello di componente e pagina, redirect 301 su tutti gli URL storici, SSL/HSTS/CSP, backup giornalieri, ambiente di training dedicato separato dalla produzione per formare il team redazionale senza rischi
- **Infrastruttura**: VPS gestito da Fabrizio Ciampini
- **Nota interna rilevante**: Susdef è definito come "proof-of-concept primario per prodotto AI documentale rivendibile" — collegamento diretto con il case CMS/Documentale (vedi cartella `03_CMS-Documentale`)
- **Contatti cliente**: Delia Milioni (Coordinatrice Comunicazione & Eventi), Davide Grossi (referente tecnico), Raimondo (direttore, approvazione finale)

**Il case study può quindi partire ORA** — il sito è live, non serve più aspettare un lancio futuro.

## Angolo narrativo proposto

Non "abbiamo fatto un sito" — il salto è da un archivio WordPress statico (3.381 articoli invisibili a chi cerca) a un sistema che rende interrogabile in linguaggio naturale una library documentale enorme, con AI che genera abstract e protegge la proprietà intellettuale dei paper. La storia è "abbiamo reso trovabile un patrimonio documentale che nessuno riusciva più ad attraversare", non "abbiamo cambiato CMS".

### Il concept di design — "la Fondazione come galassia" (Max, 22/09/2026, fonte primaria)

La vinta della gara nasce dalla volontà di mostrare la Fondazione come **una galassia**: i suoi settori e progetti sono parte di un cosmo che si muove nella stessa direzione ma su orbite diverse. Da qui l'idea di **abbandonare il sito classico a pagine** e costruire invece **un insieme di entità e relazioni** — non un albero di pagine statiche, ma un sistema di oggetti collegati (settori, progetti, persone, documenti) che si richiamano a vicenda.

**L'architettura dell'informazione è costruita attorno a tre obiettivi**, non attorno a un menu:
1. Spiegare cos'è la Fondazione
2. Far conoscere le novità
3. Esplorare i suoi documenti

**Struttura risultante**:
- Un **lato istituzionale** che porta in un'unica vista tutte le informazioni tra settori, progetti e membri
- Un **hub** che raccoglie tutti i materiali prodotti da questi settori
- La **parte documentale**, resa visibile ed esplorabile (non più un archivio nascosto)

**Design**: moderno, a card, coerente col design system Hederae (vedi pianeta.green come riferimento visivo/di componenti).

**Perché conta per il case study**: questo è un angolo più forte di "abbiamo migrato un CMS" — è "abbiamo ripensato come si rappresenta online un ente di ricerca complesso", con la migrazione tecnica (Payload/MeiliSearch/DocumentAI) come conseguenza, non come punto di partenza. L'angolo narrativo sopra ("reso trovabile un patrimonio") resta valido per il taglio Bulletin/persona A; questo concept è il taglio giusto per il case study `/work/susdef` e per la sezione "La prova" della pagina Terra.

## Cosa manca — da chiedere prima di scrivere il contenuto finale

**Materiali:**
- [x] ~~Stato attuale~~ Risolto: live dal 16 luglio 2026 (vedi sopra)
- [ ] URL esatto del dominio pubblico (l'handover dice "dominio ufficiale della Fondazione" senza specificarlo)
- [ ] Screenshot/foto del sito finito (homepage, ricerca MeiliSearch, pagina documento)
- [x] ~~Stack AI~~ Risolto: MeiliSearch per ricerca full-text (non Elasticsearch+RAG come nelle stime preliminari)
- [ ] Numeri di risultato reali dopo il lancio (tempo di ricerca prima/dopo, feedback utenti reali)

**Quote:**
- [ ] Una quote di Delia Milioni o Raimondo sul prima/dopo — hanno espresso soddisfazione o feedback specifico da qualche parte (email, call)?
- [ ] Una frase di Fabrizio (dev) sulla sfida tecnica più interessante (l'ingestione di migliaia di documenti + AI summary)

**Da chiarire con Max:**
- [ ] Il nome "Susdef" è un nickname interno — nel case study si usa il nome completo "Fondazione per lo Sviluppo Sostenibile" o serve conferma su come il cliente vuole essere citato?
- [ ] Serve autorizzazione esplicita del cliente prima di pubblicare (numero di documenti, dettagli tecnici) o è materiale che possiamo già trattare come pubblico?

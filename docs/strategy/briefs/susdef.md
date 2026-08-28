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

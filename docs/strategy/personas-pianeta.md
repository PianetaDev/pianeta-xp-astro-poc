---
status: prima emissione
compiled: 2026-09-10
author: COMPASS (PIA-1358)
fonte: docs/strategy/offer-stack-terra.md (sezione 2 — Persona multiple)
scope: brand-level — riusabile su tutte le offerte, non vincolato a Stack Terra
---

# Personas Pianeta — Libreria brand-level

> **⚠️ Vincolo ghost EPOS-ERIC — rispettare sempre**
>
> EPOS-ERIC è nominabile SOLO in documenti interni. Pianeta ha lavorato come ghost/subfornitore tecnico di Latte Creative su quel progetto. In nessun contenuto pubblico (case study, bulletin, landing, social, deck) si può citare EPOS come cliente. Il case nominabile pubblicamente è **solo Susdef**.
>
> Persona C (Marco, comm manager consorzio scientifico europeo) è informata dal contesto EPOS — è usata per orientare la strategia, non per produrre contenuto. Chi produce contenuto (MUSE) non deve mai usare EPOS come fonte citabile.

---

## Scopo di questo documento

Le persona di Stack Terra (`offer-stack-terra.md`, sezione 2) sono ancorate a persone e progetti reali verificati. Questo documento le promuove a **libreria di brand**: ogni persona non descrive solo chi compra un'offerta specifica, ma un **tipo ricorrente di interlocutore** che Pianeta incontra — e potenzialmente serve — su più offerte.

Struttura per ciascuna persona:
- Profilo (dolore, obiezione, cosa convince, canale primario) — estratto senza modifiche da `offer-stack-terra.md`
- **Dove si applica oggi**: in quali offerte/clienti il tipo è già verificato
- **Come si estende**: spazio strutturato da riempire quando emerge un nuovo cliente di quel tipo — non inventare prima che il tipo sia verificato

**Nota sul segmento NGO/terzo settore** (confermato da Max, 2026-08-28): non è un segmento prioritario per Stack Terra in questa fase. Persona D (NGO generica) era stata valutata e scartata. Non figura in questo documento finché non emerge un cliente reale che la valida.

---

## Persona A — Delia: Responsabile Comunicazione di una fondazione di ricerca

### Profilo (da offer-stack-terra.md)

**Contesto / organizzazione tipo**
Fondazione medio-piccola (staff 10-50), missione scientifica o ambientale, con 10-50 anni di produzione documentale. Archivio da migliaia di pubblicazioni su WordPress o un vecchio gestionale. Team comunicazione di 2-5 persone. Budget a progetto (fondi europei, donazioni istituzionali), non budget prodotto ricorrente.

**Dolore concreto**
"Il nostro archivio è enorme ma è un buco nero. Anche noi del team comunicazione non riusciamo a trovare il documento che cerchiamo. I giornalisti e i partner ci chiedono rapporti specifici e dobbiamo cercare manualmente nelle cartelle condivise per mezz'ora. I nostri stessi ricercatori non sanno cosa abbiamo già pubblicato."

**Obiezione principale**
"Abbiamo già un sito che funziona — migrare è un progetto lungo, con rischi alti. Chi forma il team redazionale dopo? E se poi il sistema è troppo complesso da gestire internamente? Non abbiamo un IT dedicato."

**Cosa la convince**
- Vedere Susdef (fondazione analoga per dimensioni e missione) che ha migrato >33.000 record in 12 settimane, con un ambiente di training dedicato, e adesso gestisce tutto in autonomia.
- Narrativa centrata sull'autonomia post-lancio: il team non dipende da Pianeta per aggiornare contenuti.
- Il before/after è in linguaggio suo: "Prima cercavamo a mano, adesso il sistema restituisce il documento giusto in 3 secondi."

**Canale primario**: Bulletin (storia del percorso, prima/dopo non tecnico) + case study Susdef come prova

---

### Dove si applica oggi

| Offerta | Cliente / progetto | Status nominabilità |
|---|---|---|
| Stack Terra — profilo Hub Editoriale | Susdef (Fondazione per lo Sviluppo Sostenibile) | ✅ Nominabile pubblicamente — unico caso |
| Stack Terra — profilo Hub Editoriale | Contesto EPOS-ERIC | ❌ Mai nominabile (vincolo ghost — vedi avviso in cima) |

**Nota ECLAG**: ECLAG (case study `/work/eclag`, 2026) è un'organizzazione advocacy europea e conferma che Pianeta lavora con organizzazioni mission-driven di questo tipo — ma il lavoro svolto è stato validazione di campagna video (offerta neuromarketing/swarm), non Stack Terra. Il pattern "comm manager di organizzazione con missione" è lo stesso; l'offerta è diversa. Non usare ECLAG come proof point per l'Hub Editoriale di Terra.

---

### Come si estende

Quando arriva un nuovo cliente di tipo fondazione/ente di ricerca:

1. Verificare se l'archivio documentale è il dolore principale → Terra Hub Editoriale
2. Verificare se il dolore è invece la validazione di comunicazione esterna → offerta neuromarketing/swarm
3. Aggiornare questa tabella con cliente + offerta + status nominabilità
4. Se il nuovo cliente è nominabile, aggiornare la sezione "Dove si applica oggi" di `offer-stack-terra.md` o dell'offerta pertinente

_Spazio da riempire quando si materializza il prossimo cliente di questo tipo._

---

## Persona B — Davide: Referente IT/Dev di una fondazione o ente pubblico

### Profilo (da offer-stack-terra.md)

**Contesto / organizzazione tipo**
1-2 persone IT che gestiscono l'infrastruttura (VPS o cloud), già esposti a soluzioni commerciali (Algolia, Elasticsearch, Azure Cognitive Search) ma bloccati da compliance GDPR, budget scalante o lock-in. Lavorano fianco a fianco con il team comunicazione ma decidono la stack e il fornitore.

**Dolore concreto**
"Mi propongono tool AI bellissimi ma i nostri documenti non possono andare su server americani. I nostri paper non ancora pubblicati non possono alimentare modelli di terzi. Ogni soluzione SaaS parte bene sul prezzo e poi costa il doppio l'anno dopo quando sei dipendente."

**Obiezione principale**
"Self-hosted significa che devo gestire io l'infrastruttura. Non ho personale per farlo. Se Pianeta sparisce domani, siamo bloccati."

**Cosa la convince**
- Codice consegnato in toto al cliente: nessuna dipendenza da Pianeta per far girare il sistema
- Server europei, GDPR, Matomo self-hosted (zero data fuori dalla giurisdizione — **vale per il core Terra; il modulo DocumentAI usa API esterne, vedi nota GDPR sotto**)
- WCAG 2.1 AA verificato a livello di componente — non un'affermazione, un fatto verificabile
- Infrastruttura gestita da Fabrizio Ciampini (VPS con backup giornalieri, SSL/HSTS/CSP) — l'opzione "gestione infrastructure inclusa" esiste
- Stack open source alla base (Payload, MeiliSearch, Nuxt) — nessun vendor lock-in a livello di tool

**Canale primario**: sezione tecnica del case study + scheda tecnica nella landing (non il Bulletin — non è il suo linguaggio)

> **Nota GDPR — layer AI** (confermato da Max, 2026-09-04): il core Terra (Nuxt+Payload+MeiliSearch) è self-hosted su server europei — zero data fuori dalla giurisdizione. Il modulo DocumentAI usa API esterne (provider terzo, da nominare per DPA). Documenti o estratti passano da quel provider. Non usare la claim "zero data fuori dalla giurisdizione" in modo onnicomprensivo in contenuti rivolti a Persona B quando si parla del modulo DocumentAI.

---

### Dove si applica oggi

| Offerta | Cliente / progetto | Status nominabilità |
|---|---|---|
| Stack Terra — profilo Hub Editoriale | Susdef | ✅ Nominabile — sezione tecnica del case study è la prova principale |
| Stack Terra — profilo Hub Editoriale | Contesto EPOS-ERIC | ❌ Mai nominabile |

Persona B non è ancora verificata su offerte diverse da Stack Terra. Tipo potenzialmente rilevante anche per altri progetti con infrastruttura self-hosted (es. futuri clienti con archivi sensibili), ma non c'è ancora un secondo caso reale.

---

### Come si estende

Quando arriva un nuovo cliente con referente IT che pone vincoli GDPR/infrastruttura:

1. Verificare se il vincolo riguarda l'archivio documentale → Terra Hub Editoriale (Persona B affianca Persona A)
2. Verificare se il vincolo riguarda altri layer (es. hosting di un sito vetrina, e-commerce) → offerta diversa, ma il tipo "IT cauteloso su compliance" è lo stesso
3. Aggiornare questa tabella
4. Se il caso è nominabile, aggiornare la sezione tecnica del case study rilevante

_Spazio da riempire quando si materializza il prossimo cliente di questo tipo._

---

## Persona C — Marco: Communication Manager di un consorzio scientifico europeo o ERIC

> **Nota interna obbligatoria**: questa persona è informata da un progetto reale verificato (contesto EPOS-ERIC). Il tipo è credibile e ancorato a un caso reale. Il cliente non è mai nominabile. Usare solo per orientare la strategia — mai citare EPOS come fonte in contenuti rivolti all'esterno o nei brief di MUSE.

### Profilo (da offer-stack-terra.md)

**Contesto / organizzazione tipo**
Consorzio finanziato con fondi pubblici UE, 10-40 partner europei, produzione documentale multi-lingua su 10-20 anni. Obblighi di open access e rendicontazione pubblica. Team comunicazione piccolo (3-6 persone) che coordina output da partner sparsi per l'Europa. Budget a grant cycle (tipicamente 3-5 anni), con renewal.

**Dolore concreto**
"Abbiamo documenti prodotti da 30 partner in 15 anni in 6 lingue. Nessun sistema unificato. Abbiamo obblighi di accessibilità pubblica (WCAG, multilingue) ma l'archivio è innavigabile anche per noi. Ogni grant review devo raccogliere manualmente i link ai deliverable — una settimana di lavoro."

**Obiezione principale**
"Privacy e governance dei dati sono condizioni non negoziabili. Un'agenzia italiana piccola può garantire questo livello di compliance a livello europeo? Come facciamo con i paper embargati che non devono essere accessibili prima della pubblicazione?"

**Cosa la convince**
- Server europei, GDPR, architettura che mantiene la governance dei dati interamente al cliente
- WCAG 2.1 AA — obbligatorio per fondi pubblici UE
- Possibilità di gestire embargo (Payload CMS permette controllo granulare accesso per documento)
- Case Susdef come prova che il sistema regge >33.000 record e funziona in produzione

**Canale primario**: landing/service page con sezione governance dati + case study Susdef come proof

---

### Dove si applica oggi

| Offerta | Cliente / progetto | Status nominabilità |
|---|---|---|
| Stack Terra — profilo Hub Editoriale | Contesto EPOS-ERIC | ❌ Mai nominabile — vincolo ghost permanente |

Persona C non ha ancora un caso pubblicamente nominabile. Il tipo è verificato internamente ma non esiste ancora un proof point esterno per questo segmento specifico (consorzio UE/ERIC). Susdef (Persona A) è il proxy pubblico più vicino per la landing.

---

### Come si estende

Quando arriva un nuovo cliente consorzio/ERIC:

1. Verificare status nominabilità prima di qualsiasi riferimento — il pattern ghost-subfornitore può ripetersi
2. Se nominabile: questo diventa il primo caso pubblico per Persona C — aggiornare questa tabella e creare/aggiornare la landing Hub Editoriale con il proof point
3. Se non nominabile: aggiornare solo la tabella interna (questo documento) con conferma che il tipo si ripete

_Spazio da riempire quando si materializza il prossimo cliente di questo tipo._

---

## Note di manutenzione

- **Fonte originale**: tutte le persona derivano da `docs/strategy/offer-stack-terra.md`, sezione 2. In caso di aggiornamento della strategia Terra, verificare se le persona cambiano e aggiornare anche questo documento.
- **Aggiungere nuove persona**: non creare una nuova persona finché non c'è almeno un cliente reale che la valida. Usare il campo "Come si estende" per tenere lo spazio strutturato in attesa.
- **Uso admin**: questo documento è la fonte per la pagina `/admin/brief` (già live, PR #104) — deve essere leggibile standalone, non solo come rimando a `offer-stack-terra.md`.
- **Revisione**: la prossima revisione va fatta quando si chiude un nuovo cliente fondazione/consorzio, o quando emerge un secondo segmento verificato (es. NGO con archivio documentale, se si materializza un cliente reale).

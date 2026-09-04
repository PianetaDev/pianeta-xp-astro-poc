---
status: aggiornato — DocumentAI integrato come modulo di Terra (PIA-1309, 2026-08-28)
compiled: 2026-08-27
revised: 2026-08-28
author: COMPASS (PIA-1303, PIA-1309)
fonti: BRIEF.md CMS-Documentale, BRIEF.md Susdef (incollati da Max nel thread PIA-1303); Piano R&D `09_relazione_sostenibilita/03_Piano_RD_e_Startup_Innovativa.md`
nota-pia-1309: DocumentAI non è un prodotto autonomo — è un modulo add-on di Terra. offer-documentai.md è deprecato, la strategia DocumentAI vive nella sezione 1.5 di questo documento.
---

# Strategia offerta — Stack Terra (CMS + ricerca documentale + modulo DocumentAI)

> **⚠️ Vincolo ghost EPOS-ERIC — rispettare sempre**
>
> EPOS-ERIC è nominabile SOLO in documenti interni. Pianeta ha lavorato come ghost/subfornitore tecnico di Latte Creative su quel progetto. In nessun contenuto pubblico (case study, bulletin, landing, social, deck) si può citare EPOS come cliente. Il case nominabile pubblicamente è **solo Susdef**.
>
> Questo documento è interno — le persona derivate dal contesto EPOS sono usate per informare la strategia, non per produrre contenuto. Chi produce contenuto (MUSE) non deve mai usare EPOS come fonte citabile.

> **Tono e registro per MUSE — vincolo confermato da Max (2026-08-28)**
>
> Scrivere con il registro di una **studio con R&D reale**: investimento misurabile, asset proprietari costruiti da commesse enterprise reali, logica di reinvestimento sistematico. Questo tono è corretto e verificabile nei fatti.
>
> **Non dichiarare mai la certificazione legale "Startup Innovativa" come già ottenuta.** La registrazione non è ancora conclusa (in attesa del commercialista). Se il tema emerge in un contenuto, usare: "percorso verso la registrazione come Startup Innovativa" — oppure lasciare parlare i fatti (budget R&D investito, asset costruiti, contratti quadro con collaboratori) senza nominare lo status legale. I fatti sono veri e verificabili indipendentemente dalla certificazione.

---

## 1. Definizione dell'offerta

### Cos'è

Una piattaforma CMS + ricerca documentale che trasforma un archivio statico (report, pubblicazioni, paper scientifici, atti) in una superficie interrogabile, navigabile e gestibile in autonomia dal team dell'organizzazione. Il sito è veloce, accessibile, e i documenti sono trovabili senza dover sapere esattamente dove sono salvati o come si chiama il file.

Stack verificato (da tre progetti reali): **Nuxt 3 (SSG) + Payload CMS + MeiliSearch**. Self-hosted su server europei, GDPR compliant, WCAG 2.1 AA. Il codice viene consegnato integralmente al cliente — nessun lock-in su Pianeta.Studio.

**MeiliSearch** fornisce ricerca full-text veloce e ordinata per rilevanza — non è generative AI, è un motore di ricerca ad alte prestazioni. Il layer AI generativo (ingestione AI, abstract automatici, ricerca semantica) è disponibile come **modulo DocumentAI**, add-on di Terra — vedi sezione 1.5.

### Cosa NON è

- **Non è un sito generico con un CMS**. Il differenziatore non è Payload da solo — è la combinazione di CMS strutturato (live preview, no plugin, TypeScript), ricerca full-text su scala (MeiliSearch), e infrastruttura consegnata al cliente. Chi ha bisogno solo di un sito vetrina è il target sbagliato.
- **Nel profilo base non include AI generativa**. Il core di Terra (Nuxt+Payload+MeiliSearch) non genera abstract né fa Q&A in linguaggio naturale. Queste funzionalità sono disponibili aggiungendo il modulo DocumentAI (vedi sezione 1.5) — è un add-on di Terra, non un prodotto separato con strategia di mercato autonoma.
- **Non è un servizio SaaS**. È una build custom, self-hosted, consegnata al cliente. Non c'è abbonamento mensile a Pianeta (salvo contratti di manutenzione separati).
- **Non è "open source"**. Il framework sottostante (Payload CMS) è open source, ma il codice applicativo è proprietario del cliente — formulazione corretta: "codice consegnato in toto, nessun lock-in".

### Contesto di prodotto e nome

**Il prodotto si chiama Terra** — già pubblico su https://pianeta.green (confermato da Max, 2026-08-28).

Terra è il layer CMS dell'ecosistema Pianeta.Studio (basato su Payload CMS). Il profilo "Hub Editoriale" di Terra — con MeiliSearch per la ricerca su grande scala — è il punto di ingresso per fondazioni, enti di ricerca e organizzazioni con archivi documentali importanti.

**Implicazione per i contenuti**: il prodotto ha già una pagina pubblica su https://pianeta.green. La comunicazione per il segmento "fondazioni/enti di ricerca" è un approfondimento del profilo Hub Editoriale. Il case study Susdef è la prova principale di questo profilo.

**Clienti verificati del profilo Hub Editoriale di Stack Terra**:
1. Consorzio scientifico europeo — **contesto interno, non nominabile mai** (vedi vincolo EPOS in cima); ha finanziato lo sviluppo iniziale dello stack
2. Fondazione per lo Sviluppo Sostenibile (Susdef) — **unico caso nominabile pubblicamente**, sito live dal 16 luglio 2026, >33.000 record migrati — URL: https://susdef.pianeta.green. **Susdef usa Terra con il modulo DocumentAI**: ingestione AI, abstract automatici, ricerca semantica sui documenti — è il caso verificato che dimostra il pacchetto completo Terra + DocumentAI in produzione.

**Nota (confermato da Max, 2026-08-28)**: Apotheke usa Terra ma in un profilo più semplice, non Hub Editoriale — non è un caso per questa offerta e non va usato come proof point qui.

Il prodotto è esplicitamente pensato come asset riutilizzabile, non un one-off. La co-produzione avviene con Latte Creative (nominabile) come partner principale su EPOS e Susdef.

---

### 1.5 Modulo DocumentAI — add-on di Terra

> **Correzione strategica (PIA-1309, 2026-08-28)**: DocumentAI non è un prodotto autonomo con target e strategia di mercato propri. Va venduto come modulo di Terra, non come offerta parallela. Il documento separato `offer-documentai.md` è deprecato.

**Cos'è il modulo DocumentAI**

Un add-on che si aggiunge al core di Terra per portare capacità AI generativa sull'archivio documentale:
- **Ingestione AI**: elaborazione automatica di PDF, Word, pubblicazioni — estrazione strutturata di metadati e contenuto
- **Abstract automatici**: sintesi generate per ogni documento senza intervento redazionale manuale
- **Ricerca semantica**: ricerca per significato, non solo per parole chiave esatte — il corpus diventa interrogabile in linguaggio naturale

**Caso verificato in produzione**: Susdef usa Terra + modulo DocumentAI. >33.000 record migrati, sito live dal 16 luglio 2026. Il Bulletin di percorso Susdef (PIA-1302) documenta questo caso.

**Stack tecnico reale**: Nuxt+Payload+MeiliSearch (stesso core di Terra) + layer AI integrato. Il Piano R&D citava "WordPress Multisite" per DocumentAI — questa descrizione non corrisponde allo stack reale di Susdef ed è probabilmente riferita a un'implementazione precedente o generica non vincolante. Il caso reale (Nuxt+Payload+MeiliSearch) prevale.

**Come si acquista**: come add-on nel pacchetto Terra — non ha prezzo, scheda o campagna propri indipendenti da Terra. Il modulo si menziona nel case study Susdef e nella landing Hub Editoriale come capacità opzionale del pacchetto.

**Cosa NON è (confini del modulo)**:
- Non è un prodotto standalone con target separato da Terra
- Non è un chatbot generale — è specifico sull'archivio documentale del cliente
- **Il core Terra (Nuxt+Payload+MeiliSearch) è self-hosted**: server europei, GDPR — dati non escono dalla giurisdizione del cliente. **Il layer AI generativo (modulo DocumentAI) usa API esterne** (provider non ancora nominato — confermato da Max, 2026-09-04): documenti o estratti passano da un provider terzo. Non usare la claim "zero data fuori dalla giurisdizione" per il modulo DocumentAI. Il provider specifico è da nominare se/quando serve per il DPA.

---

## 2. Persona multiple

> **Nota metodologica**: le persona A e B sono ancorate a persone reali dei progetti verificati (Delia Milioni e Davide Grossi su Susdef). La persona C è informata dal contesto EPOS (verificato internamente) ma anonimizzata — il tipo è reale, il cliente non è nominabile. Il segmento NGO/terzo settore è stato valutato e **escluso per ora** (2026-08-28, Max): non è un segmento prioritario per Stack Terra in questa fase.

---

### Persona A — Delia: Responsabile Comunicazione di una fondazione di ricerca

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

### Persona B — Davide: Referente IT/Dev di una fondazione o ente pubblico

**Contesto / organizzazione tipo**
1-2 persone IT che gestiscono l'infrastruttura (VPS o cloud), già esposti a soluzioni commerciali (Algolia, Elasticsearch, Azure Cognitive Search) ma bloccati da compliance GDPR, budget scalante o lock-in. Lavorano fianco a fianco con il team comunicazione ma decidono la stack e il fornitore.

**Dolore concreto**
"Mi propongono tool AI bellissimi ma i nostri documenti non possono andare su server americani. I nostri paper non ancora pubblicati non possono alimentare modelli di terzi. Ogni soluzione SaaS parte bene sul prezzo e poi costa il doppio l'anno dopo quando sei dipendente."

**Obiezione principale**
"Self-hosted significa che devo gestire io l'infrastruttura. Non ho personale per farlo. Se Pianeta sparisce domani, siamo bloccati."

**Cosa la convince**
- Codice consegnato in toto al cliente: nessuna dipendenza da Pianeta per far girare il sistema
- Server europei, GDPR, Matomo self-hosted (zero data fuori dalla giurisdizione)
- WCAG 2.1 AA verificato a livello di componente — non un'affermazione, un fatto verificabile
- Infrastruttura gestita da Fabrizio Ciampini (VPS con backup giornalieri, SSL/HSTS/CSP) — l'opzione "gestione infrastructure inclusa" esiste
- Stack open source alla base (Payload, MeiliSearch, Nuxt) — nessun vendor lock-in a livello di tool

**Canale primario**: sezione tecnica del case study + scheda tecnica nella landing (non il Bulletin — non è il suo linguaggio)

> **Nota GDPR — layer AI (confermato, 2026-09-04)**: il modulo DocumentAI usa API esterne (provider da nominare per eventuale DPA). L'argomento "zero data fuori dalla giurisdizione" vale per il core Terra, **non** per le funzionalità AI del modulo DocumentAI — documenti o estratti passano da un provider terzo. Non usare la claim GDPR onnicomprensiva in contenuti rivolti a Persona B senza questa qualifica.

---

### Persona C — Marco: Communication Manager di un consorzio scientifico europeo o ERIC

> **Nota interna**: questa persona è informata da un progetto reale verificato (contesto EPOS). Il tipo è credibile, il cliente non è nominabile. Usare solo per orientare la strategia — mai citare EPOS come fonte in contenuti rivolti all'esterno.

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

---

## 3. Mappa canale × persona

| Canale / formato | Persona A (Comm fondazione) | Persona B (IT fondazione) | Persona C (Comm consorzio UE) |
|---|---|---|---|
| **Bulletin "il percorso Susdef"** | ✅ Primario — storia before/after in linguaggio non tecnico | ❌ Non è il suo canale | ✅ Secondario — se racconta scala e governance |
| **Work/case study `/work/susdef`** | ✅ Primario — vede se stessa nella fondazione analoga | ✅ Cerca la sezione tecnica (stack, WCAG, volume) | ✅ Primario — cerca proof che funziona a scala |
| **Pagina Terra Hub Editoriale** (pianeta.green) | ✅ La narrativa principale è per lei | ✅ Solo la sezione tecnica di prova | ✅ Solo se tocca multi-partner/GDPR |
| **Sezione modulo DocumentAI** (dentro case study / landing Hub Editoriale) | ⬜ Solo se ha bisogno del layer AI generativo — Susdef è la prova | ✅ Capisce l'architettura del pacchetto completo | ⬜ Se il consorzio ha bisogno di Q&A sui deliverable |
| **Scheda catalogo servizi** | ✅ Scoperta — entry point verso case/landing | ❌ | ✅ Entry point |

**Logica della sequenza**: il Bulletin (già in lavorazione con MUSE, PIA-1302) genera awareness per Persona A. Il case study Susdef è la proof che converte Persona A e B. La landing vende a chi arriva già con intenzione. Il Lab serve a Persona B come approfondimento architetturale e a posizionare il prodotto come asset autonomo.

---

## 4. Elenco contenuti prioritari

> I contenuti [P0] sono già in corso o bloccati solo da prerequisiti chiari. I [P1]-[P3] nascono da questa mappa e diventano issue Paperclip per MUSE quando approvata da Max.

### [P0] Bulletin — "Il percorso Susdef: da archivio invisibile a library interrogabile con AI"
**Stato**: assegnato a MUSE, in_review (PIA-1302)
**Persona primaria**: A
**Angolo**: non "abbiamo cambiato CMS" — "abbiamo reso trovabile un patrimonio documentale che nessuno riusciva più ad attraversare"
**Vincolo**: non nominare mai EPOS-ERIC

---

### [P0] Work/case study — `/work/susdef`
**Stato**: può partire ora (sito live dal 16 luglio 2026)
**Persona primaria**: A + B
**Struttura**: intro narrativa per A (dolore, scelta, risultato) + sezione tecnica per B (stack, >33.000 record, WCAG 2.1 AA, timeline 12 settimane)
**Prerequisiti bloccanti** (non procedere senza):
- [x] URL pubblico del sito Susdef — **https://susdef.pianeta.green** (confermato da Max, 2026-08-28)
- [x] Autorizzazione del cliente a pubblicare numeri tecnici (>33.000 record, dettagli stack) — **confermato da Max (2026-08-28)**
- [ ] Screenshot del sito finito — disponibili su https://susdef.pianeta.green (Max ha confermato che si possono prendere da lì per la futura pubblicazione)
- [ ] Nome con cui il cliente vuole essere citato: "Fondazione per lo Sviluppo Sostenibile" o "Susdef"?

---

### [P1] Approfondimento Terra Hub Editoriale — segmento fondazioni/enti di ricerca
**Stato**: Terra esiste già su https://pianeta.green — serve contenuto specifico per il segmento archivi documentali
**Persona primaria**: A + C
**Struttura**: angolo "organizzazione con archivio documentale sottoutilizzato" → come Terra risolve la trovabilità → proof (case Susdef, numeri) → CTA
**Da decidere con Max**: vive dentro pianeta.green come sezione Hub Editoriale, o su pianeta.studio come landing separata? Impatta sulla struttura.
**Prerequisiti**: case study Susdef pubblicato (è la proof principale)
**Nota strategica**: questa pagina non deve esistere prima che il case study sia pubblicato — senza proof è solo una promessa.

---

### [P3] Scheda catalogo servizi
**Stato**: dipende dalla landing
**Persona**: A + C (entry point per chi naviga il catalogo)
**Formato**: ≤200 parole, link a case study e landing

---

## 5. Gap aperti

Prima di passare queste priorità a MUSE come issue, serve conferma su:

1. ~~**Nome del prodotto**: esiste già? È necessario per Lab e landing. Non può richiamare EPOS.~~ **Risolto (2026-08-28)**: il prodotto si chiama **Terra**, già pubblico su https://pianeta.green. L'offerta documentale AI è il profilo "Hub Editoriale" di Terra. Nessun nuovo naming necessario.
2. ~~**Autorizzazione Susdef**: i numeri tecnici (>33.000 record, dettagli stack, timeline) sono già trattabili come pubblici, o serve conferma scritta dal cliente?~~ **Risolto (2026-08-28)**: autorizzati da Max — numeri tecnici, stack e timeline trattabili come pubblici nel case study.
3. ~~**URL Susdef**: qual è il dominio pubblico del sito?~~ **Risolto (2026-08-28)**: https://susdef.pianeta.green — Max ha confermato che si possono prendere screenshot da qui per la futura pubblicazione.
4. **Screenshot/video**: la fonte primaria per gli screenshot è ora https://susdef.pianeta.green. I materiali in `25P19_Epos/6_Screen video pages/` — usabili per contesto interno, ma verificare che non mostrino branding ghost prima di qualsiasi uso pubblico.
5. ~~**Persona D (NGO)**: ci sono conversazioni o progetti reali con NGO che hanno valutato questo prodotto, o è un segmento da escludere finché non si materializza?~~ **Risolto (2026-08-28)**: segmento NGO **escluso** — nessun cliente NGO ha questo stack, non prioritario ora. Persona D rimossa dal documento.
6. **Quote**: Delia Milioni o Raimondo hanno espresso feedback specifico (email, call) usabile nel case study? — **In raccolta (Max, 2026-08-28)**: le chiede appena possibile. Il case study può partire senza quote e aggiungerle in seguito.
7. ~~**Apotheke nominabile?**~~ **Risolto (2026-08-28)**: Apotheke usa Terra ma in un profilo semplice, non Hub Editoriale — non rilevante per questa offerta.
8. ~~**DocumentAI: prodotto separato o modulo?**~~ **Risolto (2026-08-28, PIA-1309)**: DocumentAI è un **modulo add-on di Terra**, non un prodotto con strategia di mercato autonoma. Susdef è il caso verificato. Il documento separato `offer-documentai.md` è deprecato — vedi sezione 1.5 di questo documento.

---

### ~~Gap A — Layer AI del modulo DocumentAI: API esterne o self-hosted?~~ **Risolto (2026-09-04)**

**API esterne: confermato** (Max, 2026-09-04 — conferma ferma, non più "credo"). Provider specifico non ancora nominato — da richiedere in follow-up mirato se necessario per DPA/contratto.

**Implicazione GDPR per Persona B**: documenti o estratti passano da un provider terzo. La claim "zero data fuori dalla giurisdizione" vale per il core Terra, non per il modulo DocumentAI. Qualifica aggiornata in sezione 1.5 e nella nota Persona B.

---

### ~~Gap B — Capacità AI live su Susdef: quali funzionalità sono attive in produzione?~~ **Risolto (2026-09-04)**

**Tutto live e funzionante** su https://susdef.pianeta.green (Max, 2026-09-04): ingestione AI, abstract automatici e ricerca semantica sono tutte attive in produzione, nessuna limitazione. Il case study e la sezione 1.5 possono affermare il pacchetto completo senza riserve.

---

### ~~Gap C — Pricing modulo DocumentAI: come si struttura il costo?~~ **Risolto (2026-09-04)**

**Solo su preventivo**, caso per caso (Max, 2026-09-04). Nessun canone fisso pubblicato, nessuna tariffa a consumo standard. La landing e il case study non devono esporre un prezzo — CTA: "contattaci per un preventivo".

---

### ~~Gap D — Modulo DocumentAI: già menzionato su pianeta.green?~~ **Risolto (2026-09-04)**

**Non ancora descritto su pianeta.green** (Max, 2026-09-04) — nessun rischio di messaggio contraddittorio. Un task per scriverlo è probabile in arrivo come issue separata.

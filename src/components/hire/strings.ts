// Stringhe UI bilingui per la superficie hire (landing + dettaglio offerta + overlay).
export type Locale = 'it' | 'en';

export interface HireStrings {
  metaTitle: string; metaDesc: string;
  heroPre: string; heroEm: string; heroPost: string; heroSub: string; heroCta: string;
  offersTitle: string; offerMore: string;
  worksTitle: string; worksAll: string;
  clientsTitle: string; clientsNote: string;
  recentTitle: string;
  methodTitle: string; methodLead: string; method: { n: string; t: string; d: string }[];
  aboutMore: string;
  teamTitle: string; ccTop: string; ccCta: string; ccBot: string; why: [string, string, string, string];
  testiTitle: string; testiDraft: string;
  albaStrong: string; albaText: string; albaCta: string;
  booking: string; workAll: string;
  // overlay (lette anche dallo script inline via JSON)
  ovLoading: string; ovFail: string; ovWorkFull: string; ovArticleFull: string; ovLive: string;
  ovOfferFull: string; offerKicker: string; cosaOttieni: string; comeFunziona: string; faqTitle: string;
  casiTitle: string; caseLabel: string; articleLabel: string; checkoutErr: string; quoteFallback: string;
  // dettaglio offerta
  allOffers: string; clientsLabel: string; vatSuffix: string;
  recurMonth: string; recurOnce: string; quoteNote: string;
  payReassure: string; callAlt: string; quoteCallAlt: string; quoteReassure: string;
  // banda prova + agganci verticali (fondazioni, piattaforme)
  proofBand: string; fondTitle: string; fondText: string; fondCta: string; fondHref: string;
  platTitle: string; platText: string; platCta: string; platHref: string;
  riskLine: string;
  afterTitle: string; after: string[];
}

export const HIRE_STRINGS: Record<Locale, HireStrings> = {
  it: {
    metaTitle: 'Lavoriamo insieme — Pianeta.Studio',
    metaDesc: 'Una direzione creativa validata, prima di spendere il budget. Design, web e validazione con AI.',
    heroPre: 'Una direzione creativa ', heroEm: 'validata', heroPost: ' — prima di spendere il budget.',
    heroSub: 'Neuroscienza, AI e dati — con l’umano sempre nel loop — per validare la direzione di brand e organizzazioni che vogliono fare la cosa giusta, e farla funzionare. Scegli da dove iniziare.',
    heroCta: 'Scegli come iniziare ↓',
    offersTitle: 'Quattro modi per lavorare con noi', offerMore: 'Scopri di più →',
    worksTitle: 'I nostri lavori', worksAll: 'Vedi tutti →',
    clientsTitle: 'Hanno scelto Pianeta', clientsNote: 'Loghi in arrivo — per ora i nomi.',
    recentTitle: 'Lavori recenti',
    methodTitle: 'Come lavoriamo',
    methodLead: 'Design thinking + validazione con neuroscienza, AI e dati — l’umano sempre nel loop. Un metodo che riduce il rischio prima di spendere.',
    method: [
      { n: '01', t: 'Design thinking & co-design', d: 'Partiamo dal problema, insieme a te. Niente brief calati dall’alto: co-progettiamo la direzione.' },
      { n: '02', t: 'Validazione: neuroscienza, AI e dati', d: 'Neuroscienza, AI e dati validano le direzioni — con l’umano che decide — prima di spendere il budget di produzione.' },
      { n: '03', t: 'Design & build', d: 'Dalla direzione validata al prodotto: design system, web, contenuti. Carbon e performance budget come vincoli verificabili.' },
      { n: '04', t: 'Consegna e supporto', d: 'Ti consegniamo il sito vivo e ti seguiamo. Contenuti e dominio restano tuoi.' },
    ],
    aboutMore: 'Leggi di più →',
    teamTitle: 'Niente giri a vuoto',
    ccTop: 'Prenotati. Parliamo del tuo prossimo progetto.', ccCta: 'Lavoriamo insieme',
    ccBot: 'Nessuna idea è troppo folle — qui non si giudica.',
    why: [
      'Costruire il tuo brand o il tuo sito dovrebbe essere <strong>entusiasmante</strong> — e dovrebbe portare risultati.',
      'Coordinare più studi o navigare grandi agenzie distorce la tua visione e ti prosciuga il tempo — energia che è meglio spendere a far crescere il tuo lavoro. Lo capiamo.',
      'Lo <strong>studio giusto</strong>: non troppo grande, non troppo piccolo — la solidità di uno studio con la flessibilità di una boutique.',
      'Niente telefono senza fili. Niente energie sprecate. Solo bel lavoro e buone vibrazioni. Facciamo quadrare tutto.',
    ],
    testiTitle: 'Cosa dicono di noi', testiDraft: 'bozza · in attesa di citazione + foto reali',
    albaStrong: 'Hai dubbi?', albaText: ' Chiedi ad Alba — l\'AI di Pianeta ti aiuta a inquadrare il progetto, capire l\'offerta giusta, fissare una call.', albaCta: 'Parla con Alba',
    booking: '/lavoriamo-insieme', workAll: '/work',
    ovLoading: 'Carico…', ovFail: 'Contenuto non disponibile.',
    ovWorkFull: 'Apri la scheda completa →', ovArticleFull: 'Leggi l’articolo completo →', ovLive: 'Vedi il progetto live →',
    ovOfferFull: 'Pagina offerta completa →', offerKicker: 'Offerta', cosaOttieni: 'Cosa ottieni',
    comeFunziona: 'Come funziona', faqTitle: 'Domande frequenti',
    casiTitle: 'Casi e approfondimenti', caseLabel: 'Case study', articleLabel: 'Articolo',
    checkoutErr: 'Errore checkout, riprova.', quoteFallback: 'Richiedi un preventivo',
    allOffers: '← Tutte le offerte', clientsLabel: 'Hanno scelto Pianeta', vatSuffix: '+ IVA',
    recurMonth: 'al mese · disdici quando vuoi', recurOnce: 'una tantum', quoteNote: 'preventivo gratuito',
    payReassure: 'Pagamento sicuro con <strong>Stripe</strong>. IVA e P.IVA gestite al checkout.',
    callAlt: 'Preferisci parlarne? Prenota una call', quoteCallAlt: 'Preferisci una call diretta?',
    quoteReassure: 'Ti rispondiamo entro 2 giorni lavorativi con scope e preventivo.',
    proofBand: 'Scelti — e vinti in gara — da fondazioni ed enti',
    fondTitle: 'Fondazioni, ONG, enti, ricerca?',
    fondText: 'Partecipiamo e vinciamo gare e bandi con istituzioni mission-driven. Se hai una gara o un bando, ti aiutiamo a vincerlo.',
    fondCta: 'Il percorso per fondazioni ed enti →', fondHref: '/hire/fondazioni',
    platTitle: 'Dal processo alla piattaforma',
    platText: 'Cerchiamo aziende da innovare: selezioniamo processi B2B e B2C da trasformare in piattaforme, dati integrati e AI automation. Casi: Luxottica, Morsy, ArtPay.',
    platCta: 'Candida il tuo processo →', platHref: '/hire/piattaforme',
    riskLine: 'Performance e CO₂ misurate · contenuti e dominio tuoi · checkout sicuro con Stripe · nessun impegno per parlare con Alba',
    afterTitle: 'Cosa succede dopo l’acquisto',
    after: [
      'Ricevi subito la conferma via mail.',
      'Ti scriviamo entro 1 giorno lavorativo per il kickoff.',
      'Partiamo insieme — contenuti e dominio restano tuoi.',
    ],
  },
  en: {
    metaTitle: 'Work with us — Pianeta.Studio',
    metaDesc: 'A validated creative direction, before you spend the budget. Design, web and AI validation.',
    heroPre: 'A creative direction, ', heroEm: 'validated', heroPost: ' — before you spend the budget.',
    heroSub: 'Neuroscience, AI and data — always with a human in the loop — to validate the direction of brands and organizations that want to do the right thing, and make it work. Choose where to start.',
    heroCta: 'Choose where to start ↓',
    offersTitle: 'Four ways to work with us', offerMore: 'Learn more →',
    worksTitle: 'Our work', worksAll: 'See all →',
    clientsTitle: 'They chose Pianeta', clientsNote: 'Logos coming soon — names for now.',
    recentTitle: 'Recent work',
    methodTitle: 'How we work',
    methodLead: 'Design thinking + validation with neuroscience, AI and data — always with a human in the loop. A method that cuts risk before you spend.',
    method: [
      { n: '01', t: 'Design thinking & co-design', d: 'We start from the problem, together with you. No top-down briefs: we co-design the direction.' },
      { n: '02', t: 'Validation: neuroscience, AI & data', d: 'Neuroscience, AI and data validate the directions — with a human making the call — before spending the production budget.' },
      { n: '03', t: 'Design & build', d: 'From validated direction to product: design system, web, content. Carbon and performance budgets as verifiable constraints.' },
      { n: '04', t: 'Delivery & support', d: 'We hand over the live site and stay with you. Your content and domain stay yours.' },
    ],
    aboutMore: 'Read more →',
    teamTitle: 'No telephone games',
    ccTop: 'Book a slot. Let’s talk about your next project.', ccCta: 'Work with us',
    ccBot: 'No idea is too wild — no judgment here.',
    why: [
      'Building your brand or your site should be <strong>exciting</strong> — and it should deliver results.',
      'Coordinating multiple studios or navigating big agencies distorts your vision and drains your time — energy better spent growing your work. We get it.',
      'The <strong>right studio</strong>: not too big, not too small — the solidity of a studio with the flexibility of a boutique.',
      'No telephone games. No wasted energy. Just good work and good vibes. We make it all add up.',
    ],
    testiTitle: 'What they say about us', testiDraft: 'draft · awaiting real quote + photo',
    albaStrong: 'Got questions?', albaText: ' Ask Alba — Pianeta’s AI helps you frame the project, find the right offer, book a call.', albaCta: 'Talk to Alba',
    booking: '/en/lavoriamo-insieme', workAll: '/en/work',
    ovLoading: 'Loading…', ovFail: 'Content unavailable.',
    ovWorkFull: 'Open the full case →', ovArticleFull: 'Read the full article →', ovLive: 'See it live →',
    ovOfferFull: 'Full offer page →', offerKicker: 'Offer', cosaOttieni: 'What you get',
    comeFunziona: 'How it works', faqTitle: 'FAQ',
    casiTitle: 'Cases & insights', caseLabel: 'Case study', articleLabel: 'Article',
    checkoutErr: 'Checkout error, try again.', quoteFallback: 'Request a quote',
    allOffers: '← All offers', clientsLabel: 'They chose Pianeta', vatSuffix: '+ VAT',
    recurMonth: 'per month · cancel anytime', recurOnce: 'one-off', quoteNote: 'free quote',
    payReassure: 'Secure payment with <strong>Stripe</strong>. VAT and VAT-ID handled at checkout.',
    callAlt: 'Prefer to talk first? Book a call', quoteCallAlt: 'Prefer a direct call?',
    quoteReassure: 'We reply within 2 business days with scope and quote.',
    proofBand: 'Chosen — and won in tender — by foundations and institutions',
    fondTitle: 'Foundations, NGOs, institutions, research?',
    fondText: 'We take part in — and win — public tenders and grants with mission-driven institutions. Got a tender or a grant? We help you win it.',
    fondCta: 'The track for foundations & institutions →', fondHref: '/en/hire/fondazioni',
    platTitle: 'From process to platform',
    platText: 'Looking for companies to innovate: we select B2B and B2C processes to turn into platforms, integrated data and AI automation. Cases: Luxottica, Morsy, ArtPay.',
    platCta: 'Apply with your process →', platHref: '/en/hire/piattaforme',
    riskLine: 'Measured performance & CO₂ · your content and domain · secure Stripe checkout · no commitment to talk to Alba',
    afterTitle: 'What happens after you buy',
    after: [
      'You get an instant email confirmation.',
      'We reach out within 1 business day to kick off.',
      'We start together — your content and domain stay yours.',
    ],
  },
};

// --- Pagina verticale Fondazioni ---
export interface FoundStrings {
  metaTitle: string; metaDesc: string;
  eyebrow: string; h1: string; deck: string;
  winsTitle: string; stepsTitle: string; steps: { n: string; t: string; d: string }[];
  sendTitle: string; sendText: string; sendCta: string; sendHref: string;
  bandiTitle: string; bandiText: string; bandiCta: string; bandiHref: string;
  casesTitle: string; cases: { title: string; href: string }[];
  back: string; backHref: string;
}
export const FOUND_STRINGS: Record<Locale, FoundStrings> = {
  it: {
    metaTitle: 'Fondazioni & enti — Gare e bandi · Pianeta.Studio',
    metaDesc: 'Partecipiamo e vinciamo gare e bandi con fondazioni ed enti mission-driven. Inviaci la tua gara: ti aiutiamo a vincerla.',
    eyebrow: 'Fondazioni · Enti · Ricerca · ONG',
    h1: 'Gare e bandi: vi aiutiamo a vincere.',
    deck: 'Partecipiamo — e vinciamo — gare e bandi con fondazioni ed enti mission-driven. Portateci la vostra gara: la trasformiamo in un progetto che vince e si rendiconta senza sorprese.',
    winsTitle: 'Gare e progetti vinti',
    stepsTitle: 'Come lavoriamo con voi',
    steps: [
      { n: '01', t: 'Inviateci la gara o il bando', d: 'Leggiamo requisiti, criteri di valutazione e vincoli. Capiamo dove si vince e dove si perde punti.' },
      { n: '02', t: 'Progettiamo la proposta che vince', d: 'Design e sviluppo scritti nel linguaggio del bando, con KPI e milestone rendicontabili. Validati con neuroscienza, AI e dati — l’umano nel loop — prima di consegnare.' },
      { n: '03', t: 'Eseguiamo e rendicontiamo', d: 'Consegniamo i deliverable allineati ai requisiti. Con AB Innovation gestiamo la pratica burocratica: una sola filiera, due competenze.' },
    ],
    sendTitle: 'Hai già una gara?',
    sendText: 'Inviacela: la leggiamo e ti diciamo come la imposteremmo per vincerla. Nessun impegno.',
    sendCta: 'Inviaci la tua gara', sendHref: '/lavoriamo-insieme?offer=gara',
    bandiTitle: 'Non hai ancora un bando?',
    bandiText: 'Ti aiutiamo a vincere il bando nazionale o regionale per l’innovazione della tua organizzazione — dalla mappatura alla rendicontazione.',
    bandiCta: 'Scopri bandi & finanza agevolata →', bandiHref: '/bandi',
    casesTitle: 'Casi con istituzioni',
    cases: [
      { title: 'ECLAG — Choose to See Them', href: '/work/eclag' },
      { title: 'BC3 — Basque Centre for Climate Change', href: '/work/bc3-rebranding' },
      { title: 'ARIES — AI per ambiente e sostenibilità', href: '/work/aries-towards-smarter-sustainable-world' },
      { title: 'ChildFund World Index', href: '/work/childfund-world-index' },
    ],
    back: '← Lavoriamo insieme', backHref: '/hire',
  },
  en: {
    metaTitle: 'Foundations & institutions — Tenders & grants · Pianeta.Studio',
    metaDesc: 'We take part in and win tenders and grants with mission-driven foundations and institutions. Send us your tender: we help you win it.',
    eyebrow: 'Foundations · Institutions · Research · NGOs',
    h1: 'Tenders and grants: we help you win.',
    deck: 'We take part in — and win — tenders and grants with mission-driven foundations and institutions. Bring us your tender: we turn it into a project that wins and reports cleanly.',
    winsTitle: 'Tenders & projects won',
    stepsTitle: 'How we work with you',
    steps: [
      { n: '01', t: 'Send us the tender or grant', d: 'We read requirements, scoring criteria and constraints. We see where points are won and lost.' },
      { n: '02', t: 'We design the winning proposal', d: 'Design and development written in the tender’s language, with reportable KPIs and milestones. Validated with neuroscience, AI and data — human in the loop — before delivery.' },
      { n: '03', t: 'We deliver and report', d: 'We deliver outputs aligned to requirements. With AB Innovation we handle the paperwork: one chain, two competencies.' },
    ],
    sendTitle: 'Already have a tender?',
    sendText: 'Send it over: we read it and tell you how we’d set it up to win. No commitment.',
    sendCta: 'Send us your tender', sendHref: '/en/lavoriamo-insieme?offer=gara',
    bandiTitle: 'No grant yet?',
    bandiText: 'We help you win the national or regional innovation grant for your organization — from mapping to reporting.',
    bandiCta: 'Grants & subsidized finance →', bandiHref: '/en/bandi',
    casesTitle: 'Cases with institutions',
    cases: [
      { title: 'ECLAG — Choose to See Them', href: '/en/work/eclag' },
      { title: 'BC3 — Basque Centre for Climate Change', href: '/en/work/bc3-rebranding' },
      { title: 'ARIES — AI for environment & sustainability', href: '/en/work/aries-towards-smarter-sustainable-world' },
      { title: 'ChildFund World Index', href: '/en/work/childfund-world-index' },
    ],
    back: '← Work with us', backHref: '/en/hire',
  },
};

// --- Pagina verticale Terra (piattaforma documentale) ---
export interface TerraStrings {
  metaTitle: string; metaDesc: string;
  eyebrow: string; h1: string; deck: string;
  painsTitle: string; pains: { label: string; desc: string }[];
  unifiedTitle: string; unifiedBody: string;
  stackTitle: string; stack: { n: string; t: string; d: string }[];
  complianceTitle: string; compliance: { label: string; desc: string }[];
  complianceProof: string;
  proofTitle: string; proofStats: { n: string; d: string }[];
  proofText: string; proofCta: string; proofHref: string;
  greenNote: string;
  ctaTitle: string; ctaText: string; ctaCta: string;
  back: string; backHref: string;
}
export const TERRA_STRINGS: Record<Locale, TerraStrings> = {
  it: {
    metaTitle: 'Terra — Piattaforma documentale per fondazioni ed enti · Pianeta.Studio',
    metaDesc: 'CMS strutturato e ricerca full-text su scala per archivi documentali. 33.000+ documenti, 12 settimane di sviluppo tecnico, go-live 16 luglio 2026. Server EU, GDPR, codice in licenza d\'uso.',
    eyebrow: 'Piattaforma documentale · Fondazioni · Enti di ricerca · Consorzi',
    h1: 'Una piattaforma documentale per archivi che nessuno riesce più a trovare.',
    deck: 'Per fondazioni, enti di ricerca e consorzi con vent\'anni di documentazione — e un motore di ricerca che funziona solo se conosci già il titolo esatto. È un problema di architettura.',
    painsTitle: 'Il problema che conosci già',
    pains: [
      { label: 'Ricercano su Google', desc: 'Il team usa site: sul motore di ricerca per trovare i propri documenti — il CMS interno non restituisce risultati utili.' },
      { label: 'I partner rinunciano', desc: 'Chi accede dall\'esterno abbandona dopo il secondo tentativo. L\'archivio è innavigabile senza sapere dove guardare.' },
      { label: 'Grant review: una settimana sprecata', desc: 'Ogni revisione di progetto UE richiede raccogliere a mano i link ai deliverable — lavoro ripetitivo che non produce nulla di nuovo.' },
      { label: 'Cercano risposte, non file', desc: 'Il giornalista vuole il rapporto sulla fiscalità delle rinnovabili prima del 2020. Il sistema dovrebbe rispondere — adesso restituisce una lista di file.' },
    ],
    unifiedTitle: 'Tre cose in un sistema unico',
    unifiedBody: 'Un CMS per gestire i nuovi contenuti. Un motore di ricerca per trovare quelli vecchi. Un modulo che li capisce, legge cosa significano. Di solito sono tre prodotti di tre fornitori diversi, con tre contratti, tre logiche di prezzo e nessuno che risponde quando qualcosa non torna tra i tre. Terra li unisce: CMS strutturato, ricerca full-text su scala, un layer AI che legge davvero i documenti — e l\'hosting che li fa girare, tutto in un sistema unico.',
    stackTitle: 'Come funziona, in produzione',
    stack: [
      { n: '01', t: 'CMS strutturato', d: 'Payload CMS, TypeScript-first: bozza e pubblicato separati sempre, live preview su mobile/tablet/desktop, versioning su ogni modifica. Un errore si ripristina dal pannello, senza toccare il server. L\'interfaccia editoriale è costruita attorno ai flussi reali del team.' },
      { n: '02', t: 'Ricerca full-text su scala', d: 'MeiliSearch nel core: ricerca full-text veloce, ordinata per rilevanza, su decine di migliaia di documenti. Quando serve andare oltre la parola esatta — capire cosa un documento significa — c\'è il modulo DocumentAI.' },
      { n: '03', t: 'Modulo DocumentAI (add-on)', d: 'Ingestione automatica di PDF e pubblicazioni, abstract generati senza intervento redazionale, ricerca semantica in linguaggio naturale. In produzione con oltre 33.000 documenti migrati. Il layer AI usa API esterne — il provider è dichiarato per contratto, i dati del core Terra restano su server EU.' },
      { n: '04', t: 'Hosting EU gestito', d: 'Server europei, backup giornalieri, SSL/HSTS/CSP. L\'opzione managed include la gestione dell\'infrastruttura — il team del cliente non ha bisogno di un DevOps dedicato.' },
    ],
    complianceTitle: 'La domanda che ti fai davvero',
    compliance: [
      { label: 'Server EU · GDPR', desc: 'Il core Terra gira self-hosted su server europei — i dati restano nella tua giurisdizione. Il modulo DocumentAI usa API esterne per l\'elaborazione semantica: lo dichiariamo per contratto (DPA), con trasparenza, prima di partire.' },
      { label: 'Licenza d\'uso del codice', desc: 'Il codice applicativo viene consegnato in licenza d\'uso, con documentazione tecnica — un HANDOFF.md chiaro, senza dipendenza tecnica da noi. Payload CMS è un framework aperto: nessun lock-in verso il tool, nessuno verso di noi.' },
      { label: 'WCAG 2.1 AA', desc: 'Accessibilità integrata nell\'architettura dall\'inizio, verificata a livello di componente. Obbligatoria per fondi pubblici UE — trattata come criterio progettuale, con lo stesso peso della tipografia e della gerarchia visiva.' },
      { label: 'Auth a 3 livelli · embargo', desc: 'Controllo granulare per documento: accesso riservato, embargo, pubblicazione. Verificato su un consorzio di ricerca europeo (anonimizzato) con obblighi di open access e paper embargati.' },
    ],
    complianceProof: 'L\'abbiamo già consegnato su un consorzio di ricerca europeo: auth a 3 livelli con permessi granulari, backup automatici con ridondanza, privacy-by-design, hosting certificato ISO/IEC 27001 su energia rinnovabile, accessibilità WCAG 2.1 incorporata in ogni fase. È un framework che sappiamo già consegnare.',
    proofTitle: 'La prova',
    proofStats: [
      { n: '33.000+', d: 'documenti nell\'archivio' },
      { n: '12 sett.', d: 'di sviluppo tecnico' },
      { n: '16 lug 2026', d: 'go-live' },
    ],
    proofText: 'Una fondazione per lo sviluppo sostenibile ha migrato oltre 33.000 documenti — archivio di vent\'anni, prima navigabile solo da chi sapeva già cosa cercare — su Terra + DocumentAI. Team autonomo dal giorno del lancio.',
    proofCta: '',
    proofHref: '',
    greenNote: 'Stiamo costruendo la misurazione dei consumi — server e layer AI inclusi. Nessun fornitore di questo tipo di piattaforma pubblica dati di consumo energetico reale per singolo progetto: è la direzione in cui stiamo lavorando, non un rating che vendiamo oggi.',
    ctaTitle: 'Scrivi ad Alba.',
    ctaText: 'Raccontaci il tuo archivio — ti diciamo se Terra è la risposta giusta. Preventivo gratuito.',
    ctaCta: 'Parla con Alba',
    back: '← Lavoriamo insieme',
    backHref: '/hire',
  },
  en: {
    metaTitle: 'Terra — Documentary platform for foundations & institutions · Pianeta.Studio',
    metaDesc: 'Structured CMS and full-text search at scale for document archives. 33,000+ documents, 12 weeks of technical development, go-live 16 July 2026. EU server, GDPR, code under use licence.',
    eyebrow: 'Documentary platform · Foundations · Research institutions · Consortia',
    h1: 'A documentary platform for archives no one can find anymore.',
    deck: 'For foundations, research institutions and consortia with decades of documentation — and a search engine that only works if you already know the exact title. It is an architecture problem.',
    painsTitle: 'The problem you already know',
    pains: [
      { label: 'Searching on Google', desc: 'The team uses site: on Google to find their own documents — the internal CMS returns nothing useful.' },
      { label: 'Partners give up', desc: 'External users abandon after the second attempt. The archive is unnavigable without knowing where to look.' },
      { label: 'Grant review: a wasted week', desc: 'Every EU project review means manually collecting links to deliverables — repetitive work that produces nothing new.' },
      { label: 'They want answers, not files', desc: 'The journalist wants the renewables taxation report from before 2020. The system should answer — right now it returns a list of files.' },
    ],
    unifiedTitle: 'Three things in one system',
    unifiedBody: 'A CMS to manage new content. A search engine to find old content. A module that understands it, reads what it means. Usually these are three products from three different vendors, with three contracts, three pricing models and no one to call when something breaks between them. Terra unifies them: structured CMS, full-text search at scale, an AI layer that truly reads the documents — and the hosting that runs them, all in one system.',
    stackTitle: 'How it works, in production',
    stack: [
      { n: '01', t: 'Structured CMS', d: 'Payload CMS, TypeScript-first: draft and published states always separate, live preview on mobile/tablet/desktop, versioning on every change. A mistake is restored from the panel, without touching the server. The editorial interface is built around the team\'s real workflows.' },
      { n: '02', t: 'Full-text search at scale', d: 'MeiliSearch in the core: fast full-text search, ranked by relevance, across tens of thousands of documents. When you need to go beyond the exact word — understand what a document means — there is the DocumentAI module.' },
      { n: '03', t: 'DocumentAI module (add-on)', d: 'Automatic ingestion of PDFs and publications, abstracts generated without editorial intervention, semantic search in natural language. In production with over 33,000 documents migrated. The AI layer uses external APIs — the provider is declared by contract, core Terra data stays on EU servers.' },
      { n: '04', t: 'Managed EU hosting', d: 'European servers, daily backups, SSL/HSTS/CSP. The managed option includes infrastructure management — the client team does not need a dedicated DevOps.' },
    ],
    complianceTitle: 'The question you are really asking',
    compliance: [
      { label: 'EU server · GDPR', desc: 'Core Terra runs self-hosted on European servers — data stays within your jurisdiction. The DocumentAI module uses external APIs for semantic processing: we declare this by contract (DPA), transparently, before starting.' },
      { label: 'Code under use licence', desc: 'The application code is delivered under a use licence, with technical documentation — a clear HANDOFF.md, no technical dependency on us. Payload CMS is an open framework: no lock-in to the tool, none to us.' },
      { label: 'WCAG 2.1 AA', desc: 'Accessibility integrated into the architecture from the start, verified at component level. Mandatory for EU public funding — treated as a design criterion, with the same weight as typography and visual hierarchy.' },
      { label: '3-level auth · embargo', desc: 'Granular control per document: restricted access, embargo, publication. Verified on a European research consortium (anonymised) with open access obligations and embargoed papers.' },
    ],
    complianceProof: 'We have already delivered it on a European research consortium: 3-level auth with granular permissions, automatic backups with redundancy, privacy-by-design, ISO/IEC 27001-certified hosting on renewable energy, WCAG 2.1 built into every phase. It is a framework we already know how to deliver.',
    proofTitle: 'The proof',
    proofStats: [
      { n: '33,000+', d: 'documents in the archive' },
      { n: '12 wks', d: 'of technical development' },
      { n: '16 Jul 2026', d: 'go-live' },
    ],
    proofText: 'A sustainable development foundation migrated over 33,000 documents — a twenty-year archive, previously navigable only by those who already knew what to look for — onto Terra + DocumentAI. Team autonomous from launch day.',
    proofCta: '',
    proofHref: '',
    greenNote: 'We are building consumption measurement — server and AI layer included. No provider of this type of platform publishes real energy consumption data per client project: that is the direction we are working towards, not a rating we sell today.',
    ctaTitle: 'Write to Alba.',
    ctaText: 'Tell us about your archive — we will tell you whether Terra is the right answer. Free quote.',
    ctaCta: 'Talk to Alba',
    back: '← Work with us',
    backHref: '/en/hire',
  },
};

// --- Pagina verticale Piattaforme ---
export interface PlatStrings {
  metaTitle: string; metaDesc: string;
  eyebrow: string; h1: string; deck: string;
  methodTitle: string; method: { n: string; t: string; d: string }[];
  casesTitle: string; cases: { name: string; what: string }[];
  dogfood: string;
  ctaTitle: string; ctaText: string; ctaCta: string; ctaHref: string;
  back: string; backHref: string;
}
export const PLAT_STRINGS: Record<Locale, PlatStrings> = {
  it: {
    metaTitle: 'Dal processo alla piattaforma: dati integrati e AI automation — Pianeta.Studio',
    metaDesc: 'Cerchiamo aziende da innovare: selezioniamo processi B2B e B2C da trasformare in piattaforme. Candida il tuo processo.',
    eyebrow: 'Piattaforme informative e AI automation',
    h1: 'Dal processo alla piattaforma: dati integrati e AI automation',
    deck: 'Cerchiamo aziende da innovare. Selezioniamo un numero limitato di processi B2B e B2C da trasformare in piattaforme: dati integrati e AI automation che elimina il lavoro ripetitivo. Se il tuo processo oggi vive tra fogli, email e passaggi manuali, è un buon candidato.',
    methodTitle: 'Il metodo',
    method: [
      { n: '01', t: 'Ricerca', d: 'Capiamo il processo reale: attori, obiettivi, punti di attrito.' },
      { n: '02', t: 'Mappatura dati', d: 'Individuiamo quali dati esistono, dove vivono e come si connettono.' },
      { n: '03', t: 'Task analysis', d: 'Analizziamo i compiti chiave, i colli di bottiglia e cosa si può automatizzare.' },
      { n: '04', t: 'Flussi e AI automation', d: 'Costruiamo la piattaforma: flussi integrati e automazioni AI.' },
    ],
    casesTitle: 'Casi',
    cases: [
      { name: 'Luxottica', what: 'User Journey per l’e-learning' },
      { name: 'Morsy', what: 'Esperienze d’acquisto su misura' },
      { name: 'ArtPay', what: 'Flussi di pagamento integrati' },
    ],
    dogfood: 'Lo facciamo su noi stessi: la macchina di acquisizione /hire e Segnale, la nostra piattaforma di delivery.',
    ctaTitle: 'Candida il tuo processo',
    ctaText: 'Ci racconti come funziona oggi. Ti diciamo — senza impegno — se è un buon candidato, cosa si può integrare e cosa automatizzare.',
    ctaCta: 'Candida il tuo processo', ctaHref: '/lavoriamo-insieme?offer=progetto',
    back: '← Tutte le offerte', backHref: '/hire',
  },
  en: {
    metaTitle: 'From process to platform: integrated data and AI automation — Pianeta.Studio',
    metaDesc: 'Looking for companies to innovate: we select B2B and B2C processes to turn into platforms. Apply with your process.',
    eyebrow: 'Information platforms & AI automation',
    h1: 'From process to platform: integrated data and AI automation',
    deck: 'Looking for companies to innovate. We select a limited number of B2B and B2C processes to turn into platforms: integrated data and AI automation that removes repetitive work. If your process lives across spreadsheets, emails and manual steps, it’s a good candidate.',
    methodTitle: 'The method',
    method: [
      { n: '01', t: 'Research', d: 'We understand the real process: actors, goals, friction points.' },
      { n: '02', t: 'Data mapping', d: 'We identify which data exists, where it lives and how it connects.' },
      { n: '03', t: 'Task analysis', d: 'We analyse the key tasks, the bottlenecks and what can be automated.' },
      { n: '04', t: 'Flows & AI automation', d: 'We build the platform: integrated flows and AI automations.' },
    ],
    casesTitle: 'Cases',
    cases: [
      { name: 'Luxottica', what: 'User journey for e-learning' },
      { name: 'Morsy', what: 'Tailored shopping experiences' },
      { name: 'ArtPay', what: 'Integrated payment flows' },
    ],
    dogfood: 'We do it on ourselves: the /hire acquisition machine and Segnale, our delivery platform.',
    ctaTitle: 'Apply with your process',
    ctaText: 'Tell us how it works today. We’ll tell you — no commitment — whether it’s a good candidate, what can be integrated and what can be automated.',
    ctaCta: 'Apply with your process', ctaHref: '/en/lavoriamo-insieme?offer=progetto',
    back: '← All offers', backHref: '/en/hire',
  },
};

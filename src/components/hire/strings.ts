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
  heroCta: string;
  proofStats: { n: string; d: string }[];
  symptomsTitle: string; symptoms: string[]; symptomsClosure: string;
  stackTitle: string; stack: { n: string; t: string; d: string }[]; stackSuffix: string;
  faqTitle: string; faq: { q: string; aText?: string; aList?: string[] }[];
  proofTitle: string; proofText: string; proofCta: string; proofHref: string;
  ctaTitle: string; ctaText: string; ctaCta: string;
  back: string; backHref: string;
}
export const TERRA_STRINGS: Record<Locale, TerraStrings> = {
  it: {
    metaTitle: 'Terra — Piattaforma documentale per fondazioni ed enti · Pianeta.Studio',
    metaDesc: 'CMS strutturato e ricerca full-text su scala per archivi documentali. 33.000+ documenti, 12 settimane di sviluppo tecnico, go-live 16 luglio 2026. Server EU, GDPR, codice in licenza d\'uso.',
    eyebrow: 'Piattaforma documentale · Fondazioni · Enti di ricerca · Consorzi',
    h1: 'Una piattaforma documentale per archivi che nessuno riesce più a trovare.',
    deck: 'Per fondazioni ed enti di ricerca con vent\'anni di documentazione che cercano i propri materiali su Google.',
    heroCta: 'Parla con Alba',
    proofStats: [
      { n: '33.000+', d: 'documenti' },
      { n: '12 sett.', d: 'di sviluppo tecnico' },
      { n: '16 lug 2026', d: 'go-live' },
    ],
    symptomsTitle: 'Il problema che conosci già',
    symptoms: [
      'Il team cerca i propri documenti su Google — site: sul motore di ricerca.',
      'I partner esterni rinunciano dopo il secondo tentativo.',
      'Ogni grant review: raccogliere a mano i link ai deliverable, una settimana di lavoro ripetitivo.',
      'Il sistema restituisce file. Il giornalista vuole risposte.',
    ],
    symptomsClosure: 'È un problema di architettura.',
    stackTitle: 'Tre cose in un sistema unico',
    stack: [
      { n: 'CMS', t: 'CMS strutturato', d: 'Payload CMS, TypeScript-first. Bozza e pubblicato separati, live preview, versioning su ogni modifica. Un errore si ripristina dal pannello.' },
      { n: 'Ricerca', t: 'Ricerca full-text', d: 'MeiliSearch nel core: ricerca veloce, ordinata per rilevanza, su decine di migliaia di documenti.' },
      { n: 'AI', t: 'DocumentAI (add-on)', d: 'Ingestione automatica di PDF, abstract generati, ricerca semantica in linguaggio naturale. In produzione su 33.000+ documenti. Il provider AI è dichiarato per contratto.' },
    ],
    stackSuffix: 'Un solo fornitore, hosting EU incluso — CMS, ricerca e AI nello stesso sistema, con un unico referente.',
    faqTitle: 'Domande',
    faq: [
      {
        q: 'Un\'agenzia piccola regge la compliance UE?',
        aList: [
          'Server EU certificati ISO 27001 su energia rinnovabile',
          'Backup automatici con ridondanza geografica',
          'Auth a 3 livelli con permessi granulari per documento',
          'Privacy-by-design integrata nell\'architettura',
          'WCAG 2.1 AA verificata su ogni componente',
        ],
      },
      {
        q: 'E se smettiamo di lavorare con voi?',
        aText: 'Il codice viene consegnato in licenza d\'uso con un HANDOFF.md chiaro. Payload CMS è un framework aperto. Nessuna dipendenza tecnica da noi per far girare la piattaforma.',
      },
      {
        q: 'I dati dove stanno?',
        aText: 'Il core Terra gira su server EU. Il modulo DocumentAI usa API esterne per l\'elaborazione semantica — il provider è dichiarato per contratto (DPA) prima di partire.',
      },
      {
        q: 'Consumi energetici?',
        aText: 'Li stiamo misurando — server e layer AI inclusi. Nessun competitor pubblica dati di consumo reale per singolo progetto. È la direzione in cui stiamo lavorando.',
      },
    ],
    proofTitle: 'La prova',
    proofText: 'La Fondazione per lo Sviluppo Sostenibile ha migrato oltre 33.000 documenti — vent\'anni di archivio — su Terra + DocumentAI. Go-live il 16 luglio 2026, dopo 12 settimane di sviluppo tecnico.',
    proofCta: 'Leggi il case study →',
    proofHref: '/work/susdef',
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
    deck: 'For foundations and research institutions with decades of documentation that search their own materials on Google.',
    heroCta: 'Talk to Alba',
    proofStats: [
      { n: '33,000+', d: 'documents' },
      { n: '12 wks', d: 'of technical development' },
      { n: '16 Jul 2026', d: 'go-live' },
    ],
    symptomsTitle: 'The problem you already know',
    symptoms: [
      'The team searches their own documents on Google — site: on the search engine.',
      'External partners give up after the second attempt.',
      'Every grant review: collecting deliverable links by hand, a week of work that produces nothing.',
      'The system returns files. The journalist wants answers.',
    ],
    symptomsClosure: 'It is an architecture problem.',
    stackTitle: 'Three things in one system',
    stack: [
      { n: 'CMS', t: 'Structured CMS', d: 'Payload CMS, TypeScript-first. Draft and published states always separate, live preview, versioning on every change. A mistake is restored from the panel.' },
      { n: 'Search', t: 'Full-text search', d: 'MeiliSearch in the core: fast search, ranked by relevance, across tens of thousands of documents.' },
      { n: 'AI', t: 'DocumentAI (add-on)', d: 'Automatic PDF ingestion, generated abstracts, semantic search in natural language. In production on 33,000+ migrated documents. The AI provider is declared by contract.' },
    ],
    stackSuffix: 'One vendor, EU hosting included — CMS, search and AI in the same system, with a single point of contact.',
    faqTitle: 'Questions',
    faq: [
      {
        q: 'Can a small agency handle EU compliance?',
        aList: [
          'ISO 27001-certified EU servers on renewable energy',
          'Automatic backups with geographic redundancy',
          '3-level auth with granular per-document permissions',
          'Privacy-by-design built into the architecture',
          'WCAG 2.1 AA verified at component level',
        ],
      },
      {
        q: 'What if we stop working with you?',
        aText: 'The code is delivered under a use licence with a clear HANDOFF.md. Payload CMS is an open framework. No technical dependency on us to run the platform.',
      },
      {
        q: 'Where does the data live?',
        aText: 'Core Terra runs on EU servers. The DocumentAI module uses external APIs for semantic processing — the provider is declared by contract (DPA) before starting.',
      },
      {
        q: 'Energy consumption?',
        aText: 'We are measuring it — server and AI layer included. No competitor publishes real consumption data per client project. That is the direction we are working towards.',
      },
    ],
    proofTitle: 'The proof',
    proofText: 'The Fondazione per lo Sviluppo Sostenibile migrated over 33,000 documents — a twenty-year archive — onto Terra + DocumentAI. Go-live on 16 July 2026, after 12 weeks of technical development.',
    proofCta: 'Read the case study →',
    proofHref: '/en/work/susdef',
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

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
}

export const HIRE_STRINGS: Record<Locale, HireStrings> = {
  it: {
    metaTitle: 'Lavoriamo insieme — Pianeta.Studio',
    metaDesc: 'Una direzione creativa validata, prima di spendere il budget. Design, web e validazione con AI.',
    heroPre: 'Una direzione creativa ', heroEm: 'validata', heroPost: ' — prima di spendere il budget.',
    heroSub: 'Design, web e validazione con AI per brand e organizzazioni che vogliono fare la cosa giusta, e farla funzionare. Scegli da dove iniziare.',
    heroCta: 'Scegli come iniziare ↓',
    offersTitle: 'Quattro modi per lavorare con noi', offerMore: 'Scopri di più →',
    worksTitle: 'I nostri lavori', worksAll: 'Vedi tutti →',
    clientsTitle: 'Hanno scelto Pianeta', clientsNote: 'Loghi in arrivo — per ora i nomi.',
    recentTitle: 'Lavori recenti',
    methodTitle: 'Come lavoriamo',
    methodLead: 'Metodologie di design thinking, validate con l’AI. Un metodo che riduce il rischio prima di spendere.',
    method: [
      { n: '01', t: 'Design thinking & co-design', d: 'Partiamo dal problema, insieme a te. Niente brief calati dall’alto: co-progettiamo la direzione.' },
      { n: '02', t: 'AI validation', d: 'Validiamo le idee con il nostro swarm AI + neuromarketing — prima di spendere il budget di produzione.' },
      { n: '03', t: 'Design & build', d: 'Dalla direzione validata al prodotto: design system, web, contenuti. Carbon e performance budget come vincoli verificabili.' },
      { n: '04', t: 'Consegna, senza lock-in', d: 'Codice e contenuti consegnati, standard aperti. Quello che costruiamo è tuo.' },
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
    comeFunziona: 'Come funziona, giorno per giorno', faqTitle: 'Domande frequenti',
    casiTitle: 'Casi e approfondimenti', caseLabel: 'Case study', articleLabel: 'Articolo',
    checkoutErr: 'Errore checkout, riprova.', quoteFallback: 'Richiedi un preventivo',
    allOffers: '← Tutte le offerte', clientsLabel: 'Hanno scelto Pianeta', vatSuffix: '+ IVA',
    recurMonth: 'al mese · disdici quando vuoi', recurOnce: 'una tantum', quoteNote: 'preventivo gratuito',
    payReassure: 'Pagamento sicuro con <strong>Stripe</strong>. IVA e P.IVA gestite al checkout.',
    callAlt: 'Preferisci parlarne? Prenota una call', quoteCallAlt: 'Preferisci una call diretta?',
    quoteReassure: 'Ti rispondiamo entro 2 giorni lavorativi con scope e preventivo.',
  },
  en: {
    metaTitle: 'Work with us — Pianeta.Studio',
    metaDesc: 'A validated creative direction, before you spend the budget. Design, web and AI validation.',
    heroPre: 'A creative direction, ', heroEm: 'validated', heroPost: ' — before you spend the budget.',
    heroSub: 'Design, web and AI validation for brands and organizations that want to do the right thing, and make it work. Choose where to start.',
    heroCta: 'Choose where to start ↓',
    offersTitle: 'Four ways to work with us', offerMore: 'Learn more →',
    worksTitle: 'Our work', worksAll: 'See all →',
    clientsTitle: 'They chose Pianeta', clientsNote: 'Logos coming soon — names for now.',
    recentTitle: 'Recent work',
    methodTitle: 'How we work',
    methodLead: 'Design thinking methods, validated with AI. A method that cuts risk before you spend.',
    method: [
      { n: '01', t: 'Design thinking & co-design', d: 'We start from the problem, together with you. No top-down briefs: we co-design the direction.' },
      { n: '02', t: 'AI validation', d: 'We validate ideas with our AI swarm + neuromarketing — before spending the production budget.' },
      { n: '03', t: 'Design & build', d: 'From validated direction to product: design system, web, content. Carbon and performance budgets as verifiable constraints.' },
      { n: '04', t: 'Delivery, no lock-in', d: 'Code and content handed over, open standards. What we build is yours.' },
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
    comeFunziona: 'How it works, day by day', faqTitle: 'FAQ',
    casiTitle: 'Cases & insights', caseLabel: 'Case study', articleLabel: 'Article',
    checkoutErr: 'Checkout error, try again.', quoteFallback: 'Request a quote',
    allOffers: '← All offers', clientsLabel: 'They chose Pianeta', vatSuffix: '+ VAT',
    recurMonth: 'per month · cancel anytime', recurOnce: 'one-off', quoteNote: 'free quote',
    payReassure: 'Secure payment with <strong>Stripe</strong>. VAT and VAT-ID handled at checkout.',
    callAlt: 'Prefer to talk first? Book a call', quoteCallAlt: 'Prefer a direct call?',
    quoteReassure: 'We reply within 2 business days with scope and quote.',
  },
};

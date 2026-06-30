// Offerte evergreen — superficie hire del sito. Config-as-data.
// `related`: case study + articoli del sito collegati (principio: sempre prove + contenuti).
// Href relativi → ClientRouter li gestisce come transizioni SPA native.

const SITE = '';

export interface Related { title: string; href: string; kind: 'case' | 'article' }
export interface MethodDay { n: number; title: string; body: string }
export interface Faq { q: string; a: string }

export interface Offer {
  slug: string;
  name: string;
  price: string;
  forWho: string;
  tagline: string;
  detail: string;
  deliverables: string[];
  bullets: string[];
  accent: 'green' | 'orange' | 'dark' | 'blue';
  emoji: string;
  // offerte self-serve hanno `stripe`; quelle a preventivo hanno `quote` (CTA → form, no checkout).
  stripe?: { mode: 'payment' | 'subscription'; amount: number; recurring?: 'month'; label: string };
  quote?: { label: string };
  related: Related[];
  method?: MethodDay[];   // es. i 4 giorni dello Sprint
  faqs?: Faq[];
  stats?: { k: string; v: string }[];   // prova di performance/green (numeri reali misurati)
  statsNote?: string;
}

const OFFERS_IT: Offer[] = [
  {
    slug: 'sito-green',
    name: 'Sito Green',
    price: 'da 2.000€ + IVA',
    forWho: 'Per brand e PMI green che vogliono una presenza online seria e a basso impatto.',
    tagline: 'Un sito sostenibile e veloce, sul nostro design system, con la CO₂ misurata.',
    detail:
      'Costruiamo il tuo sito su misura — sostenibile, veloce, sul nostro design system Hederae. Misuriamo la CO₂ di ogni pagina con GreenMeter e la teniamo bassa per design. Veloce e mobile-first, con performance e impatto verificabili. Contenuti e dominio restano tuoi.',
    deliverables: [
      'Sito responsive sul design system Hederae',
      'Report CO₂ per pagina (GreenMeter)',
      'Performance e carbon budget verificabili',
      'Contenuti e dominio sempre tuoi',
    ],
    bullets: ['Design system Hederae', 'CO₂ misurata (GreenMeter)', 'Veloce e mobile-first'],
    accent: 'green',
    emoji: '🌱',
    stripe: { mode: 'payment', amount: 200000, label: 'Acquista — 2.000€ + IVA' },
    related: [
      { title: 'BC3 — Rebranding', href: `${SITE}/work/bc3-rebranding`, kind: 'case' },
      { title: 'ARIES — AI per ambiente e sostenibilità', href: `${SITE}/work/aries-towards-smarter-sustainable-world`, kind: 'case' },
    ],
    stats: [
      { k: 'Lighthouse', v: '94–95/100' },
      { k: 'LCP', v: '~2,0s' },
      { k: 'Peso pagina', v: '0,7–1,4 MB' },
      { k: 'CO₂ / visita', v: '~0,1–0,2 g' },
    ],
    statsNote: 'Numeri reali, misurati su siti nostri e dei clienti (es. cornertable.agency, pianeta.studio). Media web: ~2,3 MB e ~0,36 g CO₂. CO₂ stimata con metodo Green Web Foundation (Sustainable Web Design), via GreenMeter.',
  },
  {
    slug: 'pianeta-sprint',
    name: 'Pianeta Sprint',
    price: '4 giorni · 3.500€ + IVA',
    forWho: 'Per chi sta per investire su una campagna, un sito o un rebrand e non vuole sbagliare il primo passo.',
    tagline: 'Da un’idea confusa a una direzione validata, in 4 giorni.',
    detail:
      'Quattro giorni per trasformare un’idea confusa in una direzione validata e pronta da produrre. Lavoriamo in co-design, validiamo con neuroscienza, AI e dati — con l’umano sempre nel loop — e consegniamo una direzione che regge, prima che tu spenda il budget di produzione.',
    deliverables: [
      'Direzione creativa / di messaggio validata',
      'Il razionale della validazione (neuroscienza, AI e dati)',
      'Gli asset chiave decisi nello sprint',
      'Una roadmap dei passi successivi',
    ],
    bullets: ['4 giorni time-boxed', 'Neuroscienza, AI e dati', 'Deliverable + roadmap'],
    accent: 'orange',
    emoji: '⚡',
    stripe: { mode: 'payment', amount: 350000, label: 'Prenota lo Sprint — 3.500€ + IVA' },
    related: [
      { title: 'ECLAG — Choose to See Them', href: `${SITE}/work/eclag`, kind: 'case' },
      { title: 'Validare una campagna prima di produrla', href: `${SITE}/bulletin/validare-una-campagna-prima-di-produrla`, kind: 'article' },
      { title: 'Lab Neuromarketing', href: `${SITE}/bulletin/lab-neuromarketing`, kind: 'article' },
    ],
    method: [
      { n: 1, title: 'Immersione', body: 'Obiettivi, audience, audit di quello che hai già. Mezza giornata con te, il resto lo lavoriamo noi.' },
      { n: 2, title: 'Direzione', body: 'Concept e messaggi chiave. Una o più direzioni creative, non una sola scommessa.' },
      { n: 3, title: 'Validazione', body: 'Neuroscienza, AI e dati stress-testano le direzioni con un panel sintetico — con l’umano che decide. Vediamo cosa convince e cosa genera resistenza, prima di produrre.' },
      { n: 4, title: 'Consegna', body: 'Direzione finale validata + asset chiave + roadmap, in un meeting di consegna.' },
    ],
    faqs: [
      { q: 'Tecnologie proprietarie o tool rivenduti?', a: 'Il motore di validazione (neuroscienza, AI e dati) è nostro, sviluppato internamente, con l’umano sempre nel loop. Non rivendiamo un tool di terzi: è il metodo con cui lavoriamo.' },
      { q: 'Cosa consegnate, di preciso?', a: 'Una direzione creativa/di messaggio validata e pronta da produrre, il razionale della validazione, gli asset chiave decisi nello Sprint e una roadmap dei passi successivi.' },
      { q: 'Per chi è lo Sprint?', a: 'Per chi sta per investire su una campagna, un sito o un rebrand e vuole partire sul piede giusto — non sprecare mesi e budget su una direzione sbagliata.' },
      { q: 'E dopo lo Sprint?', a: 'Puoi produrre con noi (o con chi vuoi: la direzione è tua) oppure passare al Team as a Service per un rapporto continuativo.' },
    ],
  },
  {
    slug: 'team-as-a-service',
    name: 'Team as a Service',
    price: '4.000€/mese + IVA',
    forWho: 'Per chi ha bisogno di un team dedicato in modo continuativo.',
    tagline: 'Un team dedicato, ogni mese. Meeting settimanale, consegne il giovedì.',
    detail:
      'Un team dedicato di Pianeta — design, web, copy — a tua disposizione ogni mese. Meeting settimanale, consegne ogni giovedì, priorità gestite insieme. Per chi ha bisogno di ritmo continuo senza assumere.',
    deliverables: [
      'Team dedicato (design, web, copy)',
      '~48h al mese',
      'Meeting settimanale',
      'Consegne ogni giovedì',
    ],
    bullets: ['Team dedicato', 'Meeting settimanale', 'Consegne ogni giovedì'],
    accent: 'dark',
    emoji: '🤝',
    stripe: { mode: 'subscription', amount: 400000, recurring: 'month', label: 'Attiva — 4.000€/mese + IVA' },
    related: [
      { title: 'BC3 — Annual Reports', href: `${SITE}/work/bc3-annual-reports`, kind: 'case' },
      { title: 'ChildFund World Index', href: `${SITE}/work/childfund-world-index`, kind: 'case' },
    ],
  },
  {
    slug: 'progetto',
    name: 'Progetto su misura',
    price: 'su quotazione',
    forWho: 'Per chi ha un progetto definito — sito, brand, campagna o prodotto digitale — e vuole un preventivo su misura.',
    tagline: 'Un progetto completo, quotato sulle tue esigenze.',
    detail:
      'Quando il progetto è più grande di un’offerta a pacchetto — un sito articolato, un rebrand completo, una piattaforma — lo costruiamo su misura. Partiamo da una call per capire scope e obiettivi, poi ti mandiamo un preventivo dettagliato con tempi e fasi. Stesso metodo: co-design, validazione con neuroscienza, AI e dati, consegna e supporto.',
    deliverables: [
      'Call di scoping e analisi obiettivi',
      'Preventivo dettagliato con fasi e tempi',
      'Team Pianeta dedicato al progetto',
      'Consegna degli asset e dei contenuti',
    ],
    bullets: ['Scope su misura', 'Preventivo dettagliato', 'Team dedicato'],
    accent: 'blue',
    emoji: '✦',
    quote: { label: 'Richiedi un preventivo' },
    related: [
      { title: 'BC3 — Rebranding', href: `${SITE}/work/bc3-rebranding`, kind: 'case' },
      { title: 'ECLAG — Choose to See Them', href: `${SITE}/work/eclag`, kind: 'case' },
    ],
  },
];

const SITE_EN = '/en';
const OFFERS_EN: Offer[] = [
  {
    slug: 'sito-green',
    name: 'Green Site',
    price: 'from €2,000 + VAT',
    forWho: 'For green brands and SMEs that want a serious, low-impact online presence.',
    tagline: 'A sustainable, fast website on our design system, with measured CO₂.',
    detail:
      'We build your site bespoke — sustainable, fast, on our Hederae design system. We measure each page’s CO₂ with GreenMeter and keep it low by design. Fast and mobile-first, with verifiable performance and impact. Your content and domain stay yours.',
    deliverables: [
      'Responsive site on the Hederae design system',
      'Per-page CO₂ report (GreenMeter)',
      'Verifiable performance and carbon budget',
      'Your content and domain, always yours',
    ],
    bullets: ['Hederae design system', 'Measured CO₂ (GreenMeter)', 'Fast, mobile-first'],
    accent: 'green',
    emoji: '🌱',
    stripe: { mode: 'payment', amount: 200000, label: 'Buy now — €2,000 + VAT' },
    related: [
      { title: 'BC3 — Rebranding', href: `${SITE_EN}/work/bc3-rebranding`, kind: 'case' },
      { title: 'ARIES — AI for environment & sustainability', href: `${SITE_EN}/work/aries-towards-smarter-sustainable-world`, kind: 'case' },
    ],
    stats: [
      { k: 'Lighthouse', v: '94–95/100' },
      { k: 'LCP', v: '~2.0s' },
      { k: 'Page weight', v: '0.7–1.4 MB' },
      { k: 'CO₂ / visit', v: '~0.1–0.2 g' },
    ],
    statsNote: 'Real numbers, measured on our own and client sites (e.g. cornertable.agency, pianeta.studio). Web average: ~2.3 MB and ~0.36 g CO₂. CO₂ estimated with the Green Web Foundation method (Sustainable Web Design), via GreenMeter.',
  },
  {
    slug: 'pianeta-sprint',
    name: 'Pianeta Sprint',
    price: '4 days · €3,500 + VAT',
    forWho: 'For anyone about to invest in a campaign, a site or a rebrand who can’t afford a wrong first step.',
    tagline: 'From a fuzzy idea to a validated direction, in 4 days.',
    detail:
      'Four days to turn a fuzzy idea into a validated direction, ready to produce. We work in co-design, validate with neuroscience, AI and data — always with a human in the loop — and deliver a direction that holds, before you spend the production budget.',
    deliverables: [
      'A validated creative / messaging direction',
      'The validation rationale (neuroscience, AI & data)',
      'The key assets decided in the sprint',
      'A roadmap of next steps',
    ],
    bullets: ['4 time-boxed days', 'Neuroscience, AI & data', 'Deliverables + roadmap'],
    accent: 'orange',
    emoji: '⚡',
    stripe: { mode: 'payment', amount: 350000, label: 'Book the Sprint — €3,500 + VAT' },
    related: [
      { title: 'ECLAG — Choose to See Them', href: `${SITE_EN}/work/eclag`, kind: 'case' },
      { title: 'Validate a campaign before producing it', href: `${SITE_EN}/bulletin/validare-una-campagna-prima-di-produrla`, kind: 'article' },
      { title: 'Neuromarketing Lab', href: `${SITE_EN}/bulletin/lab-neuromarketing`, kind: 'article' },
    ],
    method: [
      { n: 1, title: 'Immersion', body: 'Goals, audience, an audit of what you already have. Half a day with you, the rest we work on our own.' },
      { n: 2, title: 'Direction', body: 'Concept and key messages. One or more creative directions — not a single bet.' },
      { n: 3, title: 'Validation', body: 'Neuroscience, AI and data stress-test the directions with a synthetic panel — with a human making the call. We see what convinces and what triggers resistance, before producing.' },
      { n: 4, title: 'Delivery', body: 'Final validated direction + key assets + roadmap, in a handover meeting.' },
    ],
    faqs: [
      { q: 'Proprietary tech or resold tools?', a: 'The validation engine (neuroscience, AI and data) is ours, built in-house, with a human always in the loop. We don’t resell a third-party tool: it’s the method we work with.' },
      { q: 'What exactly do you deliver?', a: 'A validated creative/messaging direction ready to produce, the validation rationale, the key assets decided in the Sprint and a roadmap of next steps.' },
      { q: 'Who is the Sprint for?', a: 'For anyone about to invest in a campaign, a site or a rebrand who wants to start on the right foot — not waste months and budget on the wrong direction.' },
      { q: 'And after the Sprint?', a: 'You can produce with us (or with whoever you like: the direction is yours) or move to Team as a Service for an ongoing relationship.' },
    ],
  },
  {
    slug: 'team-as-a-service',
    name: 'Team as a Service',
    price: '€4,000/month + VAT',
    forWho: 'For those who need a dedicated team on an ongoing basis.',
    tagline: 'A dedicated team, every month. Weekly meeting, deliveries on Thursdays.',
    detail:
      'A dedicated Pianeta team — design, web, copy — at your disposal every month. Weekly meeting, deliveries every Thursday, priorities managed together. For those who need steady pace without hiring.',
    deliverables: [
      'Dedicated team (design, web, copy)',
      '~48h per month',
      'Weekly meeting',
      'Deliveries every Thursday',
    ],
    bullets: ['Dedicated team', 'Weekly meeting', 'Deliveries every Thursday'],
    accent: 'dark',
    emoji: '🤝',
    stripe: { mode: 'subscription', amount: 400000, recurring: 'month', label: 'Activate — €4,000/month + VAT' },
    related: [
      { title: 'BC3 — Annual Reports', href: `${SITE_EN}/work/bc3-annual-reports`, kind: 'case' },
      { title: 'ChildFund World Index', href: `${SITE_EN}/work/childfund-world-index`, kind: 'case' },
    ],
  },
  {
    slug: 'progetto',
    name: 'Bespoke project',
    price: 'on quote',
    forWho: 'For those with a defined project — site, brand, campaign or digital product — who want a tailored quote.',
    tagline: 'A complete project, quoted on your needs.',
    detail:
      'When the project is bigger than a packaged offer — a complex site, a full rebrand, a platform — we build it bespoke. We start with a call to understand scope and goals, then send you a detailed quote with timing and phases. Same method: co-design, validation with neuroscience, AI and data, delivery and support.',
    deliverables: [
      'Scoping call and goal analysis',
      'Detailed quote with phases and timing',
      'A dedicated Pianeta team on the project',
      'Assets and content handed over',
    ],
    bullets: ['Bespoke scope', 'Detailed quote', 'Dedicated team'],
    accent: 'blue',
    emoji: '✦',
    quote: { label: 'Request a quote' },
    related: [
      { title: 'BC3 — Rebranding', href: `${SITE_EN}/work/bc3-rebranding`, kind: 'case' },
      { title: 'ECLAG — Choose to See Them', href: `${SITE_EN}/work/eclag`, kind: 'case' },
    ],
  },
];

export function getOffers(locale: 'it' | 'en' = 'it'): Offer[] {
  return locale === 'en' ? OFFERS_EN : OFFERS_IT;
}
export const OFFERS = OFFERS_IT; // default IT (retrocompat)
export function offerBySlug(slug: string, locale: 'it' | 'en' = 'it'): Offer | undefined {
  return getOffers(locale).find((o) => o.slug === slug);
}

// Offerte evergreen — superficie hire del sito. Config-as-data.
// `related`: case study + articoli del sito collegati (principio: sempre prove + contenuti).
// Href relativi → ClientRouter li gestisce come transizioni SPA native.

const SITE = '';

export interface Related { title: string; href: string; kind: 'case' | 'article' }

export interface Offer {
  slug: string;
  name: string;
  price: string;
  forWho: string;
  tagline: string;
  detail: string;
  deliverables: string[];
  bullets: string[];
  accent: 'green' | 'orange' | 'dark';
  emoji: string;
  stripe: { mode: 'payment' | 'subscription'; amount: number; recurring?: 'month'; label: string };
  related: Related[];
}

export const OFFERS: Offer[] = [
  {
    slug: 'sito-green',
    name: 'Sito Green',
    price: 'da 2.000€ + IVA',
    forWho: 'Per brand e PMI green che vogliono una presenza online seria e a basso impatto.',
    tagline: 'Un sito sostenibile e veloce, sul nostro design system, con la CO₂ misurata.',
    detail:
      'Costruiamo il tuo sito su misura — sostenibile, veloce, sul nostro design system Hederae. Misuriamo la CO₂ di ogni pagina con GreenMeter e la teniamo bassa per design. Standard aperti e codice consegnato: il sito è tuo, niente lock-in.',
    deliverables: [
      'Sito responsive sul design system Hederae',
      'Report CO₂ per pagina (GreenMeter)',
      'Performance e carbon budget verificabili',
      'Codice e contenuti consegnati — nessun lock-in',
    ],
    bullets: ['Design system Hederae', 'CO₂ misurata (GreenMeter)', 'Veloce e mobile-first'],
    accent: 'green',
    emoji: '🌱',
    stripe: { mode: 'payment', amount: 200000, label: 'Acquista — 2.000€ + IVA' },
    related: [
      { title: 'BC3 — Rebranding', href: `${SITE}/work/bc3-rebranding`, kind: 'case' },
      { title: 'ARIES — AI per ambiente e sostenibilità', href: `${SITE}/work/aries-towards-smarter-sustainable-world`, kind: 'case' },
    ],
  },
  {
    slug: 'pianeta-sprint',
    name: 'Pianeta Sprint',
    price: '4 giorni · 3.500€ + IVA',
    forWho: 'Per chi sta per investire su una campagna, un sito o un rebrand e non vuole sbagliare il primo passo.',
    tagline: 'Da un’idea confusa a una direzione validata, in 4 giorni.',
    detail:
      'Quattro giorni per trasformare un’idea confusa in una direzione validata e pronta da produrre. Lavoriamo in co-design, validiamo con il nostro swarm AI + neuromarketing, e consegniamo una direzione che regge — prima che tu spenda il budget di produzione.',
    deliverables: [
      'Direzione creativa / di messaggio validata',
      'Il razionale della validazione (swarm AI)',
      'Gli asset chiave decisi nello sprint',
      'Una roadmap dei passi successivi',
    ],
    bullets: ['4 giorni time-boxed', 'Validazione con swarm AI', 'Deliverable + roadmap'],
    accent: 'orange',
    emoji: '⚡',
    stripe: { mode: 'payment', amount: 350000, label: 'Prenota lo Sprint — 3.500€ + IVA' },
    related: [
      { title: 'ECLAG — Choose to See Them', href: `${SITE}/work/eclag`, kind: 'case' },
      { title: 'Validare una campagna prima di produrla', href: `${SITE}/bulletin/validare-una-campagna-prima-di-produrla`, kind: 'article' },
      { title: 'Lab Neuromarketing', href: `${SITE}/bulletin/lab-neuromarketing`, kind: 'article' },
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
];

export function offerBySlug(slug: string): Offer | undefined {
  return OFFERS.find((o) => o.slug === slug);
}

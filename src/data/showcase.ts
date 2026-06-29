// Contenuti curati per la superficie hire (selezione, non duplica il sito). Href/cover relativi.
const SITE = '';

export interface Work { title: string; client: string; cover: string; href: string }
export const WORKS: Work[] = [
  { title: 'Choose to See Them', client: 'ECLAG', cover: `${SITE}/og/work-eclag.png`, href: `${SITE}/work/eclag` },
  { title: 'BC3 — Rebranding', client: 'Basque Centre for Climate Change', cover: `${SITE}/og/work-bc3-cover.png`, href: `${SITE}/work/bc3-rebranding` },
  { title: 'ARIES', client: 'AI for Environment & Sustainability', cover: `${SITE}/og/work-aries-cover.png`, href: `${SITE}/work/aries-towards-smarter-sustainable-world` },
  { title: 'ChildFund World Index', client: 'ChildFund · WeWorld', cover: `${SITE}/og/work-childfund-cover.png`, href: `${SITE}/work/childfund-world-index` },
  { title: 'UNTWIST', client: 'BC3 — Water-Energy-Food Nexus', cover: `${SITE}/og/work-untwist.png`, href: `${SITE}/work/untwist` },
  { title: 'BC3 Annual Reports', client: 'Basque Centre for Climate Change', cover: `${SITE}/og/work-bc3-reports-cover.png`, href: `${SITE}/work/bc3-annual-reports` },
];

// Team — avatar veri non disponibili → bolle-iniziali finché Max non carica le foto.
export interface Member { name: string; initials: string }
export const TEAM: Member[] = [
  { name: 'Massimiliano Mauro', initials: 'MM' },
  { name: 'Francesca Fossati', initials: 'FF' },
  { name: 'Fabrizio Ciampini', initials: 'FC' },
  { name: 'Ludovica Ranzini', initials: 'LR' },
  { name: 'Alessia Musio', initials: 'AM' },
  { name: 'Andrea Maccone', initials: 'AM' },
  { name: 'Sara Amatista', initials: 'SA' },
];

// Clienti (dalla home del sito).
export const CLIENTS: string[] = [
  'Armani', 'Prada', 'La Repubblica', 'Wired', 'Plenitude', 'BC3', 'ChildFund',
  'WeWorld', 'ECLAG', "Sant'Egidio", 'ARIES', 'ArtPay', 'Morsy', 'Latte Creative', 'Susdef', 'Apotheke',
];

// Testimonials. Cornertable = cliente reale (Max chiede citazione + foto). Per ora bozza.
export interface Testimonial { quote: string; name: string; org: string; url?: string; initials: string; draft?: boolean }
export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Direzione chiara fin da subito, zero giri a vuoto: hanno validato l’idea prima di spendere. Esattamente lo studio che cercavamo — flessibile come una boutique, solido come uno studio.',
    name: 'Cornertable', org: 'cornertable.agency', url: 'https://cornertable.agency', initials: 'CT', draft: true,
  },
];

export const ABOUT = {
  title: 'Chi siamo',
  body: 'Pianeta.Studio è uno studio di Sustainable Creativity — design & technology al servizio di idee che generano cambiamento positivo per le persone e per il pianeta. Società Benefit: il Pianeta-centric design è scritto nel nostro statuto. Lavoriamo in co-design, validiamo con AI prima di produrre, e consegniamo codice e standard aperti — niente lock-in.',
  href: `${SITE}/bulletin/chi-siamo`,
};

const ABOUT_EN = {
  title: 'About us',
  body: 'Pianeta.Studio is a Sustainable Creativity studio — design & technology in service of ideas that create positive change for people and the planet. A Benefit Corporation: Planet-centric design is written into our charter. We work in co-design, validate with AI before producing, and hand over code and open standards — no lock-in.',
  href: `/en/bulletin/chi-siamo`,
};

const TESTIMONIALS_EN: Testimonial[] = [
  {
    quote: 'Clear direction from day one, zero wasted loops: they validated the idea before spending. Exactly the studio we were looking for — flexible like a boutique, solid like a studio.',
    name: 'Cornertable', org: 'cornertable.agency', url: 'https://cornertable.agency', initials: 'CT', draft: true,
  },
];

// Helper bilingue: works/team/clients condivisi (nomi), about+testimonials localizzati, href con prefisso /en.
export function getShowcase(locale: 'it' | 'en' = 'it') {
  const pfx = locale === 'en' ? '/en' : '';
  return {
    works: WORKS.map((w) => ({ ...w, href: `${pfx}${w.href}` })),
    team: TEAM,
    clients: CLIENTS,
    about: locale === 'en' ? ABOUT_EN : ABOUT,
    testimonials: locale === 'en' ? TESTIMONIALS_EN : TESTIMONIALS,
  };
}

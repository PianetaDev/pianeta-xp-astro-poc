export interface ServiceCategory {
  key: 'creativity' | 'design' | 'technology';
  titleIT: string;
  titleEN: string;
  introIT: string;
  introEN: string;
  order: number;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: 'creativity',
    titleIT: 'Creatività',
    titleEN: 'Creativity',
    introIT: 'Ogni progetto inizia prima del brief. I servizi di Creatività lavorano su strategia, posizionamento e validazione: mappano il territorio competitivo, definiscono la direzione differenziante, testano le ipotesi prima che diventino investimenti. È la fase in cui si decide cosa vale la pena costruire — e per chi.',
    introEN: "Every project starts before the brief. Creativity services work on strategy, positioning, and validation: mapping the competitive landscape, defining a differentiating direction, testing hypotheses before they become investments. It's the phase where we decide what's worth building — and for whom.",
    order: 1,
  },
  {
    key: 'design',
    titleIT: 'Design',
    titleEN: 'Design',
    introIT: "Un sistema visivo è un'infrastruttura, non una decorazione. I servizi di Design traducono la strategia in forma: identità visive, sistemi editoriali, infografiche, micrositi, design system multi-brand. Ogni elemento è costruito per funzionare nei canali reali e per essere gestito autonomamente dal cliente.",
    introEN: 'A visual system is infrastructure, not decoration. Design services translate strategy into form: visual identities, editorial systems, infographics, microsites, multi-brand design systems. Every element is built to work across real channels and to be managed independently by the client.',
    order: 2,
  },
  {
    key: 'technology',
    titleIT: 'Tecnologia',
    titleEN: 'Technology',
    introIT: 'Costruiamo prodotti digitali che partono snelli e crescono per evidenze, con vincoli di sostenibilità nello stesso brief. I servizi di Tecnologia coprono l\'intero ciclo — app, piattaforme, siti web — su standard aperti. Il codice viene consegnato al cliente: il prodotto è vostro dall\'inizio, nessuna dipendenza esclusiva da noi.',
    introEN: "We build digital products that start lean and grow by evidence, with sustainability constraints built into the same brief. Technology services cover the full cycle — apps, platforms, websites — on open standards. Code is delivered to the client: your product is yours from day one, no exclusive dependency on us.",
    order: 3,
  },
];

export const PROCESS_PHASES = [
  { num: 1, title: 'Discover & define', anchor: 'discover' },
  { num: 2, title: 'Ideate & prototype', anchor: 'ideate' },
  { num: 3, title: 'Refine & deliver', anchor: 'refine' },
  { num: 4, title: 'Support & validate', anchor: 'support' },
];

export function getCategoryByKey(key: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((c) => c.key === key);
}

export function getPhaseTag(phase: number | string | undefined): string {
  if (phase == null) return '';
  if (typeof phase === 'number') {
    const p = PROCESS_PHASES.find((x) => x.num === phase);
    return p ? `${p.num} · ${p.title}` : '';
  }
  return String(phase);
}

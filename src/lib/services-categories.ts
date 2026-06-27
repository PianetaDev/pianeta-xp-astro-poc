export interface ServiceCategory {
  key: 'strategic-design-consultancy' | 'visualization-storytelling' | 'products-systems' | 'data-ai';
  title: string;
  intro: string;
  order: number;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: 'strategic-design-consultancy',
    title: 'Strategic Design Consultancy',
    intro: 'Combiniamo brand strategy, research e UX/CX per aiutare le organizzazioni a usare il design come leva strategica.',
    order: 1,
  },
  {
    key: 'visualization-storytelling',
    title: 'Visualization & Storytelling',
    intro: 'Trasformiamo concetti complessi e dati in narrazioni visive che fanno parlare ricerca, brand e messaggi al pubblico vero.',
    order: 2,
  },
  {
    key: 'products-systems',
    title: 'Products & Systems',
    intro: 'Costruiamo prodotti digitali e sistemi pensati per durare nel tempo, con carbon budget come vincolo verificabile.',
    order: 3,
  },
  {
    key: 'data-ai',
    title: 'Data & AI',
    intro: 'Sviluppiamo strategie di implementazione AI e infrastruttura ESG con i nostri framework proprietari.',
    order: 4,
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

export const strings = {
  it: {
    nav_hub: 'Hub',
    nav_work: 'Work',
    nav_bulletin: 'Bulletin',
    nav_services: 'Servizi',
    nav_team: 'Team',
    nav_lab: 'Lab',
    nav_careers: 'Careers',
    cta_lavoriamo: 'Lavoriamo insieme',
    cta_come_lavoriamo: 'Come lavoriamo',
    footer_tagline: 'Sustainable Creativity',
    footer_societa_benefit: 'Società Benefit',
    footer_carbon: 'Carbon footprint',
    footer_misurato: 'Misurato con GreenMeter ↗',
    fallback_banner: '🌐 Traduzione in corso — contenuto mostrato in italiano',
  },
  en: {
    nav_hub: 'Hub',
    nav_work: 'Work',
    nav_bulletin: 'Bulletin',
    nav_services: 'Services',
    nav_team: 'Team',
    nav_lab: 'Lab',
    nav_careers: 'Careers',
    cta_lavoriamo: "Let's work together",
    cta_come_lavoriamo: 'How we work',
    footer_tagline: 'Sustainable Creativity',
    footer_societa_benefit: 'Benefit Corporation',
    footer_carbon: 'Carbon footprint',
    footer_misurato: 'Measured with GreenMeter ↗',
    fallback_banner: '🌐 English translation in progress — content shown in Italian',
  },
} as const;

export type Locale = 'it' | 'en';
export type StringKey = keyof typeof strings.it;

export function t(locale: Locale, key: StringKey): string {
  return (strings[locale] as Record<string, string>)?.[key] || strings.it[key];
}

export function detectLocale(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'it';
}

/**
 * Compute the equivalent path in the target locale.
 * IT (default) has no prefix; EN has `/en` prefix.
 */
export function localizePath(pathname: string, target: Locale): string {
  const stripped = pathname.replace(/^\/en(\/|$)/, '/');
  const clean = stripped === '' ? '/' : stripped;
  if (target === 'it') return clean;
  // target === 'en'
  if (clean === '/') return '/en';
  return '/en' + clean;
}

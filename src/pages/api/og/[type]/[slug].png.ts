import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';
import { getCollection } from 'astro:content';
import { offerBySlug } from '../../../../data/offers';

export const prerender = false;
export const config = { runtime: 'edge' };

type OgType = 'work' | 'bulletin' | 'services' | 'lab' | 'team' | 'careers' | 'hire';
const ALLOWED: OgType[] = ['work', 'bulletin', 'services', 'lab', 'team', 'careers', 'hire'];

// Pagine hire non-offerta (landing, fondazioni, metodo) — titolo + deck per locale.
const HIRE_PAGES: Record<string, { it: { eyebrow: string; title: string; deck: string }; en: { eyebrow: string; title: string; deck: string } }> = {
  index: {
    it: { eyebrow: 'LAVORIAMO INSIEME', title: 'Design, web e brand che convincono', deck: 'Validati con neuroscienza, AI e dati. Offerte chiare, prove reali.' },
    en: { eyebrow: 'LET’S WORK TOGETHER', title: 'Design, web and brand that convince', deck: 'Validated with neuroscience, AI and data. Clear offers, real proof.' },
  },
  fondazioni: {
    it: { eyebrow: 'FONDAZIONI ED ENTI', title: 'Vinciamo gare e bandi con chi ha una missione', deck: 'Susdef · ECLAG · Lucy sulla Cultura · Foodreboot. Inviaci la tua gara.' },
    en: { eyebrow: 'FOUNDATIONS & INSTITUTIONS', title: 'We win tenders with mission-driven organisations', deck: 'Susdef · ECLAG · Lucy sulla Cultura · Foodreboot. Send us your tender.' },
  },
  metodo: {
    it: { eyebrow: 'IL METODO', title: 'Identifica, valida, misura, modifica', deck: 'Il funnel che vendiamo, applicato prima su noi stessi.' },
    en: { eyebrow: 'THE METHOD', title: 'Identify, validate, measure, iterate', deck: 'The funnel we sell, applied to ourselves first.' },
  },
  piattaforme: {
    it: { eyebrow: 'PIATTAFORME E AI AUTOMATION', title: 'Cerchiamo aziende da innovare', deck: 'Selezioniamo processi B2B e B2C da trasformare in piattaforme. Luxottica · Morsy · ArtPay. Candida il tuo processo.' },
    en: { eyebrow: 'PLATFORMS & AI AUTOMATION', title: 'Looking for companies to innovate', deck: 'We select B2B and B2C processes to turn into platforms. Luxottica · Morsy · ArtPay. Apply with your process.' },
  },
};

const ORANGE = '#FF6B33';
const CREAM = '#fafaf7';
const INK = '#0e1116';

function eyebrowFor(type: OgType, data: any): string {
  const t = type.toUpperCase();
  if (type === 'bulletin' && data?.date) {
    const d = new Date(data.date);
    const fmt = new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
    return `${t} · ${fmt.toUpperCase()}`;
  }
  if (type === 'work' && data?.year) return `${t} · ${data.year}`;
  if (type === 'team' && data?.role) return `${t} · ${String(data.role).toUpperCase()}`;
  if (data?.category) return `${t} · ${String(data.category).toUpperCase()}`;
  return t;
}

function truncate(s: string, max = 90): string {
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + '…';
}

export const GET: APIRoute = async ({ params, url }) => {
  const type = params.type as OgType;
  const rawSlug = params.slug || '';
  const slug = rawSlug.replace(/\.png$/, '');

  if (!type || !slug || !ALLOWED.includes(type)) {
    return new Response('Not found', { status: 404 });
  }

  let entryData: any = {};
  let title = String(slug);
  let eyebrow = '';
  let deck = '';

  if (type === 'hire') {
    const loc = url.searchParams.get('l') === 'en' ? 'en' : 'it';
    const page = HIRE_PAGES[slug];
    if (page) {
      eyebrow = page[loc].eyebrow;
      title = page[loc].title;
      deck = page[loc].deck;
    } else {
      const offer = offerBySlug(slug, loc);
      eyebrow = loc === 'en' ? 'OFFER' : 'OFFERTA';
      title = offer ? offer.name : slug;
      deck = offer ? offer.tagline : '';
    }
  } else {
    try {
      const collection = await getCollection(type as any);
      const entry = collection.find((e: any) => e.id === slug);
      if (entry) {
        entryData = entry.data;
        title = entry.data.title || entry.data.name || entry.id;
      }
    } catch {
      // Fall back to slug
    }
    eyebrow = eyebrowFor(type, entryData);
  }

  const safeTitle = truncate(title, 90);
  const safeDeck = truncate(deck, 120);
  const isDark = type === 'lab' || type === 'careers';
  const bg = isDark ? INK : CREAM;
  const fg = isDark ? CREAM : INK;
  const muted = isDark ? '#9aa3af' : '#5b6470';

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: bg,
          color: fg,
          fontFamily: 'sans-serif',
        },
        children: [
          // Top: wordmark
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: '-0.02em',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { color: ORANGE, marginRight: 8 },
                    children: 'Pianeta',
                  },
                },
                {
                  type: 'span',
                  props: { style: { color: fg }, children: '.Studio' },
                },
              ],
            },
          },
          // Middle: eyebrow + title
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: 24 },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: muted,
                    },
                    children: eyebrow,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: safeDeck ? 68 : 78,
                      fontWeight: 900,
                      lineHeight: 1.05,
                      letterSpacing: '-0.025em',
                      color: fg,
                      display: 'flex',
                      maxWidth: 1056,
                    },
                    children: safeTitle,
                  },
                },
                ...(safeDeck
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 30,
                            fontWeight: 500,
                            lineHeight: 1.3,
                            color: muted,
                            display: 'flex',
                            maxWidth: 1000,
                          },
                          children: safeDeck,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Bottom
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      fontSize: 22,
                      color: muted,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: 14,
                            height: 14,
                            borderRadius: 999,
                            background: ORANGE,
                            display: 'flex',
                          },
                          children: '',
                        },
                      },
                      {
                        type: 'span',
                        props: { children: 'Sustainable Creativity' },
                      },
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: 22, color: muted, fontWeight: 600 },
                    children: 'xp.pianeta.studio',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      headers: {
        'cache-control': 'public, max-age=604800, immutable',
      },
    },
  );
};

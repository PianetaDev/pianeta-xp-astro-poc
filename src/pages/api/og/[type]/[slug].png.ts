import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const prerender = false;

type OgType = 'work' | 'bulletin' | 'services' | 'lab' | 'team' | 'careers';
const ALLOWED: OgType[] = ['work', 'bulletin', 'services', 'lab', 'team', 'careers'];

const ORANGE = '#FF6B33';
const CREAM = '#fafaf7';
const INK = '#0e1116';

const FONT_URLS = {
  regular: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2',
  // Inter 900 (Black) — woff2 from gstatic
  black: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa6Ds.woff2',
};

// Module-level cache so warm invocations skip the fetch
let fontCache: { regular: ArrayBuffer; black: ArrayBuffer } | null = null;

async function loadFonts() {
  if (fontCache) return fontCache;
  const [r, b] = await Promise.all([
    fetch(FONT_URLS.regular).then((r) => r.arrayBuffer()),
    fetch(FONT_URLS.black).then((r) => r.arrayBuffer()).catch(() =>
      // Fallback: reuse regular if black variant 404s — satori will synth-bold
      fetch(FONT_URLS.regular).then((r) => r.arrayBuffer())
    ),
  ]);
  fontCache = { regular: r, black: b };
  return fontCache;
}

function eyebrowFor(type: OgType, data: any): string {
  const t = type.toUpperCase();
  if (type === 'bulletin' && data?.date) {
    const d = new Date(data.date);
    const fmt = new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
    return `${t} · ${fmt.toUpperCase()}`;
  }
  if (type === 'work' && data?.year) return `${t} · ${data.year}`;
  if (data?.category) return `${t} · ${String(data.category).toUpperCase()}`;
  return t;
}

function truncate(s: string, max = 90): string {
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + '…';
}

export const GET: APIRoute = async ({ params }) => {
  const type = params.type as OgType;
  const slug = params.slug;
  if (!type || !slug || !ALLOWED.includes(type)) {
    return new Response('Not found', { status: 404 });
  }

  let entryData: any = {};
  let title = String(slug);
  try {
    const collection = await getCollection(type as any);
    const entry = collection.find((e: any) => e.id === slug);
    if (entry) {
      entryData = entry.data;
      title = entry.data.title || entry.id;
    }
  } catch {
    // Collection not loadable in this runtime — fall back to slug
  }

  const eyebrow = eyebrowFor(type, entryData);
  const safeTitle = truncate(title, 90);
  const isDark = type === 'lab' || type === 'careers';
  const bg = isDark ? INK : CREAM;
  const fg = isDark ? CREAM : INK;
  const muted = isDark ? '#9aa3af' : '#5b6470';

  const { regular, black } = await loadFonts();

  const tree: any = {
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: bg,
        color: fg,
        fontFamily: 'Inter',
        position: 'relative',
      },
      children: [
        // Top row: logo wordmark
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 900, letterSpacing: '-0.02em' },
            children: [
              {
                type: 'span',
                props: { style: { color: ORANGE, marginRight: 8 }, children: 'Pianeta' },
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
                    fontSize: 78,
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: '-0.025em',
                    color: fg,
                    display: '-webkit-box',
                    // satori supports basic line clamp
                    // @ts-ignore
                    '-webkit-line-clamp': 2,
                    '-webkit-box-orient': 'vertical',
                    overflow: 'hidden',
                  },
                  children: safeTitle,
                },
              },
            ],
          },
        },
        // Bottom row
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: 16, fontSize: 22, color: muted },
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
  };

  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: regular, weight: 400, style: 'normal' },
      { name: 'Inter', data: regular, weight: 600, style: 'normal' },
      { name: 'Inter', data: black, weight: 900, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=604800, immutable',
    },
  });
};

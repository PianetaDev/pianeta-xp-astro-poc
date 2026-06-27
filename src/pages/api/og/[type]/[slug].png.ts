import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';
import { getCollection } from 'astro:content';

export const prerender = false;
export const config = { runtime: 'edge' };

type OgType = 'work' | 'bulletin' | 'services' | 'lab' | 'team' | 'careers';
const ALLOWED: OgType[] = ['work', 'bulletin', 'services', 'lab', 'team', 'careers'];

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

export const GET: APIRoute = async ({ params }) => {
  const type = params.type as OgType;
  const rawSlug = params.slug || '';
  const slug = rawSlug.replace(/\.png$/, '');

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
      title = entry.data.title || entry.data.name || entry.id;
    }
  } catch {
    // Fall back to slug
  }

  const eyebrow = eyebrowFor(type, entryData);
  const safeTitle = truncate(title, 90);
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
                      fontSize: 78,
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

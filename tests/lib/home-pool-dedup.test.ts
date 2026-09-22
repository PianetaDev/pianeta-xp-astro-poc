import { describe, it, expect } from 'vitest';
import { pickRotatingSlots } from '../../src/lib/hero-rotation';

function fakeCookies(initial?: string) {
  const store = new Map<string, string>();
  if (initial !== undefined) store.set('home-pool-rotation', initial);
  return {
    get: (name: string) => (store.has(name) ? { value: store.get(name)! } : undefined),
    set: (name: string, value: string) => store.set(name, value),
    _store: store,
  };
}

const pool = [
  { kind: 'work' as const, id: 'a', client: 'ECLAG' },
  { kind: 'bulletin' as const, id: 'b' },
  { kind: 'work' as const, id: 'c', client: 'Armani' },
  { kind: 'post' as const, id: 'd', client: 'ECLAG' }, // stesso client di 'a'
  { kind: 'reel' as const, id: 'e', client: 'BC3' },
];

describe('pickRotatingSlots', () => {
  it('ritorna array vuoto su pool vuoto', () => {
    expect(pickRotatingSlots([], fakeCookies(), 4)).toEqual([]);
  });

  it('parte dal primo item quando non c\'è cookie', () => {
    const result = pickRotatingSlots(pool, fakeCookies(), 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a');
  });

  it('avanza l\'indice rispetto al cookie precedente', () => {
    const result = pickRotatingSlots(pool, fakeCookies('0'), 1);
    expect(result[0].id).toBe('b');
  });

  it('scrive il nuovo indice nel cookie', () => {
    const cookies = fakeCookies('0');
    pickRotatingSlots(pool, cookies, 1);
    expect(cookies._store.get('home-pool-rotation')).toBe('1');
  });

  it('fa wrap-around dopo l\'ultimo item', () => {
    const result = pickRotatingSlots(pool, fakeCookies('4'), 1);
    expect(result[0].id).toBe('a'); // index 5 % 5 = 0
  });

  it('deduplica: scarta candidato con stesso client già selezionato', () => {
    // Partiamo da index 0 (a=ECLAG), il quarto item d ha client=ECLAG e deve essere saltato
    const cookies = fakeCookies();
    const result = pickRotatingSlots(pool, cookies, 4);
    const ids = result.map((r) => r.id);
    expect(ids).toContain('a'); // client ECLAG → incluso
    expect(ids).not.toContain('d'); // client ECLAG → escluso (duplicato)
    expect(ids).toHaveLength(4);
  });

  it('non deduplica item senza client (ogni assenza è unica)', () => {
    const mixedPool = [
      { kind: 'bulletin' as const, id: 'x' }, // no client
      { kind: 'bulletin' as const, id: 'y' }, // no client
      { kind: 'work' as const, id: 'z', client: 'Acme' },
    ];
    const result = pickRotatingSlots(mixedPool, fakeCookies(), 3);
    expect(result.map((r) => r.id)).toEqual(['x', 'y', 'z']);
  });

  it('restituisce meno di count se il pool è troppo piccolo dopo dedup', () => {
    const tinyPool = [
      { kind: 'work' as const, id: 'p', client: 'X' },
      { kind: 'post' as const, id: 'q', client: 'X' }, // dedup → skip
    ];
    const result = pickRotatingSlots(tinyPool, fakeCookies(), 4);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p');
  });

  it('ignora cookie non valido e riparte da zero', () => {
    expect(pickRotatingSlots(pool, fakeCookies('99'), 1)[0].id).toBe('a');
    expect(pickRotatingSlots(pool, fakeCookies('NaN'), 1)[0].id).toBe('a');
  });
});

import { describe, it, expect } from 'vitest';
import { pickRotatingHero } from '../../src/lib/hero-rotation';

function fakeCookies(initial?: string) {
  const store = new Map<string, string>();
  if (initial !== undefined) store.set('hero-rotation', initial);
  return {
    get: (name: string) => (store.has(name) ? { value: store.get(name)! } : undefined),
    set: (name: string, value: string) => store.set(name, value),
    _store: store,
  };
}

const pool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

describe('pickRotatingHero', () => {
  it('parte dal primo item quando non c\'è cookie', () => {
    const cookies = fakeCookies();
    expect(pickRotatingHero(pool, cookies)?.id).toBe('a');
  });

  it('avanza al prossimo item rispetto al cookie esistente', () => {
    const cookies = fakeCookies('0');
    expect(pickRotatingHero(pool, cookies)?.id).toBe('b');
  });

  it('torna al primo item dopo l\'ultimo (wrap-around)', () => {
    const cookies = fakeCookies('2');
    expect(pickRotatingHero(pool, cookies)?.id).toBe('a');
  });

  it('ignora un cookie non valido o fuori range e riparte da zero', () => {
    expect(pickRotatingHero(pool, fakeCookies('99'))?.id).toBe('a');
    expect(pickRotatingHero(pool, fakeCookies('not-a-number'))?.id).toBe('a');
  });

  it('scrive il nuovo indice nel cookie', () => {
    const cookies = fakeCookies('0');
    pickRotatingHero(pool, cookies);
    expect(cookies._store.get('hero-rotation')).toBe('1');
  });

  it('ritorna undefined su pool vuoto', () => {
    expect(pickRotatingHero([], fakeCookies())).toBeUndefined();
  });

  it('limita il pool a POOL_SIZE (4) anche se la lista è più lunga', () => {
    const bigPool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }];
    const cookies = fakeCookies('3'); // ultimo indice valido nel pool limitato a 4 (0-3)
    expect(pickRotatingHero(bigPool, cookies)?.id).toBe('a'); // wrap a 4 items, non 5
  });
});

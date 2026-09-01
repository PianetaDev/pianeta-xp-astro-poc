import { describe, it, expect } from 'vitest';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDraftPaths } from '../../scripts/draft-sitemap-filter.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesRoot = join(__dirname, '..', 'fixtures', 'draft-content');

describe('getDraftPaths', () => {
  it('include i draft IT ed EN, esclude i non-draft', () => {
    const paths = getDraftPaths(fixturesRoot);
    expect(paths.has('/work/eclag')).toBe(true);
    expect(paths.has('/en/lab/future-seeds')).toBe(true);
    expect(paths.has('/work/untwist')).toBe(false);
  });

  it('ritorna un Set vuoto se la cartella content non esiste', () => {
    const paths = getDraftPaths(join(fixturesRoot, 'nonexistent'));
    expect(paths.size).toBe(0);
  });
});

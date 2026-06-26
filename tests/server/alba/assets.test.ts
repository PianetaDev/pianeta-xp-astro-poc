import { describe, it, expect } from 'vitest';
import { getKb, getSystemPrompt, getTools } from '../../../src/lib/server/alba/assets';

describe('alba/assets', () => {
  it('legge la KB compilata', async () => {
    const kb = await getKb();
    expect(kb.entries.length).toBeGreaterThan(0);
    expect(kb.entries[0]).toHaveProperty('section');
  });

  it('legge il system prompt', async () => {
    const sp = await getSystemPrompt();
    expect(sp.length).toBeGreaterThan(100);
    expect(sp.toLowerCase()).toContain('alba');
  });

  it('legge il tool registry', async () => {
    const reg = await getTools();
    expect(reg.tools.length).toBeGreaterThan(0);
    expect(reg.tools[0]).toHaveProperty('name');
    expect(reg.tools[0]).toHaveProperty('input_schema');
  });
});

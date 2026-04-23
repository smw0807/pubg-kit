import { describe, it, expect } from 'vitest';
import { PubgClient } from '../../src/client/pubg.client';

const client = new PubgClient({ apiKey: 'test-api-key', rateLimit: false, cache: false });

describe('SeasonsResource', () => {
  it('getAll() returns seasons array', async () => {
    const seasons = await client.shard('steam').seasons.getAll();
    expect(seasons).toHaveLength(2);
    expect(seasons[0].type).toBe('season');
    expect(seasons[0].id).toBe('division.bro.official.pc-2018-01');
  });

  it('getAll() includes current season', async () => {
    const seasons = await client.shard('steam').seasons.getAll();
    const current = seasons.find((s) => s.attributes.isCurrentSeason);
    expect(current).toBeDefined();
    expect(current!.id).toBe('division.bro.official.pc-2024-season');
  });
});

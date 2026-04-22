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

  it('getPlayerStats() returns normal season stats', async () => {
    const stats = await client.shard('steam').seasons.getPlayerStats(
      'account.test123',
      'division.bro.official.pc-2024-season',
    );
    expect(stats).toBeDefined();
  });

  it('getPlayerRankedStats() returns ranked season stats', async () => {
    const stats = await client.shard('steam').seasons.getPlayerRankedStats(
      'account.test123',
      'division.bro.official.pc-2024-season',
    );
    expect(stats).toBeDefined();
    const s = stats as { data: { type: string } };
    expect(s.data.type).toBe('playerRankedSeason');
  });

  it('getLifetimeStats() returns lifetime data', async () => {
    const stats = await client.shard('steam').seasons.getLifetimeStats('account.test123');
    expect(stats).toBeDefined();
  });

  it('getBatchPlayerStats() returns stats for multiple players', async () => {
    const stats = await client.shard('steam').seasons.getBatchPlayerStats(
      'division.bro.official.pc-2024-season',
      'squad',
      ['account.test123', 'account.test456'],
    );
    expect(stats).toBeDefined();
  });

  it('getBatchLifetimeStats() returns lifetime stats for multiple players', async () => {
    const stats = await client.shard('steam').seasons.getBatchLifetimeStats(
      'squad',
      ['account.test123', 'account.test456'],
    );
    expect(stats).toBeDefined();
  });
});

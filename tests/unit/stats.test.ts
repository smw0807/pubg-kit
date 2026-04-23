import { describe, it, expect } from 'vitest';
import { PubgClient } from '../../src/client/pubg.client';

const client = new PubgClient({ apiKey: 'test-api-key', rateLimit: false, cache: false });

describe('StatsResource', () => {
  it('getPlayerStats() returns normal season stats', async () => {
    const stats = await client.shard('steam').stats.getPlayerStats(
      'account.test123',
      'division.bro.official.pc-2024-season',
    );
    expect(stats).toBeDefined();
    expect(stats.data.type).toBe('playerSeason');
  });

  it('getPlayerRankedStats() returns ranked season stats', async () => {
    const stats = await client.shard('steam').stats.getPlayerRankedStats(
      'account.test123',
      'division.bro.official.pc-2024-season',
    );
    expect(stats).toBeDefined();
    expect(stats.data.type).toBe('playerRankedSeason');
  });

  it('getLifetimeStats() returns lifetime data', async () => {
    const stats = await client.shard('steam').stats.getLifetimeStats('account.test123');
    expect(stats).toBeDefined();
    expect(stats.data.type).toBe('playerSeason');
  });

  it('getBatchPlayerStats() returns stats for multiple players', async () => {
    const stats = await client.shard('steam').stats.getBatchPlayerStats(
      'division.bro.official.pc-2024-season',
      'squad',
      ['account.test123', 'account.test456'],
    );
    expect(stats).toBeDefined();
    expect(stats.data).toBeInstanceOf(Array);
  });

  it('getBatchLifetimeStats() returns lifetime stats for multiple players', async () => {
    const stats = await client.shard('steam').stats.getBatchLifetimeStats(
      'squad',
      ['account.test123', 'account.test456'],
    );
    expect(stats).toBeDefined();
    expect(stats.data).toBeInstanceOf(Array);
  });
});

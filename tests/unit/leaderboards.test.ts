import { describe, it, expect } from 'vitest';
import { PubgClient } from '../../src/client/pubg.client';

const client = new PubgClient({ apiKey: 'test-api-key', rateLimit: false, cache: false });

describe('LeaderboardsResource', () => {
  it('get() returns leaderboard response', async () => {
    const lb = await client.shard('steam').leaderboards.get(
      'division.bro.official.pc-2024-season',
      'squad',
    );
    expect(lb.data.type).toBe('leaderboard');
    expect(lb.data.attributes.gameMode).toBe('squad');
    expect(lb.data.attributes.seasonId).toBe('division.bro.official.pc-2024-season');
  });

  it('get() includes top player', async () => {
    const lb = await client.shard('steam').leaderboards.get(
      'division.bro.official.pc-2024-season',
      'squad',
    );
    expect(lb.included).toBeDefined();
    expect(lb.included![0].attributes.name).toBe('TopPlayer');
    expect(lb.included![0].attributes.rank).toBe(1);
  });

  it('get() accepts optional page parameter', async () => {
    const lb = await client.shard('steam').leaderboards.get(
      'division.bro.official.pc-2024-season',
      'squad',
      2,
    );
    expect(lb.data).toBeDefined();
  });
});

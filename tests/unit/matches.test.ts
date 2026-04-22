import { describe, it, expect } from 'vitest';
import { PubgClient } from '../../src/client/pubg.client';
import { PubgNotFoundError } from '../../src/errors';

const client = new PubgClient({ apiKey: 'test-api-key', rateLimit: false, cache: false });

describe('MatchesResource', () => {
  it('get() returns match response', async () => {
    const match = await client.shard('steam').matches.get('match-abc-123');
    expect(match.data.type).toBe('match');
    expect(match.data.id).toBe('match-abc-123');
    expect(match.data.attributes.gameMode).toBe('squad');
    expect(match.data.attributes.mapName).toBe('Baltic_Main');
    expect(match.data.attributes.duration).toBe(1800);
  });

  it('get() includes expected attributes', async () => {
    const match = await client.shard('steam').matches.get('match-xyz-456');
    expect(match.data.attributes.createdAt).toBeDefined();
    expect(match.data.attributes.shardId).toBe('steam');
  });

  it('get() throws PubgNotFoundError for missing match', async () => {
    await expect(
      client.shard('steam').matches.get('not-found-match'),
    ).rejects.toThrow(PubgNotFoundError);
  });
});

import { describe, it, expect } from 'vitest';
import { PubgClient } from '../../src/client/pubg.client';
import { PubgNotFoundError } from '../../src/errors';

const client = new PubgClient({ apiKey: 'test-api-key', rateLimit: false, cache: false });

describe('PlayersResource', () => {
  it('getByNames() returns players array', async () => {
    const players = await client.shard('steam').players.getByNames(['TestPlayer']);
    expect(players).toHaveLength(1);
    expect(players[0].type).toBe('player');
    expect(players[0].attributes.name).toBe('TestPlayer');
  });

  it('getByIds() returns players array', async () => {
    const players = await client.shard('steam').players.getByIds(['account.test123']);
    expect(players).toHaveLength(1);
    expect(players[0].id).toBe('account.test123');
  });

  it('getById() returns a single player', async () => {
    const player = await client.shard('steam').players.getById('account.test123');
    expect(player.id).toBe('account.test123');
    expect(player.type).toBe('player');
  });

  it('getByNames() throws PubgNotFoundError when player not found', async () => {
    await expect(
      client.shard('steam').players.getByNames(['NotFound']),
    ).rejects.toThrow(PubgNotFoundError);
  });
});

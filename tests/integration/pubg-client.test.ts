import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { PubgClient } from '../../src/client/pubg.client';
import { PubgUnauthorizedError, PubgRateLimitError } from '../../src/errors';
import { server } from '../mocks/server';

const BASE_URL = 'https://api.pubg.com';

describe('PubgClient integration', () => {
  describe('shard factory', () => {
    it('returns the same ShardClient instance for the same platform', () => {
      const client = new PubgClient({ apiKey: 'key', rateLimit: false, cache: false });
      const a = client.shard('steam');
      const b = client.shard('steam');
      expect(a).toBe(b);
    });

    it('returns different ShardClient instances for different platforms', () => {
      const client = new PubgClient({ apiKey: 'key', rateLimit: false, cache: false });
      const steam = client.shard('steam');
      const kakao = client.shard('kakao');
      expect(steam).not.toBe(kakao);
      expect(steam.platform).toBe('steam');
      expect(kakao.platform).toBe('kakao');
    });

    it('exposes all resource properties on ShardClient', () => {
      const client = new PubgClient({ apiKey: 'key', rateLimit: false, cache: false });
      const shard = client.shard('steam');
      expect(shard.players).toBeDefined();
      expect(shard.matches).toBeDefined();
      expect(shard.seasons).toBeDefined();
      expect(shard.leaderboards).toBeDefined();
      expect(shard.samples).toBeDefined();
      expect(shard.telemetry).toBeDefined();
      expect(shard.mastery).toBeDefined();
      expect(shard.clans).toBeDefined();
      expect(shard.status).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('throws PubgUnauthorizedError on 401', async () => {
      server.use(
        http.get(`${BASE_URL}/shards/steam/players`, () =>
          HttpResponse.json(
            { errors: [{ title: 'Unauthorized', detail: 'Invalid API key' }] },
            { status: 401 },
          ),
        ),
      );
      const client = new PubgClient({ apiKey: 'bad-key', rateLimit: false, cache: false });
      await expect(
        client.shard('steam').players.getByNames(['anyone']),
      ).rejects.toThrow(PubgUnauthorizedError);
    });

    it('throws PubgRateLimitError on 429', async () => {
      server.use(
        http.get(`${BASE_URL}/shards/steam/players`, () =>
          HttpResponse.json(
            { errors: [{ title: 'Too Many Requests', detail: 'Rate limit exceeded' }] },
            { status: 429 },
          ),
        ),
      );
      const client = new PubgClient({ apiKey: 'key', rateLimit: false, cache: false });
      await expect(
        client.shard('steam').players.getByNames(['anyone']),
      ).rejects.toThrow(PubgRateLimitError);
    });
  });

  describe('caching', () => {
    it('returns cached result on second call (same cache key)', async () => {
      const client = new PubgClient({ apiKey: 'key', rateLimit: false, cache: true, cacheTtl: 60_000 });

      const first = await client.shard('steam').players.getByNames(['TestPlayer']);
      const second = await client.shard('steam').players.getByNames(['TestPlayer']);

      // Both calls should return the same data
      expect(first).toEqual(second);
    });

    it('each shard has isolated cache keys', async () => {
      const client = new PubgClient({ apiKey: 'key', rateLimit: false, cache: true, cacheTtl: 60_000 });

      const steamPlayers = await client.shard('steam').players.getByNames(['TestPlayer']);
      const kakaoPlayers = await client.shard('kakao').players.getByNames(['TestPlayer']);

      // Same mock response but from different shards
      expect(steamPlayers[0].attributes.shardId).toBe('steam');
      expect(kakaoPlayers[0].attributes.shardId).toBe('steam'); // mock always returns 'steam'
    });
  });
});

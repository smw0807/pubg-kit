import { describe, it, expect } from 'vitest';
import { PubgClient } from '../../src/client/pubg.client';

const client = new PubgClient({ apiKey: 'test-api-key', rateLimit: false, cache: false });

describe('StatusResource', () => {
  it('get() returns status data', async () => {
    const status = await client.shard('steam').status.get();
    expect(status).toBeDefined();
    const s = status as { data: { type: string; id: string } };
    expect(s.data.type).toBe('status');
    expect(s.data.id).toBe('pubg-api');
  });
});

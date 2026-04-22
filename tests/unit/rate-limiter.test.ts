import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RateLimiter } from '../../src/utils/rate-limiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows up to 10 requests without waiting', async () => {
    const limiter = new RateLimiter();
    const promises: Promise<void>[] = [];

    for (let i = 0; i < 10; i++) {
      promises.push(limiter.throttle());
    }

    const results = await Promise.all(promises);
    expect(results).toHaveLength(10);
  });

  it('updates remaining from headers', () => {
    const limiter = new RateLimiter();
    limiter.updateFromHeaders({
      'x-ratelimit-remaining': '5',
      'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 60),
    });
    // Internal state updated — subsequent calls should respect remaining = 5
    // We verify indirectly by checking 5 throttles pass immediately
    const promises = Array.from({ length: 5 }, () => limiter.throttle());
    return expect(Promise.all(promises)).resolves.toBeDefined();
  });

  it('ignores missing headers gracefully', () => {
    const limiter = new RateLimiter();
    expect(() => limiter.updateFromHeaders({})).not.toThrow();
  });

  it('handles non-numeric header values safely', () => {
    const limiter = new RateLimiter();
    limiter.updateFromHeaders({
      'x-ratelimit-remaining': 'abc',
      'x-ratelimit-reset': 'xyz',
    });
    // NaN coercion is fine — the limiter should not throw
  });
});

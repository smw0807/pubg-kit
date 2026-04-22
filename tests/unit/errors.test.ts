import { describe, it, expect } from 'vitest';
import {
  PubgApiError,
  PubgNotFoundError,
  PubgRateLimitError,
  PubgUnauthorizedError,
  handleAxiosError,
} from '../../src/errors';

describe('Error classes', () => {
  it('PubgApiError stores status, title, detail', () => {
    const err = new PubgApiError(500, 'Server Error', 'Something went wrong');
    expect(err.status).toBe(500);
    expect(err.title).toBe('Server Error');
    expect(err.detail).toBe('Something went wrong');
    expect(err.message).toBe('Something went wrong');
    expect(err.name).toBe('PubgApiError');
    expect(err).toBeInstanceOf(Error);
  });

  it('PubgNotFoundError has status 404', () => {
    const err = new PubgNotFoundError('Not found');
    expect(err.status).toBe(404);
    expect(err.name).toBe('PubgNotFoundError');
    expect(err).toBeInstanceOf(PubgApiError);
  });

  it('PubgRateLimitError has status 429', () => {
    const err = new PubgRateLimitError('Rate limited');
    expect(err.status).toBe(429);
    expect(err.name).toBe('PubgRateLimitError');
  });

  it('PubgUnauthorizedError has status 401', () => {
    const err = new PubgUnauthorizedError('Unauthorized');
    expect(err.status).toBe(401);
    expect(err.name).toBe('PubgUnauthorizedError');
  });
});

describe('handleAxiosError', () => {
  const makeAxiosError = (status: number, errors?: Array<{ title: string; detail: string }>) => ({
    response: {
      status,
      data: { errors },
    },
  });

  it('throws PubgUnauthorizedError for 401', () => {
    expect(() =>
      handleAxiosError(makeAxiosError(401, [{ title: 'Unauthorized', detail: 'Bad key' }])),
    ).toThrow(PubgUnauthorizedError);
  });

  it('throws PubgNotFoundError for 404', () => {
    expect(() =>
      handleAxiosError(makeAxiosError(404, [{ title: 'Not Found', detail: 'No resource' }])),
    ).toThrow(PubgNotFoundError);
  });

  it('throws PubgRateLimitError for 429', () => {
    expect(() =>
      handleAxiosError(makeAxiosError(429, [{ title: 'Too Many Requests', detail: 'Slow down' }])),
    ).toThrow(PubgRateLimitError);
  });

  it('throws PubgApiError for other status codes', () => {
    expect(() =>
      handleAxiosError(makeAxiosError(500, [{ title: 'Server Error', detail: 'Internal' }])),
    ).toThrow(PubgApiError);
  });

  it('uses fallback messages when errors array is missing', () => {
    try {
      handleAxiosError(makeAxiosError(500));
    } catch (e) {
      expect(e).toBeInstanceOf(PubgApiError);
      expect((e as PubgApiError).title).toBe('Unknown Error');
    }
  });

  it('re-throws non-axios errors as-is', () => {
    const raw = new TypeError('network failure');
    expect(() => handleAxiosError(raw)).toThrow(TypeError);
  });
});

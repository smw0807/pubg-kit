import { describe, it, expect, beforeEach } from 'vitest';
import { CacheStore } from '../../src/utils/cache';

describe('CacheStore', () => {
  let cache: CacheStore;

  beforeEach(() => {
    cache = new CacheStore({ ttl: 60_000 });
  });

  it('stores and retrieves a value', () => {
    cache.set('key1', { name: 'test' });
    expect(cache.get('key1')).toEqual({ name: 'test' });
  });

  it('returns undefined for missing key', () => {
    expect(cache.get('missing')).toBeUndefined();
  });

  it('has() returns true for existing key', () => {
    cache.set('key2', 'value');
    expect(cache.has('key2')).toBe(true);
  });

  it('has() returns false for missing key', () => {
    expect(cache.has('missing')).toBe(false);
  });

  it('delete() removes the key', () => {
    cache.set('key3', 'value');
    cache.delete('key3');
    expect(cache.has('key3')).toBe(false);
  });

  it('clear() removes all keys', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.has('a')).toBe(false);
    expect(cache.has('b')).toBe(false);
  });

  it('stores value with custom per-entry TTL', () => {
    cache.set('key4', 'val', 999_000);
    expect(cache.get('key4')).toBe('val');
  });

  it('evicts oldest entry when max is exceeded', () => {
    const smallCache = new CacheStore({ ttl: 60_000, max: 2 });
    smallCache.set('a', 1);
    smallCache.set('b', 2);
    smallCache.set('c', 3); // should evict 'a'
    expect(smallCache.has('a')).toBe(false);
    expect(smallCache.has('b')).toBe(true);
    expect(smallCache.has('c')).toBe(true);
  });
});

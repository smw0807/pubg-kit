import { LRUCache } from 'lru-cache';

export interface CacheStoreOptions {
  ttl: number;
  max?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCache = LRUCache<string, any>;

export class CacheStore {
  private readonly store: AnyCache;

  constructor(options: CacheStoreOptions) {
    this.store = new LRUCache<string, object>({
      max: options.max ?? 500,
      ttl: options.ttl,
    }) as AnyCache;
  }

  get<T>(key: string): T | undefined {
    return this.store.get(key) as T | undefined;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.store.set(key, value, ttl !== undefined ? { ttl } : undefined);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

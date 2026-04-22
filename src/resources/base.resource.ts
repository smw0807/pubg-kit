import { type AxiosInstance } from 'axios';
import { type CacheStore } from '../utils/cache';
import { type PlatformShard } from '../types/common.types';
import { handleAxiosError } from '../errors';

export abstract class BaseResource {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly shard: PlatformShard,
    protected readonly cache: CacheStore | null,
  ) {}

  protected get shardPath(): string {
    return `/shards/${this.shard}`;
  }

  protected async request<T>(
    url: string,
    cacheKey?: string,
    cacheTtl?: number,
  ): Promise<T> {
    if (cacheKey && this.cache?.has(cacheKey)) {
      return this.cache.get<T>(cacheKey)!;
    }

    try {
      const response = await this.http.get<T>(url);
      if (cacheKey && this.cache) {
        this.cache.set(cacheKey, response.data, cacheTtl);
      }
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
}

import axios, { type AxiosInstance } from 'axios';
import { RateLimiter } from '../utils/rate-limiter';
import { CacheStore } from '../utils/cache';
import { ShardClient } from './shard.client';
import { type PubgClientOptions, DEFAULT_OPTIONS } from './client.options';
import { type PlatformShard } from '../types/common.types';

export class PubgClient {
  private readonly http: AxiosInstance;
  private readonly rateLimiter: RateLimiter | null;
  private readonly cache: CacheStore | null;
  private readonly shardCache = new Map<PlatformShard, ShardClient>();

  constructor(options: PubgClientOptions) {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    this.http = axios.create({
      baseURL: 'https://api.pubg.com',
      timeout: opts.timeout,
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        Accept: 'application/vnd.api+json',
      },
    });

    this.rateLimiter = opts.rateLimit ? new RateLimiter() : null;
    this.cache = opts.cache ? new CacheStore({ ttl: opts.cacheTtl ?? DEFAULT_OPTIONS.cacheTtl }) : null;

    if (this.rateLimiter) {
      this.http.interceptors.request.use(async (config) => {
        await this.rateLimiter!.throttle();
        return config;
      });

      this.http.interceptors.response.use((response) => {
        this.rateLimiter!.updateFromHeaders(response.headers as Record<string, unknown>);
        return response;
      });
    }
  }

  shard(platform: PlatformShard): ShardClient {
    if (!this.shardCache.has(platform)) {
      this.shardCache.set(
        platform,
        new ShardClient(this.http, platform, this.cache),
      );
    }
    return this.shardCache.get(platform)!;
  }

  getHttp(): AxiosInstance {
    return this.http;
  }
}

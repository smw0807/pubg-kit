import { BaseResource } from './base.resource';

const TTL_30SEC = 30 * 1000;

export class StatusResource extends BaseResource {
  async get(): Promise<unknown> {
    const cacheKey = `status:${this.shard}`;
    return this.request('/status', cacheKey, TTL_30SEC);
  }
}

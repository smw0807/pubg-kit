import { BaseResource } from './base.resource';
import { type StatusResponse } from '../types/status.types';

const TTL_30SEC = 30 * 1000;

export class StatusResource extends BaseResource {
  async get(): Promise<StatusResponse> {
    const cacheKey = `status:${this.shard}`;
    return this.request<StatusResponse>('/status', cacheKey, TTL_30SEC);
  }
}

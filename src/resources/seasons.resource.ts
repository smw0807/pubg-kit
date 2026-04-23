import { BaseResource } from './base.resource';
import { SeasonsResponseSchema, type Season, type SeasonsResponse } from '../types/season.types';

const TTL_1HOUR = 60 * 60 * 1000;

export class SeasonsResource extends BaseResource {
  async getAll(): Promise<Season[]> {
    const url = `${this.shardPath}/seasons`;
    const cacheKey = `seasons:all:${this.shard}`;
    const data = await this.request<SeasonsResponse>(url, cacheKey, TTL_1HOUR);
    return SeasonsResponseSchema.parse(data).data;
  }
}

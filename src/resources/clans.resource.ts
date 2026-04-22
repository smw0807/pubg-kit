import { BaseResource } from './base.resource';
import { ClanResponseSchema, type ClanResponse } from '../types/clan.types';

const TTL_5MIN = 5 * 60 * 1000;

export class ClansResource extends BaseResource {
  async get(clanId: string): Promise<ClanResponse> {
    const url = `${this.shardPath}/clans/${clanId}`;
    const cacheKey = `clans:${this.shard}:${clanId}`;
    const data = await this.request<ClanResponse>(url, cacheKey, TTL_5MIN);
    return ClanResponseSchema.parse(data);
  }
}

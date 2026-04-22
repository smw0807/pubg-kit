import { BaseResource } from './base.resource';
import { MatchResponseSchema, type MatchResponse } from '../types/match.types';

export class MatchesResource extends BaseResource {
  async get(matchId: string): Promise<MatchResponse> {
    const url = `${this.shardPath}/matches/${matchId}`;
    // Match data is immutable — cache permanently (24h as practical max)
    const cacheKey = `matches:${this.shard}:${matchId}`;
    const data = await this.request<MatchResponse>(url, cacheKey, Infinity);
    return MatchResponseSchema.parse(data);
  }
}

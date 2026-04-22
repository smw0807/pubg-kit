import { BaseResource } from './base.resource';
import { LeaderboardResponseSchema, type LeaderboardResponse } from '../types/leaderboard.types';
import { type GameMode } from '../types/common.types';

const TTL_10MIN = 10 * 60 * 1000;

export class LeaderboardsResource extends BaseResource {
  async get(seasonId: string, gameMode: GameMode, page?: number): Promise<LeaderboardResponse> {
    const url = `${this.shardPath}/leaderboards/${seasonId}/${gameMode}${page !== undefined ? `?page[number]=${page}` : ''}`;
    const cacheKey = `leaderboards:${this.shard}:${seasonId}:${gameMode}:${page ?? 0}`;
    const data = await this.request<LeaderboardResponse>(url, cacheKey, TTL_10MIN);
    return LeaderboardResponseSchema.parse(data);
  }
}

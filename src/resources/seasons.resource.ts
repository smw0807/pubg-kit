import { BaseResource } from './base.resource';
import { SeasonsResponseSchema, type Season, type SeasonsResponse } from '../types/season.types';

const TTL_1HOUR = 60 * 60 * 1000;
const TTL_5MIN = 5 * 60 * 1000;

export class SeasonsResource extends BaseResource {
  async getAll(): Promise<Season[]> {
    const url = `${this.shardPath}/seasons`;
    const cacheKey = `seasons:all:${this.shard}`;
    const data = await this.request<SeasonsResponse>(url, cacheKey, TTL_1HOUR);
    return SeasonsResponseSchema.parse(data).data;
  }

  async getPlayerStats(playerId: string, seasonId: string): Promise<unknown> {
    const url = `${this.shardPath}/players/${playerId}/seasons/${seasonId}`;
    const cacheKey = `seasons:stats:${this.shard}:${playerId}:${seasonId}`;
    return this.request(url, cacheKey, TTL_5MIN);
  }

  async getLifetimeStats(playerId: string): Promise<unknown> {
    const url = `${this.shardPath}/players/${playerId}/seasons/lifetime`;
    const cacheKey = `seasons:lifetime:${this.shard}:${playerId}`;
    return this.request(url, cacheKey, TTL_5MIN);
  }

  async getRankedStats(seasonId: string, gameMode: string): Promise<unknown> {
    const url = `${this.shardPath}/seasons/${seasonId}/gameMode/${gameMode}/players`;
    const cacheKey = `seasons:ranked:${this.shard}:${seasonId}:${gameMode}`;
    return this.request(url, cacheKey, TTL_5MIN);
  }
}

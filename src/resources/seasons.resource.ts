import { BaseResource } from './base.resource';
import {
  SeasonsResponseSchema,
  type Season,
  type SeasonsResponse,
  type PlayerSeasonResponse,
  type PlayerRankedSeasonResponse,
  type BatchPlayerStatsResponse,
} from '../types/season.types';

const TTL_1HOUR = 60 * 60 * 1000;
const TTL_5MIN = 5 * 60 * 1000;

export class SeasonsResource extends BaseResource {
  async getAll(): Promise<Season[]> {
    const url = `${this.shardPath}/seasons`;
    const cacheKey = `seasons:all:${this.shard}`;
    const data = await this.request<SeasonsResponse>(url, cacheKey, TTL_1HOUR);
    return SeasonsResponseSchema.parse(data).data;
  }

  async getPlayerStats(playerId: string, seasonId: string): Promise<PlayerSeasonResponse> {
    const url = `${this.shardPath}/players/${playerId}/seasons/${seasonId}`;
    const cacheKey = `seasons:stats:${this.shard}:${playerId}:${seasonId}`;
    return this.request<PlayerSeasonResponse>(url, cacheKey, TTL_5MIN);
  }

  async getPlayerRankedStats(playerId: string, seasonId: string): Promise<PlayerRankedSeasonResponse> {
    const url = `${this.shardPath}/players/${playerId}/seasons/${seasonId}/ranked`;
    const cacheKey = `seasons:ranked-player:${this.shard}:${playerId}:${seasonId}`;
    return this.request<PlayerRankedSeasonResponse>(url, cacheKey, TTL_5MIN);
  }

  async getLifetimeStats(playerId: string): Promise<PlayerSeasonResponse> {
    const url = `${this.shardPath}/players/${playerId}/seasons/lifetime`;
    const cacheKey = `seasons:lifetime:${this.shard}:${playerId}`;
    return this.request<PlayerSeasonResponse>(url, cacheKey, TTL_5MIN);
  }

  async getBatchPlayerStats(seasonId: string, gameMode: string, playerIds: string[]): Promise<BatchPlayerStatsResponse> {
    const ids = playerIds.join(',');
    const url = `${this.shardPath}/seasons/${seasonId}/gameMode/${gameMode}/players?filter[playerIds]=${ids}`;
    const cacheKey = `seasons:batch:${this.shard}:${seasonId}:${gameMode}:${playerIds.sort().join(',')}`;
    return this.request<BatchPlayerStatsResponse>(url, cacheKey, TTL_5MIN);
  }

  async getBatchLifetimeStats(gameMode: string, playerIds: string[]): Promise<BatchPlayerStatsResponse> {
    const ids = playerIds.join(',');
    const url = `${this.shardPath}/seasons/lifetime/gameMode/${gameMode}/players?filter[playerIds]=${ids}`;
    const cacheKey = `seasons:batch-lifetime:${this.shard}:${gameMode}:${playerIds.sort().join(',')}`;
    return this.request<BatchPlayerStatsResponse>(url, cacheKey, TTL_5MIN);
  }
}

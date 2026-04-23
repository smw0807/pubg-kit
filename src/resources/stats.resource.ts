import { BaseResource } from './base.resource';
import {
  type PlayerSeasonResponse,
  type PlayerRankedSeasonResponse,
  type BatchPlayerStatsResponse,
} from '../types/stats.types';

const TTL_5MIN = 5 * 60 * 1000;

export class StatsResource extends BaseResource {
  async getPlayerStats(playerId: string, seasonId: string): Promise<PlayerSeasonResponse> {
    const url = `${this.shardPath}/players/${playerId}/seasons/${seasonId}`;
    const cacheKey = `stats:season:${this.shard}:${playerId}:${seasonId}`;
    return this.request<PlayerSeasonResponse>(url, cacheKey, TTL_5MIN);
  }

  async getPlayerRankedStats(playerId: string, seasonId: string): Promise<PlayerRankedSeasonResponse> {
    const url = `${this.shardPath}/players/${playerId}/seasons/${seasonId}/ranked`;
    const cacheKey = `stats:ranked:${this.shard}:${playerId}:${seasonId}`;
    return this.request<PlayerRankedSeasonResponse>(url, cacheKey, TTL_5MIN);
  }

  async getLifetimeStats(playerId: string): Promise<PlayerSeasonResponse> {
    const url = `${this.shardPath}/players/${playerId}/seasons/lifetime`;
    const cacheKey = `stats:lifetime:${this.shard}:${playerId}`;
    return this.request<PlayerSeasonResponse>(url, cacheKey, TTL_5MIN);
  }

  async getBatchPlayerStats(seasonId: string, gameMode: string, playerIds: string[]): Promise<BatchPlayerStatsResponse> {
    const ids = playerIds.join(',');
    const url = `${this.shardPath}/seasons/${seasonId}/gameMode/${gameMode}/players?filter[playerIds]=${ids}`;
    const cacheKey = `stats:batch:${this.shard}:${seasonId}:${gameMode}:${playerIds.sort().join(',')}`;
    return this.request<BatchPlayerStatsResponse>(url, cacheKey, TTL_5MIN);
  }

  async getBatchLifetimeStats(gameMode: string, playerIds: string[]): Promise<BatchPlayerStatsResponse> {
    const ids = playerIds.join(',');
    const url = `${this.shardPath}/seasons/lifetime/gameMode/${gameMode}/players?filter[playerIds]=${ids}`;
    const cacheKey = `stats:batch-lifetime:${this.shard}:${gameMode}:${playerIds.sort().join(',')}`;
    return this.request<BatchPlayerStatsResponse>(url, cacheKey, TTL_5MIN);
  }
}

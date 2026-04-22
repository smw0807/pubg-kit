import { BaseResource } from './base.resource';
import { PlayersResponseSchema, type PlayersResponse, type Player } from '../types/player.types';

const TTL_5MIN = 5 * 60 * 1000;

export class PlayersResource extends BaseResource {
  async getByNames(names: string[]): Promise<Player[]> {
    const url = `${this.shardPath}/players?filter[playerNames]=${names.join(',')}`;
    const cacheKey = `players:names:${this.shard}:${names.sort().join(',')}`;
    const data = await this.request<PlayersResponse>(url, cacheKey, TTL_5MIN);
    return PlayersResponseSchema.parse(data).data;
  }

  async getByIds(ids: string[]): Promise<Player[]> {
    const url = `${this.shardPath}/players?filter[playerIds]=${ids.join(',')}`;
    const cacheKey = `players:ids:${this.shard}:${ids.sort().join(',')}`;
    const data = await this.request<PlayersResponse>(url, cacheKey, TTL_5MIN);
    return PlayersResponseSchema.parse(data).data;
  }

  async getById(id: string): Promise<Player> {
    const url = `${this.shardPath}/players/${id}`;
    const cacheKey = `players:id:${this.shard}:${id}`;
    const data = await this.request<{ data: Player }>(url, cacheKey, TTL_5MIN);
    return data.data;
  }
}

import { BaseResource } from './base.resource';
import {
  WeaponMasteryResponseSchema,
  SurvivalMasteryResponseSchema,
  type WeaponMasteryResponse,
  type SurvivalMasteryResponse,
} from '../types/mastery.types';

const TTL_5MIN = 5 * 60 * 1000;

export class MasteryResource extends BaseResource {
  async getWeapon(playerId: string): Promise<WeaponMasteryResponse> {
    const url = `${this.shardPath}/players/${playerId}/weapon_mastery`;
    const cacheKey = `mastery:weapon:${this.shard}:${playerId}`;
    const data = await this.request<WeaponMasteryResponse>(url, cacheKey, TTL_5MIN);
    return WeaponMasteryResponseSchema.parse(data);
  }

  async getSurvival(playerId: string): Promise<SurvivalMasteryResponse> {
    const url = `${this.shardPath}/players/${playerId}/survival_mastery`;
    const cacheKey = `mastery:survival:${this.shard}:${playerId}`;
    const data = await this.request<SurvivalMasteryResponse>(url, cacheKey, TTL_5MIN);
    return SurvivalMasteryResponseSchema.parse(data);
  }
}

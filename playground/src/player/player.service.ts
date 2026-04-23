import { Injectable } from '@nestjs/common';
import { PubgService } from 'pubg-kit/nestjs';
import { type PlatformShard } from 'pubg-kit';

@Injectable()
export class PlayerService {
  constructor(private readonly pubg: PubgService) {}

  getByNames(names: string[], platform: PlatformShard) {
    return this.pubg.shard(platform).players.getByNames(names);
  }

  getById(id: string, platform: PlatformShard) {
    return this.pubg.shard(platform).players.getById(id);
  }

  getSeasons(platform: PlatformShard) {
    return this.pubg.shard(platform).seasons.getAll();
  }

  getSeasonStats(playerId: string, seasonId: string, platform: PlatformShard) {
    return this.pubg.shard(platform).stats.getPlayerStats(playerId, seasonId);
  }

  getPlayerRankedStats(playerId: string, seasonId: string, platform: PlatformShard) {
    return this.pubg.shard(platform).stats.getPlayerRankedStats(playerId, seasonId);
  }

  getLifetimeStats(playerId: string, platform: PlatformShard) {
    return this.pubg.shard(platform).stats.getLifetimeStats(playerId);
  }

  getMatch(matchId: string, platform: PlatformShard) {
    return this.pubg.shard(platform).matches.get(matchId);
  }
}

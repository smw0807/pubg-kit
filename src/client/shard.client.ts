import { type AxiosInstance } from 'axios';
import { type CacheStore } from '../utils/cache';
import { type PlatformShard } from '../types/common.types';
import { PlayersResource } from '../resources/players.resource';
import { MatchesResource } from '../resources/matches.resource';
import { SeasonsResource } from '../resources/seasons.resource';
import { StatsResource } from '../resources/stats.resource';
import { LeaderboardsResource } from '../resources/leaderboards.resource';
import { SamplesResource } from '../resources/samples.resource';
import { TelemetryResource } from '../resources/telemetry.resource';
import { MasteryResource } from '../resources/mastery.resource';
import { ClansResource } from '../resources/clans.resource';
import { StatusResource } from '../resources/status.resource';

export class ShardClient {
  readonly players: PlayersResource;
  readonly matches: MatchesResource;
  readonly seasons: SeasonsResource;
  readonly stats: StatsResource;
  readonly leaderboards: LeaderboardsResource;
  readonly samples: SamplesResource;
  readonly telemetry: TelemetryResource;
  readonly mastery: MasteryResource;
  readonly clans: ClansResource;
  readonly status: StatusResource;

  constructor(
    http: AxiosInstance,
    readonly platform: PlatformShard,
    cache: CacheStore | null,
  ) {
    this.players = new PlayersResource(http, platform, cache);
    this.matches = new MatchesResource(http, platform, cache);
    this.seasons = new SeasonsResource(http, platform, cache);
    this.stats = new StatsResource(http, platform, cache);
    this.leaderboards = new LeaderboardsResource(http, platform, cache);
    this.samples = new SamplesResource(http, platform, cache);
    this.telemetry = new TelemetryResource(http, platform, cache);
    this.mastery = new MasteryResource(http, platform, cache);
    this.clans = new ClansResource(http, platform, cache);
    this.status = new StatusResource(http, platform, cache);
  }
}

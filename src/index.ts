// Core client
export { PubgClient } from './client/pubg.client';
export { ShardClient } from './client/shard.client';
export type { PubgClientOptions } from './client/client.options';

// Resources
export { PlayersResource } from './resources/players.resource';
export { MatchesResource } from './resources/matches.resource';
export { SeasonsResource } from './resources/seasons.resource';
export { StatsResource } from './resources/stats.resource';
export { LeaderboardsResource } from './resources/leaderboards.resource';
export { SamplesResource } from './resources/samples.resource';
export { TelemetryResource } from './resources/telemetry.resource';
export { MasteryResource } from './resources/mastery.resource';
export { ClansResource } from './resources/clans.resource';
export { StatusResource } from './resources/status.resource';

// Types
export type {
  PlatformShard,
  GameMode,
  ApiResponse,
  JsonApiResource,
} from './types/common.types';
export type { Player, PlayersResponse } from './types/player.types';
export type {
  SeasonState,
  ShardId,
  MapName,
  MatchType,
  DeathType,
  MatchAttributes,
  Match,
  MatchResponse,
  Participant,
  ParticipantStats,
  Roster,
  RosterStats,
  Asset,
  IncludedItem,
  RosterReference,
  AssetReference,
  ParticipantReference,
} from './types/match.types';
export type { Season, SeasonsResponse } from './types/season.types';
export type {
  GameModeStats,
  PlayerSeasonStats,
  PlayerSeasonResponse,
  RankedTier,
  RankedGameModeStats,
  PlayerRankedSeasonResponse,
  BatchPlayerStatsResponse,
} from './types/stats.types';
export type { LeaderboardPlayer, LeaderboardResponse } from './types/leaderboard.types';
export type {
  TelemetryLocation,
  TelemetryCharacter,
  TelemetryVehicle,
  TelemetryDamageInfo,
  TelemetryEventBase,
  LogPlayerPosition,
  LogPlayerKillV2,
  LogPlayerMakeGroggy,
  LogPlayerTakeDamage,
  TelemetryEvent,
} from './types/telemetry.types';
export type { Clan, ClanResponse } from './types/clan.types';
export type { WeaponSummary, WeaponMasteryResponse, SurvivalMasteryResponse } from './types/mastery.types';
export type { SampleResponse } from './types/sample.types';
export type { StatusResponse } from './types/status.types';

// Errors
export {
  PubgApiError,
  PubgNotFoundError,
  PubgRateLimitError,
  PubgUnauthorizedError,
} from './errors';

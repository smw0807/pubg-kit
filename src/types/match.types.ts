import { z } from 'zod';
import { type GameMode, type PlatformShard } from './common.types';

// --- Enum types ---

export type SeasonState = 'pre-season' | 'progress' | 'closed';

export type ShardId = PlatformShard;

export type MapName =
  | 'Baltic_Main'     // Erangel
  | 'Desert_Main'     // Miramar
  | 'Savage_Main'     // Sanhok
  | 'DihorOtok_Main'  // Vikendi
  | 'Range_Main'      // Camp Jackal / Training
  | 'Summerland_Main' // Karakin
  | 'Tiger_Main'      // Taego
  | 'Kiki_Main'       // Deston
  | 'Neon_Main'       // Rondo
  | (string & {});    // future maps

export type MatchType = 'official' | 'custom' | 'training';

export type DeathType = 'alive' | 'byplayer' | 'byzone' | 'suicide' | 'logout';

// --- Zod schemas (runtime validation) ---

export const MatchAttributesSchema = z.object({
  gameMode: z.string(),
  seasonState: z.string().optional(),
  createdAt: z.string(),
  duration: z.number(),
  stats: z.record(z.unknown()).nullable().optional(),
  titleId: z.string().optional(),
  shardId: z.string(),
  tags: z.array(z.string()).nullable().optional(),
  mapName: z.string(),
  isCustomMatch: z.boolean().optional(),
  matchType: z.string().optional(),
  patchVersion: z.string().optional(),
});

export const RosterReferenceSchema = z.object({
  type: z.literal('roster'),
  id: z.string(),
});

export const AssetReferenceSchema = z.object({
  type: z.literal('asset'),
  id: z.string(),
});

export const ParticipantReferenceSchema = z.object({
  type: z.literal('participant'),
  id: z.string(),
});

export const ParticipantStatsSchema = z.object({
  DBNOs: z.number(),
  assists: z.number(),
  boosts: z.number(),
  damageDealt: z.number(),
  deathType: z.string(),
  headshotKills: z.number(),
  heals: z.number(),
  killPlace: z.number(),
  killStreaks: z.number(),
  kills: z.number(),
  longestKill: z.number(),
  name: z.string(),
  playerId: z.string(),
  revives: z.number(),
  rideDistance: z.number(),
  roadKills: z.number(),
  swimDistance: z.number(),
  teamKills: z.number(),
  timeSurvived: z.number(),
  vehicleDestroys: z.number(),
  walkDistance: z.number(),
  weaponsAcquired: z.number(),
  winPlace: z.number(),
});

export const ParticipantSchema = z.object({
  type: z.literal('participant'),
  id: z.string(),
  attributes: z.object({
    shardId: z.string(),
    stats: ParticipantStatsSchema,
    actor: z.string(),
  }),
});

export const RosterStatsSchema = z.object({
  rank: z.number(),
  teamId: z.number(),
});

export const RosterSchema = z.object({
  type: z.literal('roster'),
  id: z.string(),
  attributes: z.object({
    stats: RosterStatsSchema,
    won: z.string(),
    shardId: z.string(),
  }),
  relationships: z.object({
    team: z.object({
      data: z.object({ type: z.literal('team'), id: z.string() }).nullable(),
    }),
    participants: z.object({
      data: z.array(ParticipantReferenceSchema),
    }),
  }),
});

export const AssetSchema = z.object({
  type: z.literal('asset'),
  id: z.string(),
  attributes: z.object({
    name: z.string(),
    description: z.string(),
    createdAt: z.string(),
    URL: z.string(),
  }),
});

export const IncludedItemSchema = z.discriminatedUnion('type', [
  ParticipantSchema,
  RosterSchema,
  AssetSchema,
]);

export const MatchSchema = z.object({
  type: z.literal('match'),
  id: z.string(),
  attributes: MatchAttributesSchema,
  relationships: z.object({
    rosters: z.object({ data: z.array(RosterReferenceSchema) }).optional(),
    assets: z.object({ data: z.array(AssetReferenceSchema) }).optional(),
  }).optional(),
  links: z.object({ self: z.string(), schema: z.string().optional() }).optional(),
});

export const MatchResponseSchema = z.object({
  data: MatchSchema,
  included: z.array(IncludedItemSchema).optional(),
  links: z.object({ self: z.string() }).optional(),
  meta: z.record(z.unknown()).optional(),
});

// --- Inferred types ---

export type MatchAttributes = z.infer<typeof MatchAttributesSchema>;
export type Match = z.infer<typeof MatchSchema>;

export type ParticipantStats = z.infer<typeof ParticipantStatsSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
export type RosterStats = z.infer<typeof RosterStatsSchema>;
export type Roster = z.infer<typeof RosterSchema>;
export type Asset = z.infer<typeof AssetSchema>;
export type IncludedItem = Participant | Roster | Asset;

export type RosterReference = z.infer<typeof RosterReferenceSchema>;
export type AssetReference = z.infer<typeof AssetReferenceSchema>;
export type ParticipantReference = z.infer<typeof ParticipantReferenceSchema>;

export interface MatchResponse {
  data: Match;
  included?: IncludedItem[];
  links?: { self: string };
  meta?: Record<string, unknown>;
}

export type { GameMode };

import { z } from 'zod';

export const SeasonSchema = z.object({
  type: z.literal('season'),
  id: z.string(),
  attributes: z.object({
    isCurrentSeason: z.boolean(),
    isOffseason: z.boolean(),
  }),
});

export const SeasonsResponseSchema = z.object({
  data: z.array(SeasonSchema),
  links: z.object({ self: z.string() }).optional(),
});

export type Season = z.infer<typeof SeasonSchema>;
export type SeasonsResponse = z.infer<typeof SeasonsResponseSchema>;

export interface GameModeStats {
  assists: number;
  boosts: number;
  dBNOs: number;
  dailyKills: number;
  dailyWins: number;
  damageDealt: number;
  days: number;
  headshotKills: number;
  heals: number;
  killPoints: number;
  kills: number;
  longestKill: number;
  longestTimeSurvived: number;
  losses: number;
  maxKillStreaks: number;
  mostSurvivalTime: number;
  rankPoints: number;
  rankPointsTitle: string;
  revives: number;
  rideDistance: number;
  roadKills: number;
  roundMostKills: number;
  roundsPlayed: number;
  suicides: number;
  swimDistance: number;
  teamKills: number;
  timeSurvived: number;
  top10s: number;
  vehicleDestroys: number;
  walkDistance: number;
  weaponsAcquired: number;
  weeklyKills: number;
  weeklyWins: number;
  winPoints: number;
  wins: number;
}

export interface PlayerSeasonStats {
  gameModeStats: {
    solo?: GameModeStats;
    'solo-fpp'?: GameModeStats;
    duo?: GameModeStats;
    'duo-fpp'?: GameModeStats;
    squad?: GameModeStats;
    'squad-fpp'?: GameModeStats;
  };
}

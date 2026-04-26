import { z } from 'zod';

export const WeaponSummarySchema = z.object({
  XPTotal: z.number(),
  LevelCurrent: z.number(),
  TierCurrent: z.number(),
  StatsTotal: z.object({
    Kills: z.number(),
    DamagePlayer: z.number(),
    HeadShots: z.number(),
    Groggies: z.number(),
    LongestKill: z.number().optional(),
    MostKillsInAGame: z.number(),
  }),
});

export const WeaponMasteryResponseSchema = z.object({
  data: z.object({
    type: z.literal('weaponMasterySummary'),
    id: z.string(),
    attributes: z.object({
      weaponSummaries: z.record(WeaponSummarySchema),
    }),
  }),
});

export const SurvivalMasteryResponseSchema = z.object({
  data: z.object({
    type: z.literal('survivalMasterySummary'),
    id: z.string(),
    attributes: z.object({
      xp: z.number(),
      level: z.number(),
      totalMatchesPlayed: z.number(),
    }),
  }),
});

export type WeaponSummary = z.infer<typeof WeaponSummarySchema>;
export type WeaponMasteryResponse = z.infer<typeof WeaponMasteryResponseSchema>;
export type SurvivalMasteryResponse = z.infer<typeof SurvivalMasteryResponseSchema>;

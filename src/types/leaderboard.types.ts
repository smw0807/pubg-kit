import { z } from 'zod';

export const LeaderboardPlayerSchema = z.object({
  type: z.literal('player'),
  id: z.string(),
  attributes: z.object({
    name: z.string(),
    rank: z.number(),
    stats: z.object({
      rankPoints: z.number(),
      wins: z.number(),
      games: z.number(),
      winRatio: z.number(),
      averageDamage: z.number(),
      kills: z.number(),
      killDeathRatio: z.number(),
      kda: z.number(),
      averageRank: z.number(),
      tier: z.string().optional(),
      subTier: z.string().optional(),
    }),
  }),
});

export const LeaderboardResponseSchema = z.object({
  data: z.object({
    type: z.literal('leaderboard'),
    id: z.string(),
    attributes: z.object({
      shardId: z.string(),
      seasonId: z.string(),
      gameMode: z.string(),
    }),
    relationships: z.object({
      players: z.object({
        data: z.array(z.object({ type: z.string(), id: z.string() })),
      }),
    }),
  }),
  included: z.array(LeaderboardPlayerSchema).optional(),
});

export type LeaderboardPlayer = z.infer<typeof LeaderboardPlayerSchema>;
export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>;

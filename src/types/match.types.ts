import { z } from 'zod';
import { type GameMode } from './common.types';

export const MatchAttributesSchema = z.object({
  createdAt: z.string(),
  duration: z.number(),
  gameMode: z.string(),
  mapName: z.string(),
  isCustomMatch: z.boolean().optional(),
  patchVersion: z.string().optional(),
  seasonState: z.string().optional(),
  shardId: z.string(),
  stats: z.null().optional(),
  tags: z.null().optional(),
  titleId: z.string().optional(),
  telemetryUrl: z.string().optional(),
});

export const MatchSchema = z.object({
  type: z.literal('match'),
  id: z.string(),
  attributes: MatchAttributesSchema,
  relationships: z.object({
    assets: z.object({ data: z.array(z.object({ type: z.string(), id: z.string() })) }).optional(),
    rosters: z.object({ data: z.array(z.object({ type: z.string(), id: z.string() })) }).optional(),
  }).optional(),
});

export const MatchResponseSchema = z.object({
  data: MatchSchema,
  included: z.array(z.record(z.unknown())).optional(),
  links: z.object({ self: z.string() }).optional(),
});

export type MatchAttributes = z.infer<typeof MatchAttributesSchema>;
export type Match = z.infer<typeof MatchSchema>;
export type MatchResponse = z.infer<typeof MatchResponseSchema>;
export type { GameMode };

import { z } from 'zod';

export const PlayerSchema = z.object({
  type: z.literal('player'),
  id: z.string(),
  attributes: z.object({
    name: z.string(),
    shardId: z.string(),
    titleId: z.string().optional(),
    patchVersion: z.string().optional(),
    banType: z.string().optional(),
  }),
  relationships: z.object({
    assets: z.object({ data: z.array(z.object({ type: z.string(), id: z.string() })) }).optional(),
    matches: z.object({ data: z.array(z.object({ type: z.string(), id: z.string() })) }).optional(),
  }).optional(),
  links: z.object({ schema: z.string().optional(), self: z.string().optional() }).optional(),
});

export type Player = z.infer<typeof PlayerSchema>;

export const PlayersResponseSchema = z.object({
  data: z.array(PlayerSchema),
  links: z.object({ self: z.string() }).optional(),
  meta: z.record(z.unknown()).optional(),
});

export type PlayersResponse = z.infer<typeof PlayersResponseSchema>;

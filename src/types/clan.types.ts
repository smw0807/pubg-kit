import { z } from 'zod';

export const ClanSchema = z.object({
  type: z.literal('clan'),
  id: z.string(),
  attributes: z.object({
    clanId: z.string(),
    clanName: z.string(),
    clanTag: z.string(),
    clanLevel: z.number(),
    clanMemberCount: z.number(),
  }),
});

export const ClanResponseSchema = z.object({
  data: ClanSchema,
});

export type Clan = z.infer<typeof ClanSchema>;
export type ClanResponse = z.infer<typeof ClanResponseSchema>;

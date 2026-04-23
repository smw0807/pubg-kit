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

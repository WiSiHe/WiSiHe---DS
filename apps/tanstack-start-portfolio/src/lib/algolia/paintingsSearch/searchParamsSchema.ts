import { z } from 'zod';

export const paintingsSearchSchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  color: z.string().optional(),
  sale: z.string().optional(),
  sort: z.string().optional(),
  p: z.string().optional(),
});

export type PaintingsRouteSearch = z.infer<typeof paintingsSearchSchema>;

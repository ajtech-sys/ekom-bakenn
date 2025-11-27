import { z } from "zod"

export const PostAdminCreateBrand = z.object({
  name: z.string(),
  handle: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})
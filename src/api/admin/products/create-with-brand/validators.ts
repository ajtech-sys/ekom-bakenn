import { z } from "zod"

export const PostAdminCreateProductWithBrand = z.object({
  product: z.object({
    title: z.string(),
    description: z.string().optional(),
    handle: z.string().optional(),
  }),
  brand_id: z.string().optional(),
  brand_handle: z.string().optional(),
}).refine((data) => !!data.brand_id || !!data.brand_handle || true, {
  message: "brand_id or brand_handle optional",
})
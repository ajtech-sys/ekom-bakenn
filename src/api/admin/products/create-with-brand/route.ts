import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import createProductWithBrandWorkflow from "../../../../workflows/product/create-product-with-brand"
import { z } from "zod"
import { PostAdminCreateProductWithBrand } from "./validators"

export async function POST(
  req: MedusaRequest<z.infer<typeof PostAdminCreateProductWithBrand>>,
  res: MedusaResponse
) {
  const { result } = await createProductWithBrandWorkflow(req.scope).run({ input: req.validatedBody })
  res.status(201).json(result)
}
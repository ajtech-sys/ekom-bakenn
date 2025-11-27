import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BRAND_MODULE } from "../../../modules/brand"
import createBrandWorkflow from "../../../workflows/brand/create-brand"
import { z } from "zod"
import { PostAdminCreateBrand } from "./validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const {
    data: brands,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "brand",
    ...req.queryConfig,
  })

  res.json({ brands, count, limit: take, offset: skip })
}

export async function POST(
  req: MedusaRequest<z.infer<typeof PostAdminCreateBrand>>,
  res: MedusaResponse
) {
  const { result } = await createBrandWorkflow(req.scope).run({ input: req.validatedBody })
  res.status(201).json({ brand: result })
}
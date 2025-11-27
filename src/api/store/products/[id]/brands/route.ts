import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import getProductBrandsWorkflow from "../../../../../workflows/brand/get-product-brands"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await getProductBrandsWorkflow(req.scope).run({ input: { product_id: req.params.id } })
  res.json({ brands: result })
}
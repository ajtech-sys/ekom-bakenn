import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BRAND_MODULE } from "../../../../../modules/brand"
import { Modules } from "@medusajs/framework/utils"
import BrandModuleService from "../../../../../modules/brand/service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const productId = req.params.id
  const brandService = req.scope.resolve(BRAND_MODULE) as BrandModuleService
  const body = req.body as any
  const brand = await brandService.retrieveBrand(body.brand_id)
  const link = req.scope.resolve("link")
  await link.create({
    [Modules.PRODUCT]: { product_id: productId },
    [BRAND_MODULE]: { brand_id: brand.id },
  })
  res.sendStatus(204)
}
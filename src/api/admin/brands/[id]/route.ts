import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BRAND_MODULE } from "../../../../modules/brand"
import BrandModuleService from "../../../../modules/brand/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brandService = req.scope.resolve(BRAND_MODULE) as BrandModuleService
  const brand = await brandService.retrieveBrand(req.params.id)
  res.json(brand)
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const brandService = req.scope.resolve(BRAND_MODULE) as BrandModuleService
  const body = req.body as any
  const updated = await brandService.updateBrands([{ id: req.params.id, ...body }])
  res.json(updated[0])
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const brandService = req.scope.resolve(BRAND_MODULE) as BrandModuleService
  await brandService.deleteBrands([req.params.id])
  res.sendStatus(204)
}
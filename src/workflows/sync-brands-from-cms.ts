import { createStep, createWorkflow, transform, WorkflowResponse, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CMS_MODULE } from "../modules/cms"
import { BRAND_MODULE } from "../modules/brand"
import BrandModuleService from "../modules/brand/service"

type CreateBrand = { name: string }
type UpdateBrand = { id: string; name: string }

const retrieveBrandsFromCmsStep = createStep(
  "retrieve-brands-from-cms",
  async (_, { container }) => {
    const cmsModuleService: any = container.resolve(CMS_MODULE)
    const brands = await cmsModuleService.retrieveBrands()
    return new StepResponse(brands)
  }
)

const createBrandsStep = createStep(
  "create-brands-step",
  async ({ brands }: { brands: CreateBrand[] }, { container }) => {
    const brandModuleService = container.resolve(BRAND_MODULE) as BrandModuleService
    const created = await brandModuleService.createBrands(brands)
    return new StepResponse(created, created)
  },
  async (created, { container }) => {
    if (!created) {
      return
    }
    const brandModuleService = container.resolve(BRAND_MODULE) as BrandModuleService
    await brandModuleService.deleteBrands(created.map((b: any) => b.id))
  }
)

const updateBrandsStep = createStep(
  "update-brands-step",
  async ({ brands }: { brands: UpdateBrand[] }, { container }) => {
    const brandModuleService = container.resolve(BRAND_MODULE) as BrandModuleService
    const prev = await brandModuleService.listBrands({ id: brands.map((b) => b.id) })
    const updated = await brandModuleService.updateBrands(brands)
    return new StepResponse(updated, prev)
  },
  async (prev, { container }) => {
    if (!prev) {
      return
    }
    const brandModuleService = container.resolve(BRAND_MODULE) as BrandModuleService
    await brandModuleService.updateBrands(prev as any)
  }
)

export const syncBrandsFromCmsWorkflow = createWorkflow("sync-brands-from-system", () => {
  const brands = retrieveBrandsFromCmsStep()

  const { toCreate, toUpdate } = transform({ brands }, (data: any) => {
    const toCreate: CreateBrand[] = []
    const toUpdate: UpdateBrand[] = []
    ;(data.brands || []).forEach((brand: any) => {
      if (brand.external_id) {
        toUpdate.push({ id: brand.external_id as string, name: brand.name as string })
      } else {
        toCreate.push({ name: brand.name as string })
      }
    })
    return { toCreate, toUpdate }
  })

  const created = createBrandsStep({ brands: toCreate })
  const updated = updateBrandsStep({ brands: toUpdate })

  return new WorkflowResponse({ created, updated })
})
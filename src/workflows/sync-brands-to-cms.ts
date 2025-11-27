import { createStep, createWorkflow, WorkflowResponse, StepResponse } from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { CMS_MODULE } from "../modules/cms"

type BrandRecord = { id: string; name?: string; [key: string]: any }

const syncBrandToCmsStep = createStep(
  "sync-brand-to-cms",
  async ({ brand }: { brand: BrandRecord }, { container }) => {
    const cmsModuleService: any = container.resolve(CMS_MODULE)
    await cmsModuleService.createBrand(brand)
    return new StepResponse(null, brand.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }
    const cmsModuleService: any = container.resolve(CMS_MODULE)
    await cmsModuleService.deleteBrand(id as string)
  }
)

type SyncBrandToCmsWorkflowInput = { id: string }

export const syncBrandToCmsWorkflow = createWorkflow(
  "sync-brand-to-cms",
  (input: SyncBrandToCmsWorkflowInput) => {
    const { data: brands } = useQueryGraphStep({
      entity: "brand",
      fields: ["*"],
      filters: { id: input.id },
      options: { throwIfKeyNotFound: true },
    })

    syncBrandToCmsStep({ brand: brands[0] as BrandRecord })

    return new WorkflowResponse({})
  }
)
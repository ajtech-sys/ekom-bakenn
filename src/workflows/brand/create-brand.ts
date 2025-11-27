import { createStep, createWorkflow, WorkflowResponse, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BRAND_MODULE } from "../../modules/brand"
import { emitEventStep } from "@medusajs/medusa/core-flows"
import BrandModuleService from "../../modules/brand/service"

type Input = {
  name: string
  handle?: string
  description?: string
  thumbnail?: string
  metadata?: Record<string, any>
}

const createBrandStep = createStep("create-brand-step", async (input: Input, { container }) => {
  const brandService = container.resolve(BRAND_MODULE) as BrandModuleService
  const created = await brandService.createBrands([input])
  return new StepResponse(created[0])
})

const createBrandWorkflow = createWorkflow("create-brand", (input: Input) => {
  const brand = createBrandStep(input)
  emitEventStep({
    eventName: "brand.created",
    data: {
      id: brand.id,
    },
  })
  return new WorkflowResponse(brand)
})

export default createBrandWorkflow
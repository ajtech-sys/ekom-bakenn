import { createStep, createWorkflow, WorkflowResponse, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { BRAND_MODULE } from "../../modules/brand"
import BrandModuleService from "../../modules/brand/service"

type ProductInput = {
  title: string
  description?: string
  handle?: string
}

type Input = {
  product: ProductInput
  brand_id?: string
  brand_handle?: string
}

const createProductStep = createStep("create-product-step", async (input: ProductInput, { container }) => {
  const productService = container.resolve(Modules.PRODUCT)
  const created = await productService.createProducts([input])
  return new StepResponse(created[0])
})

const resolveBrandStep = createStep("resolve-brand-step", async (input: { brand_id?: string; brand_handle?: string }, { container }) => {
  if (!input.brand_id && !input.brand_handle) {
    return new StepResponse(undefined)
  }
  const brandService = container.resolve(BRAND_MODULE) as BrandModuleService
  if (input.brand_id) {
    const brand = await brandService.retrieveBrand(input.brand_id)
    return new StepResponse(brand)
  }
  const [brand] = await brandService.listBrands({ handle: input.brand_handle })
  return new StepResponse(brand)
})

const linkProductBrandStep = createStep(
  "link-product-brand-step",
  async (input: { product_id: string; brand_id?: string }, { container }) => {
    if (!input.brand_id) {
      return new StepResponse(undefined)
    }
    const link = container.resolve("link")
    await link.create({
      [Modules.PRODUCT]: { product_id: input.product_id },
      [BRAND_MODULE]: { brand_id: input.brand_id },
    })
    return new StepResponse(true)
  }
)

const createProductWithBrandWorkflow = createWorkflow("create-product-with-brand", (input: Input) => {
  const product = createProductStep(input.product)
  const brand = resolveBrandStep({ brand_id: input.brand_id, brand_handle: input.brand_handle })
  const linked = linkProductBrandStep({ product_id: product.id, brand_id: brand?.id })
  return new WorkflowResponse({ product, brand, linked })
})

export default createProductWithBrandWorkflow
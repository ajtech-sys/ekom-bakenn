import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRODUCT_MEDIA_MODULE } from "../../modules/product-media"
import ProductMediaModuleService from "../../modules/product-media/service"

export type UpdateCategoryImagesStepInput = {
  updates: {
    id: string
    type?: "thumbnail" | "image"
  }[]
}

export const updateCategoryImagesStep = createStep(
  "update-category-images-step",
  async (input: UpdateCategoryImagesStepInput, { container }) => {
    const productMediaService: ProductMediaModuleService = container.resolve(PRODUCT_MEDIA_MODULE)
    const prevData = await productMediaService.listProductCategoryImages({ id: input.updates.map((u) => u.id) })
    const updatedData = await productMediaService.updateProductCategoryImages(input.updates as any)
    return new StepResponse(updatedData, prevData)
  },
  async (compensationData, { container }) => {
    if (!compensationData?.length) {
      return
    }
    const productMediaService: ProductMediaModuleService = container.resolve(PRODUCT_MEDIA_MODULE)
    await productMediaService.updateProductCategoryImages(
      (compensationData as any[]).map((img) => ({ id: img.id, type: img.type }))
    )
  }
)
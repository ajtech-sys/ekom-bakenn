import { createWorkflow, WorkflowResponse, when, transform } from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { convertCategoryThumbnailsStep } from "./steps/convert-category-thumbnails"
import { updateCategoryImagesStep } from "./steps/update-category-images"

export type UpdateCategoryImagesInput = {
  updates: {
    id: string
    type?: "thumbnail" | "image"
  }[]
}

export const updateCategoryImagesWorkflow = createWorkflow(
  "update-category-images",
  (input: UpdateCategoryImagesInput) => {
    when(input, (data) => data.updates.some((u) => u.type === "thumbnail")).then(() => {
      const categoryImageIds = transform({ input }, (data) => {
        return data.input.updates.filter((u) => u.type === "thumbnail").map((u) => u.id)
      })
      const { data: categoryImages } = useQueryGraphStep({
        entity: "product_category_image",
        fields: ["category_id"],
        filters: {
          id: categoryImageIds,
        },
        options: {
          throwIfKeyNotFound: true,
        },
      })
      const categoryIds = transform({ categoryImages }, (data) => {
        return data.categoryImages.map((img: any) => img.category_id)
      })
      convertCategoryThumbnailsStep({ category_ids: categoryIds })
    })

    const updatedImages = updateCategoryImagesStep({ updates: input.updates })
    return new WorkflowResponse(updatedImages)
  }
)
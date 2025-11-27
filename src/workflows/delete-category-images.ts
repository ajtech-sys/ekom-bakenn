import { createWorkflow, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep, deleteFilesWorkflow } from "@medusajs/medusa/core-flows"
import { deleteCategoryImagesStep } from "./steps/delete-category-images"

export type DeleteCategoryImagesInput = {
  ids: string[]
}

export const deleteCategoryImagesWorkflow = createWorkflow(
  "delete-category-images",
  (input: DeleteCategoryImagesInput) => {
    const { data: categoryImages } = useQueryGraphStep({
      entity: "product_category_image",
      fields: ["id", "file_id", "url", "type", "category_id"],
      filters: {
        id: input.ids,
      },
      options: {
        throwIfKeyNotFound: true,
      },
    })

    const fileIds = transform({ categoryImages }, (data) => data.categoryImages.map((img: any) => img.file_id))

    deleteFilesWorkflow.runAsStep({
      input: {
        ids: fileIds,
      },
    })

    const result = deleteCategoryImagesStep({ ids: input.ids })
    return new WorkflowResponse(result)
  }
)
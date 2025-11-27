import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import ProductReviewModuleService from "../../../../../modules/product-review/service"
import { PRODUCT_REVIEW_MODULE } from "../../../../../modules/product-review"

export const GetStoreReviewsSchema = createFindParams()

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const query = req.scope.resolve("query")
  const reviewModuleService: ProductReviewModuleService = req.scope.resolve(PRODUCT_REVIEW_MODULE)

  const {
    data: reviews,
    metadata: { count, take, skip } = { count: 0, take: 10, skip: 0 },
  } = await query.graph({
    entity: "review",
    filters: { product_id: id, status: "approved" },
    ...req.queryConfig,
  })

  res.json({ reviews, count, limit: take, offset: skip, average_rating: await reviewModuleService.getAverageRating(id) })
}
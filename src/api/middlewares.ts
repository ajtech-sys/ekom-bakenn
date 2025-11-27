import { defineMiddlewares, validateAndTransformBody, validateAndTransformQuery, authenticate } from "@medusajs/framework/http"
import { PostAdminCreateBrand } from "./admin/brands/validators"
import { PostAdminCreateProductWithBrand } from "./admin/products/create-with-brand/validators"
import { z } from "zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { CreateCategoryImagesSchema } from "./admin/categories/[category_id]/images/route"
import { UpdateCategoryImagesSchema } from "./admin/categories/[category_id]/images/batch/route"
import { DeleteCategoryImagesSchema } from "./admin/categories/[category_id]/images/batch/route"
import { PostStoreReviewSchema } from "./store/reviews/route"
import { GetAdminReviewsSchema } from "./admin/reviews/route"
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route"
import { GetStoreReviewsSchema } from "./store/products/[id]/reviews/route"

export const GetBrandsSchema = createFindParams()

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/brands",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminCreateBrand)],
    },
    {
      matcher: "/admin/brands",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetBrandsSchema, {
          defaults: ["id", "name", "products.*"],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/products/create-with-brand",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminCreateProductWithBrand)],
    },
    {
      matcher: "/admin/products",
      method: ["POST"],
      additionalDataValidator: {
        brand_id: z.string().optional(),
      },
    },
    {
      matcher: "/admin/categories/:category_id/images",
      method: ["POST"],
      middlewares: [validateAndTransformBody(CreateCategoryImagesSchema)],
    },
    {
      matcher: "/admin/categories/:category_id/images/batch",
      method: ["POST"],
      middlewares: [validateAndTransformBody(UpdateCategoryImagesSchema)],
    },
    {
      matcher: "/admin/categories/:category_id/images/batch",
      method: ["DELETE"],
      middlewares: [validateAndTransformBody(DeleteCategoryImagesSchema)],
    },
    {
      matcher: "/store/reviews",
      method: ["POST"],
      middlewares: [authenticate("customer", ["session", "bearer"]), validateAndTransformBody(PostStoreReviewSchema)],
    },
    {
      matcher: "/admin/reviews",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetAdminReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "content",
            "rating",
            "product_id",
            "customer_id",
            "status",
            "created_at",
            "updated_at",
            "product.*",
          ],
        }),
      ],
    },
    {
      matcher: "/admin/reviews/status",
      method: ["POST"],
      middlewares: [validateAndTransformBody(PostAdminUpdateReviewsStatusSchema)],
    },
    {
      matcher: "/store/products/:id/reviews",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetStoreReviewsSchema, {
          isList: true,
          defaults: ["id", "rating", "title", "first_name", "last_name", "content", "created_at"],
        }),
      ],
    },
    {
      matcher: "/store/payment-methods/:account_holder_id",
      method: ["GET"],
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
  ],
})
import { createStep, createWorkflow, WorkflowResponse, StepResponse } from "@medusajs/framework/workflows-sdk"
import productBrandLink from "../../links/product-brand"

type Input = { product_id: string }

const queryBrandsStep = createStep("query-product-brands-step", async (input: Input, { container }) => {
  const query = container.resolve("query")
  const { data } = await query.graph({
    entity: productBrandLink.entryPoint,
    fields: ["brand.*"],
    filters: { product_id: input.product_id },
  })
  const brands = data.map((d: any) => d.brand)
  return new StepResponse(brands)
})

const getProductBrandsWorkflow = createWorkflow("get-product-brands", (input: Input) => {
  const brands = queryBrandsStep(input)
  return new WorkflowResponse(brands)
})

export default getProductBrandsWorkflow
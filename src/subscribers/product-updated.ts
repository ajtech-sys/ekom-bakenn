import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"

export default async function productUpdatedHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const baseUrl = process.env.STOREFRONT_URL
  if (!baseUrl) {
    logger.info("STOREFRONT_URL is not defined")
    return
  }
  const url = `${baseUrl}/api/revalidate?tags=product-${data.id}`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      logger.error(`Revalidation request failed: ${res.status}`)
      return
    }
    logger.info(`Requested cache revalidation for product ${data.id}`)
  } catch (e: any) {
    logger.error(`Revalidation request error: ${e?.message ?? e}`)
  }
}

export const config: SubscriberConfig = {
  event: "product.updated",
}
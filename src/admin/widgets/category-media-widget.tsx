import { defineWidgetConfig } from "./config"
import { Heading } from "../components/ui/heading"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { CategoryImage } from "../types"
import { ThumbnailBadge } from "../components/ui/thumbnail-badge"
import { CategoryMediaModal } from "../components/category-media/category-media-modal"

type CategoryImagesResponse = {
  category_images: CategoryImage[]
}

type CategoryData = { id: string }
const CategoryMediaWidget = ({ data }: { data: CategoryData }) => {
  const { data: response, isLoading } = useQuery({
    queryKey: ["category-images", data.id],
    queryFn: async () => {
      const result = await sdk.client.fetch<CategoryImagesResponse>(`/admin/categories/${data.id}/images`)
      return result
    },
  })

  const images = response?.category_images || []

  return (
    <div className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Media</Heading>
        <CategoryMediaModal categoryId={data.id} existingImages={images} />
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-[repeat(auto-fill,96px)] gap-4">
          {isLoading && (
            <div className="col-span-full">
              <p className="text-ui-fg-subtle text-sm">Loading...</p>
            </div>
          )}
          {!isLoading && images.length === 0 && (
            <div className="col-span-full">
              <p className="text-ui-fg-subtle text-sm">No images added yet</p>
            </div>
          )}
          {images.map((image: CategoryImage) => (
            <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg border border-ui-border-base bg-ui-bg-subtle">
              <img src={image.url} alt={`Category ${image.type}`} className="h-full w-full object-cover" />
              {image.type === "thumbnail" && (
                <div className="absolute top-2 left-2">
                  <ThumbnailBadge />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({ zone: "product_category.details.after" })

export default CategoryMediaWidget

import { ThumbnailBadge } from "../ui/thumbnail-badge"
import { Checkbox } from "../ui/checkbox"
import { clx } from "../../utils/clx"

type CategoryImageItemProps = {
  id: string
  url: string
  alt: string
  isThumbnail: boolean
  isSelected: boolean
  onToggleSelect: () => void
}

export const CategoryImageItem = ({ id, url, alt, isThumbnail, isSelected, onToggleSelect }: CategoryImageItemProps) => {
  return (
    <div
      key={id}
      className="shadow hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary bg-base-200 hover:bg-base-300 group relative aspect-square h-auto max-w-full overflow-hidden rounded-lg outline-none"
    >
      {isThumbnail && (
        <div className="absolute left-2 top-2">
          <ThumbnailBadge />
        </div>
      )}
      <div
        className={clx(
          "transition-opacity absolute right-2 top-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100",
          isSelected && "opacity-100"
        )}
      >
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </div>
      <img src={url} alt={alt} className="size-full object-cover object-center" />
    </div>
  )
}

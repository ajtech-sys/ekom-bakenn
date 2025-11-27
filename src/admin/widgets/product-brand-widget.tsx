import { defineWidgetConfig } from "./config"
import { useEffect, useState } from "react"

type Props = {
  productId: string
}

const ProductBrandWidget = ({ productId }: Props) => {
  const [brands, setBrands] = useState<any[]>([])
  const [selected, setSelected] = useState<string>("")

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`/admin/brands`)
      const json = await res.json()
      setBrands(json.brands || [])
    })()
  }, [])

  const save = async () => {
    if (!selected) return
    await fetch(`/admin/products/${productId}/brand`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand_id: selected }),
    })
  }

  return (
    <div>
      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Select brand</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      <button onClick={save}>Save</button>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductBrandWidget

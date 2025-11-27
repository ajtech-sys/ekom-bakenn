import { defineRouteConfig } from "../config"

const BrandsRoute = () => {
  return <div>Brands</div>
}

export const config = defineRouteConfig({
  label: "Brands",
  icon: "Tag",
  path: "/brands",
})

export default BrandsRoute

import { model } from "@medusajs/framework/utils"

const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text().unique(),
  handle: model.text().unique(),
  description: model.text().nullable(),
  thumbnail: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Brand
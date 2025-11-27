import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import * as fssync from "fs"
import path from "path"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const key = req.params.key
  const uploadDir = process.env.FILE_UPLOAD_DIR || "uploads"
  const dir = path.isAbsolute(uploadDir) ? uploadDir : path.join(process.cwd(), uploadDir)
  const p = path.resolve(dir, key)
  if (!p.startsWith(path.resolve(dir))) {
    res.sendStatus(403)
    return
  }
  if (!fssync.existsSync(p)) {
    res.sendStatus(404)
    return
  }
  const ext = path.extname(p).toLowerCase()
  const mime =
    ext === ".png" ? "image/png" :
    ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
    ext === ".gif" ? "image/gif" :
    ext === ".webp" ? "image/webp" :
    ext === ".svg" ? "image/svg+xml" :
    "application/octet-stream"
  res.setHeader("Content-Type", mime)
  const stream = fssync.createReadStream(p)
  stream.pipe(res as any)
}

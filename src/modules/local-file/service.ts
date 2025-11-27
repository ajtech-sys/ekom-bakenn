import { AbstractFileProviderService } from "@medusajs/framework/utils"
import type { Logger, FileTypes } from "@medusajs/framework/types"
import { Readable } from "stream"
import { promises as fs } from "fs"
import * as fssync from "fs"
import path from "path"
import { pipeline } from "stream/promises"

type InjectedDependencies = {
  logger: Logger
}

type Options = {
  file_url?: string
  base_url_path?: string
  uploads_dir: string
  prefix?: string
  download_file_duration?: number
  backend_url?: string
}

class LocalFileProviderService extends AbstractFileProviderService {
  static identifier = "local-file"
  protected logger_: Logger
  protected options_: Options

  constructor({ logger }: InjectedDependencies, options: Options) {
    super()
    this.logger_ = logger
    this.options_ = options
  }

  async delete(files: FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[]): Promise<void> {
    const arr = Array.isArray(files) ? files : [files]
    for (const f of arr) {
      const p = this.getPath(f.fileKey)
      try {
        await fs.unlink(p)
      } catch {}
    }
  }

  async getAsBuffer(file: FileTypes.ProviderGetFileDTO): Promise<Buffer> {
    const p = this.getPath(file.fileKey)
    return await fs.readFile(p)
  }

  async getAsStream(file: FileTypes.ProviderGetFileDTO): Promise<Readable> {
    const p = this.getPath(file.fileKey)
    return fssync.createReadStream(p)
  }

  async getPresignedDownloadUrl(file: FileTypes.ProviderGetFileDTO): Promise<string> {
    const basePath = (this.options_.file_url || this.options_.base_url_path || "/uploads").replace(/\/$/, "")
    const isAbsolute = /^https?:\/\//i.test(basePath)
    const base = isAbsolute
      ? basePath
      : `${(this.options_.backend_url || "").replace(/\/$/, "")}${basePath}`
    return `${base}/${file.fileKey}`
  }

  async getPresignedUploadUrl(file: FileTypes.ProviderGetPresignedUploadUrlDTO): Promise<FileTypes.ProviderFileResultDTO> {
    const key = this.buildKey(file.filename)
    const url = await this.getPresignedDownloadUrl({ fileKey: key })
    return { url, key }
  }

  async upload(file: FileTypes.ProviderUploadFileDTO): Promise<FileTypes.ProviderFileResultDTO> {
    await this.ensureDir()
    const key = this.buildKey((file as any).filename || (file as any).fileName || "file")
    const p = this.getPath(key)
    const candidate =
      (file as any).buffer ??
      (file as any).content ??
      (file as any).stream ??
      (file as any).data ??
      (file as any).Body
    if (!candidate) {
      throw new Error("No file content")
    }
    if (Buffer.isBuffer(candidate)) {
      await fs.writeFile(p, candidate)
    } else if (candidate instanceof Uint8Array) {
      await fs.writeFile(p, Buffer.from(candidate))
    } else if (typeof (candidate as any).arrayBuffer === "function") {
      const arr = await (candidate as any).arrayBuffer()
      await fs.writeFile(p, Buffer.from(arr))
    } else if (typeof (candidate as any).pipe === "function" || typeof (candidate as any).on === "function") {
      const ws = fssync.createWriteStream(p)
      await pipeline(candidate as Readable, ws)
    } else if (typeof candidate === "string") {
      const encoding = (file as any).encoding || "utf8"
      await fs.writeFile(p, candidate, { encoding })
    } else {
      throw new Error("Invalid file content")
    }
    const basePath = (this.options_.file_url || this.options_.base_url_path || "/uploads").replace(/\/$/, "")
    const isAbsolute = /^https?:\/\//i.test(basePath)
    const base = isAbsolute
      ? basePath
      : `${(this.options_.backend_url || "").replace(/\/$/, "")}${basePath}`
    const url = `${base}/${key}`
    return { url, key }
  }

  static validateOptions(options: Record<any, any>) {
    if (!options.uploads_dir) {
      throw new Error("Invalid file provider options")
    }
  }

  protected buildKey(name: string): string {
    const safePrefix = this.options_.prefix ? this.options_.prefix.replace(/\/+/, "-") : ""
    const prefixPart = safePrefix ? `${safePrefix}-` : ""
    return `${prefixPart}${Date.now()}-${name}`
  }

  protected getPath(key: string): string {
    const dir = path.isAbsolute(this.options_.uploads_dir)
      ? this.options_.uploads_dir
      : path.join(process.cwd(), this.options_.uploads_dir)
    return path.join(dir, key)
  }

  protected async ensureDir(): Promise<void> {
    const dir = path.isAbsolute(this.options_.uploads_dir)
      ? this.options_.uploads_dir
      : path.join(process.cwd(), this.options_.uploads_dir)
    await fs.mkdir(dir, { recursive: true })
  }
}

export default LocalFileProviderService

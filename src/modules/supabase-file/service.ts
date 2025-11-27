import { AbstractFileProviderService } from "@medusajs/framework/utils"
import type { Logger, FileTypes } from "@medusajs/framework/types"
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Readable } from "stream"

type InjectedDependencies = {
  logger: Logger
}

type Options = {
  file_url?: string
  access_key_id: string
  secret_access_key: string
  region?: string
  bucket: string
  endpoint: string
  prefix?: string
  cache_control?: string
  download_file_duration?: number
  additional_client_config?: Record<string, any>
}

class SupabaseFileProviderService extends AbstractFileProviderService {
  static identifier = "supabase-file"
  protected logger_: Logger
  protected options_: Options
  protected client: S3Client

  constructor({ logger }: InjectedDependencies, options: Options) {
    super()
    this.logger_ = logger
    this.options_ = options
    this.client = new S3Client({
      region: options.region || "us-east-1",
      endpoint: options.endpoint,
      forcePathStyle: options.additional_client_config?.forcePathStyle ?? true,
      credentials: {
        accessKeyId: options.access_key_id,
        secretAccessKey: options.secret_access_key,
      },
    })
  }

  async delete(files: FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[]): Promise<void> {
    const arr = Array.isArray(files) ? files : [files]
    for (const f of arr) {
      await this.client.send(new DeleteObjectCommand({ Bucket: this.options_.bucket, Key: f.fileKey }))
    }
  }

  async getAsBuffer(file: FileTypes.ProviderGetFileDTO): Promise<Buffer> {
    const res = await this.client.send(new GetObjectCommand({ Bucket: this.options_.bucket, Key: file.fileKey }))
    const body = res.Body as Readable
    const chunks: Buffer[] = []
    return await new Promise<Buffer>((resolve, reject) => {
      body.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
      body.on("end", () => resolve(Buffer.concat(chunks)))
      body.on("error", reject)
    })
  }

  async getAsStream(file: FileTypes.ProviderGetFileDTO): Promise<Readable> {
    const res = await this.client.send(new GetObjectCommand({ Bucket: this.options_.bucket, Key: file.fileKey }))
    return res.Body as Readable
  }

  async getPresignedDownloadUrl(file: FileTypes.ProviderGetFileDTO): Promise<string> {
    const url = await getSignedUrl(this.client, new GetObjectCommand({ Bucket: this.options_.bucket, Key: file.fileKey }), {
      expiresIn: this.options_.download_file_duration ?? 3600,
    })
    return url
  }

  async getPresignedUploadUrl(file: FileTypes.ProviderGetPresignedUploadUrlDTO): Promise<FileTypes.ProviderFileResultDTO> {
    const key = this.buildKey(file.filename)
    const url = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.options_.bucket,
        Key: key,
        ContentType: file.mimeType,
        CacheControl: this.options_.cache_control,
      }),
      { expiresIn: this.options_.download_file_duration ?? 3600 }
    )
    return { url, key }
  }

  async upload(file: FileTypes.ProviderUploadFileDTO): Promise<FileTypes.ProviderFileResultDTO> {
    const key = this.buildKey((file as any).filename || (file as any).fileName)
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.options_.bucket,
        Key: key,
        Body: (file as any).buffer ?? (file as any).content ?? (file as any).stream,
        ContentType: (file as any).mimeType,
        CacheControl: this.options_.cache_control,
      })
    )
    const url = this.options_.file_url
      ? `${this.options_.file_url}/${key}`
      : `${this.options_.endpoint.replace(/\/$/, "")}/${this.options_.bucket}/${key}`
    return { url, key }
  }

  static validateOptions(options: Record<any, any>) {
    if (!options.access_key_id || !options.secret_access_key || !options.bucket || !options.endpoint) {
      throw new Error("Invalid file provider options")
    }
  }

  protected buildKey(name: string): string {
    const prefix = this.options_.prefix ? this.options_.prefix.replace(/\/$/, "") + "/" : ""
    return `${prefix}${Date.now()}-${name}`
  }
}

export default SupabaseFileProviderService
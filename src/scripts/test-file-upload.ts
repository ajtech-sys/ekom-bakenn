import SupabaseFileProviderService from "../modules/supabase-file/service"

export default async function run() {
  console.log("TEST_START")
  const access_key_id = process.env.S3_ACCESS_KEY_ID as string
  const secret_access_key = process.env.S3_SECRET_ACCESS_KEY as string
  const bucket = process.env.S3_BUCKET as string
  const endpoint = process.env.S3_ENDPOINT as string
  const region = process.env.S3_REGION
  const file_url = process.env.S3_FILE_URL

  const service = new (SupabaseFileProviderService as any)({ logger: console }, {
    access_key_id,
    secret_access_key,
    bucket,
    endpoint,
    region,
    file_url,
    additional_client_config: { forcePathStyle: true },
  })

  const filename = `test-${Date.now()}.txt`
  const buffer = Buffer.from("hello world")

  try {
    const uploaded = await service.upload({ filename, mimeType: "text/plain", buffer })
    console.log("UPLOAD_OK", uploaded)

    const buf = await service.getAsBuffer({ fileKey: uploaded.key })
    console.log("READ_OK", buf.toString("utf-8"))

    const url = await service.getPresignedDownloadUrl({ fileKey: uploaded.key })
    console.log("PRESIGNED_DOWNLOAD_OK", url)
  } catch (e) {
    console.error("TEST_FAILED", e)
    process.exitCode = 1
  }
  console.log("TEST_DONE")
}

if (process.env.DIRECT_RUN === "1") {
  run()
}
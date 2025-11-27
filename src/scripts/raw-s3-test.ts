import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

async function main() {
  const accessKeyId = process.env.S3_ACCESS_KEY_ID as string
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY as string
  const bucket = process.env.S3_BUCKET as string
  const endpoint = process.env.S3_ENDPOINT as string
  const region = process.env.S3_REGION || "us-east-1"

  const client = new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  })

  const key = `test-${Date.now()}.txt`
  const body = Buffer.from("hello world")

  try {
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: "text/plain" }))
    const publicBase = (process.env.S3_FILE_URL as string) || `${endpoint.replace(/\/$/, "")}/${bucket}`
    console.log("UPLOAD_OK", { key, url: `${publicBase}/${key}` })
  } catch (e) {
    console.error("UPLOAD_FAIL", e)
    process.exitCode = 1
  }
}

main()
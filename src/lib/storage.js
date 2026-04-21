import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Inisialisasi S3 Client untuk Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Generate Pre-signed URL untuk client mengunggah file langsung ke R2
 * @param {string} key - Nama file/path di bucket
 * @param {string} contentType - Tipe konten (mis: image/jpeg)
 * @returns {Promise<string>}
 */
export async function getUploadUrl(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || "ipb-preloved-images",
    Key: key,
    ContentType: contentType,
  });

  // URL valid selama 5 menit
  return getSignedUrl(s3Client, command, { expiresIn: 300 });
}

export default s3Client;

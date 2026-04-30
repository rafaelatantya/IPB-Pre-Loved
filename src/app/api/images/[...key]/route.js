import { getEnv } from "@/lib/db";

export const runtime = "edge";

/**
 * API Route: Serve images directly from R2 Bucket
 * Usage: /api/images/products/filename.jpg
 */
export async function GET(request, { params }) {
  try {
    const env = await getEnv();
    const bucket = env.bucket || env.BUCKET;

    if (!bucket) {
      return new Response("R2 Bucket binding not found", { status: 500 });
    }

    // Ambil path lengkap dari params (misal: ['products', 'id-name.jpg'])
    const keyArray = await params.key;
    const key = keyArray.join("/");

    // SECURITY: Hanya boleh akses folder 'products/'
    if (!key.startsWith("products/")) {
      return new Response("Forbidden: Access restricted to products only", { status: 403 });
    }

    const object = await bucket.get(key);

    if (!object) {
      return new Response("Object not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000");
    headers.set("Accept-Ranges", "bytes"); // Tambahkan ini buat streaming video

    // Fallback Content-Type jika di metadata R2 kosong
    if (!headers.has("content-type")) {
      const extension = key.split('.').pop().toLowerCase();
      const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'mp4': 'video/mp4'
      };
      headers.set("Content-Type", mimeTypes[extension] || "application/octet-stream");
    }

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    console.error("R2 Serve Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

import { getAuth } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * API Route: Handled Large Uploads with Progress Support
 * POST /api/upload
 */
export async function POST(req) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const type = formData.get("type"); // "image" atau "video"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Validasi Tipe & MIME
    const isImage = type === "image" && file.type.startsWith("image/");
    const isVideo = type === "video" && file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Format file tidak didukung atau tipe tidak cocok" }, { status: 400 });
    }

    // 2. Batasan Ukuran
    const MAX_IMAGE = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO = 50 * 1024 * 1024; // 50MB

    if (type === "image" && file.size > MAX_IMAGE) {
      return NextResponse.json({ error: "Gambar melebihi 5MB" }, { status: 400 });
    }
    if (type === "video" && file.size > MAX_VIDEO) {
      return NextResponse.json({ error: "Video melebihi 50MB" }, { status: 400 });
    }

    // 3. Persiapan R2
    const { env } = getRequestContext();
    const bucket = env.bucket;
    const prefix = type === "image" ? "i" : "v";
    const ext = type === "image" ? "webp" : "mp4";
    const key = `products/${prefix}-${crypto.randomUUID()}-${Date.now()}.${ext}`;

    // 3. Upload ke R2
    const buffer = await file.arrayBuffer();
    await bucket.put(key, buffer, {
      httpMetadata: { contentType: file.type }
    });

    return NextResponse.json({
      success: true,
      url: `/api/images/${key}`,
      key: key
    });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: "Gagal memproses upload" }, { status: 500 });
  }
}

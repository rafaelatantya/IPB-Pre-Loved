import { getEnv } from "@/lib/db";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    const auth = await getAuth();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" }, { status: 400 });
    }

    const env = await getEnv();
    const bucket = env.bucket || env.BUCKET;

    if (!bucket) {
      throw new Error("R2 Bucket not configured");
    }

    const uploadedUrls = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;
      const key = `products/${fileName}`;
      
      const arrayBuffer = await file.arrayBuffer();
      
      await bucket.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });

      uploadedUrls.push(`/api/images/${key}`);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

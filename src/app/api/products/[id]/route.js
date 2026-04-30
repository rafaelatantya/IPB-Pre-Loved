import { getProductById, getRecommendedProducts } from "@/modules/catalog/services";
import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * API: Get single product detail + recommendations
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // 1. Ambil data produk utama
    const productRes = await getProductById(id);
    
    if (!productRes.success) {
      return NextResponse.json({ success: false, error: productRes.error }, { status: 404 });
    }

    // 2. Ambil rekomendasi (opsional, biar irit request)
    const recommendedRes = await getRecommendedProducts(id, 4);

    return NextResponse.json({
      success: true,
      data: productRes.data,
      recommended: recommendedRes.data || []
    });
  } catch (error) {
    console.error("API Single Product Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

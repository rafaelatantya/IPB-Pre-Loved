import { getProductById, getRecommendedProducts } from "@/modules/catalog/services";
import { trackWhatsAppClick, updateProduct } from "@/modules/product/actions";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

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

    const product = productRes.data;

    // 🛡️ SECURITY: Non-approved products are only accessible to their owner (seller) or an Admin
    if (product.status !== "APPROVED") {
      const auth = await getAuth();
      const session = await auth();
      const isOwner = session?.user?.id === product.sellerId;
      const isAdmin = session?.user?.role === "ADMIN";
      
      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { success: false, error: "Produk ini tidak aktif atau Anda tidak memiliki akses untuk melihatnya." },
          { status: 403 }
        );
      }
    }

    // 2. Ambil rekomendasi (opsional, biar irit request)
    const recommendedRes = await getRecommendedProducts(id, 4);

    return NextResponse.json({
      success: true,
      data: product,
      recommended: recommendedRes.data || []
    });
  } catch (error) {
    console.error("API Single Product Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * API: Track WhatsApp Click
 */
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    console.log(`[WA_LEADS_API] Received track request for product: ${id}`);
    const res = await trackWhatsAppClick(id);
    return NextResponse.json(res);
  } catch (error) {
    console.error("API Track WA Click Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * API: Update Product Details
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log(`[API_UPDATE_PRODUCT] Received update request for product: ${id}`);
    const res = await updateProduct(id, body);
    return NextResponse.json(res);
  } catch (error) {
    console.error("API Update Product Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

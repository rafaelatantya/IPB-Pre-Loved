import React from "react";
import SellerProductList from "@/modules/product/components/SellerProductList";
import { getProducts, getSellerStats } from "@/modules/product/actions";

// 🛡️ SECURITY & STABILITY: Force dynamic rendering for Cloudflare Edge
// Ini solusi untuk error 405 Method Not Allowed pada Server Actions
export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function DaftarProdukPage() {
    // Ambil data awal secara server-side (Direct Call, No POST required)
    const [productsRes, statsRes] = await Promise.all([
        getProducts({ page: 1, limit: 10 }),
        getSellerStats(),
    ]);

    const initialData = productsRes.success ? productsRes.data : [];
    const initialHasMore = productsRes.success ? productsRes.hasMore : false;
    const initialStats = statsRes.success ? statsRes.data : null;

    return (
        <SellerProductList
            initialData={initialData}
            initialHasMore={initialHasMore}
            initialStats={initialStats}
        />
    );
}
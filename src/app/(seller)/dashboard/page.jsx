import React from "react";
import SellerProductList from "@/modules/product/components/SellerProductList";
import { getProducts } from "@/modules/product/actions";

// 🛡️ SECURITY & STABILITY: Force dynamic rendering for Cloudflare Edge
// Ini solusi untuk error 405 Method Not Allowed pada Server Actions
export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function DaftarProdukPage() {
    // Ambil data awal secara server-side (Direct Call, No POST required)
    const res = await getProducts({ page: 1, limit: 10 });
    
    const initialData = res.success ? res.data : [];
    const initialHasMore = res.success ? res.hasMore : false;

    return (
        <SellerProductList 
            initialData={initialData} 
            initialHasMore={initialHasMore} 
        />
    );
}
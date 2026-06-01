import React from "react";
import SellerProductList from "@/modules/product/components/SellerProductList";
import { getProducts, getSellerStats } from "@/modules/product/actions";

// 🛡️ SECURITY & STABILITY: Force dynamic rendering for Cloudflare Edge
export const dynamic = "force-dynamic";
export const runtime = "edge";


export default async function DaftarProdukPage() {
    // Ambil data awal secara server-side
    const [productsRes, statsRes] = await Promise.all([
        getProducts({ page: 1, limit: 10 }),
        getSellerStats(),
    ]);

    // ── SAFE PROTECTION FOR PAGINATION DATA ──
    // Cek apakah data berada di dalam properti .products atau langsung array
    let initialData = [];
    if (productsRes && productsRes.success && productsRes.data) {
        if (Array.isArray(productsRes.data)) {
            initialData = productsRes.data;
        } else if (Array.isArray(productsRes.data.products)) {
            initialData = productsRes.data.products;
        }
    }

    const initialHasMore = productsRes?.success ? (productsRes.hasMore ?? false) : false;
    const initialStats = statsRes?.success ? statsRes.data : null;

    return (
        <SellerProductList
            initialData={initialData}
            initialHasMore={initialHasMore}
            initialStats={initialStats}
        />
    );
}
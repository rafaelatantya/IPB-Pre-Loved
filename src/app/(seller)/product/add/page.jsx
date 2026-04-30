import React from "react";
import ProductAddForm from "@/modules/product/components/ProductAddForm";
import { getCategories } from "@/modules/category/actions";

// 🛡️ SECURITY & STABILITY: Force dynamic rendering for Cloudflare Edge
export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function TambahProdukPage() {
    // Ambil kategori secara server-side (Direct Call)
    const res = await getCategories();
    const categories = res.success ? res.data : [];

    return (
        <ProductAddForm categories={categories} />
    );
}
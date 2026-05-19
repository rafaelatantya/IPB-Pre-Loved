import React from "react";
import ProductEditForm from "@/modules/product/components/ProductEditForm";
import { getCategories } from "@/modules/category/actions";
import { getContextDb } from "@/lib/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

// 🛡️ SECURITY & STABILITY: Force dynamic rendering for Cloudflare Edge
export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function EditProdukPage({ params }) {
    const { id } = params;
    const auth = await getAuth();
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const db = await getContextDb();
    
    // Fetch product
    const product = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: { images: true }
    });

    if (!product) {
        notFound();
    }

    // Security Check: Only Seller or Admin can edit
    if (product.sellerId !== session.user.id && session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // Ambil kategori
    const res = await getCategories();
    const categories = res.success ? res.data : [];

    return (
        <ProductEditForm product={product} categories={categories} />
    );
}

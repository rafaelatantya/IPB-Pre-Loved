"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import dynamicImport from "next/dynamic";
import { getCategories } from "@/modules/category/actions";
import { Loader2 } from "lucide-react";

const ProductAddForm = dynamicImport(
  () => import("@/modules/product/components/ProductAddForm"),
  { ssr: false }
);

export default function TambahProdukPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await getCategories();
                if (res.success) {
                    setCategories(res.data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <ProductAddForm categories={categories} />
    );
}
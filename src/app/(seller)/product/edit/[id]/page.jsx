"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductEditForm from "@/modules/product/components/ProductEditForm";
import { getProductById } from "@/modules/product/actions";
import { getCategories } from "@/modules/category/actions";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        const [productRes, catRes] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        if (!productRes.success) {
          setError(productRes.error || "Produk tidak ditemukan.");
        } else {
          setProduct(productRes.data);
        }

        if (catRes.success) {
          setCategories(catRes.data || []);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <p className="text-sm text-red-500 font-medium">
          {error || "Produk tidak ditemukan."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <ProductEditForm product={product} categories={categories} />
    </div>
  );
}
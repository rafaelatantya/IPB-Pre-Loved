"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import dynamicImport from "next/dynamic";

const ProductEditForm = dynamicImport(
  () => import("@/modules/product/components/ProductEditForm"),
  { ssr: false }
);
import { useSession } from "next-auth/react";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;
  const { data: session, status: sessionStatus } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || sessionStatus === "loading") return;
    async function fetchData() {
      try {
        const [productRes, catRes] = await Promise.all([
          fetch(`/api/products/${id}`).then(r => r.json()),
          fetch("/api/categories").then(r => r.json()),
        ]);

        if (!productRes.success) {
          setError(productRes.error || "Produk tidak ditemukan.");
        } else {
          const fetchedProduct = productRes.data;
          const isOwner = session?.user?.id === fetchedProduct?.sellerId;

          if (!isOwner) {
            setError("Akses ditolak. Anda hanya dapat mengedit produk Anda sendiri.");
          } else if (fetchedProduct?.status === "PENDING" && !isAdmin) {
            setError("Produk yang sedang dalam proses verifikasi (Pending) tidak dapat diedit untuk mencegah konflik QC.");
          } else {
            setProduct(fetchedProduct);
          }
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
  }, [id, sessionStatus, session, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-4">
          <p className="text-sm text-red-500 font-medium leading-relaxed font-poppins">
            {error || "Produk tidak ditemukan."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <ProductEditForm product={product} categories={categories} />
    </div>
  );
}
"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";

// Pastikan ada kata 'export default function' dan nama fungsinya unik
export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams(); // Mengambil ID dari URL (misal: PRD-00192)

    return (
        <div className="p-12 min-h-screen bg-[#F9F9F9]" style={{ fontFamily: "Poppins, sans-serif" }}>
            <button
                onClick={() => router.back()}
                className="mb-6 text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
                ← Kembali ke Daftar Produk
            </button>

            <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl">
                <h1 className="text-2xl font-bold text-[#1A1C1C] mb-2">Detail Produk (Seller Preview)</h1>

                <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md text-sm font-mono">
                    ID Produk yang diakses: <span className="font-bold">{params.id}</span>
                </div>

                <p className="text-sm text-[#474747] mt-4 leading-relaxed">
                    Halaman ini digunakan untuk menampilkan pratinjau
                </p>
            </div>
        </div>
    );
}
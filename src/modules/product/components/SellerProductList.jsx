"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Pencil, Trash2, Check } from "lucide-react";

const STATUS_CONFIG = {
    APPROVED: { bg: "bg-[#16A34A]", label: "Approved" },
    PENDING: { bg: "bg-[#F59E0B]", label: "Pending" },
    REJECTED: { bg: "bg-[#EF4444]", label: "Rejected" },
    SOLD: { bg: "bg-gray-500", label: "Sold" },
};

const MOCK_PRODUCTS = [
    { id: "PRD-00192", title: "Buku Kalkulus Edisi 9", category: "Buku Kuliah", price: 150000, date: "24 Oct 2023", status: "APPROVED" },
    { id: "PRD-00193", title: "Buku Fisika Dasar Edisi 5", category: "Buku Pendidik", price: 120000, date: "25 Oct 2023", status: "PENDING" },
];

function formatRupiah(n) {
    if (!n) return "Rp 0";
    return "Rp " + Number(n).toLocaleString("id-ID");
}

function QCBadge({ status }) {
    const currentStatus = String(status).toUpperCase();
    const s = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.PENDING;
    return (
        <div className={`min-w-[93px] flex items-center gap-1.5 px-2.5 py-1 rounded-sm ${s.bg}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
            <span className="text-white text-xs font-normal leading-[18px]">{s.label}</span>
        </div>
    );
}

function ImagePlaceholder() {
    return <div className="w-20 h-20 flex-shrink-0 bg-[#E2E2E2] rounded-sm" />;
}

export default function SellerProductList({ initialData, initialHasMore, initialStats }) {
    const router = useRouter();

    const [products, setProducts] = useState(() => {
        if (initialData) {
            return initialData;
        }
        return MOCK_PRODUCTS;
    });

    useEffect(() => {
        if (initialData) {
            setProducts(initialData);
        }
    }, [initialData]);

    const handleDelete = (id) => {
        if (window.confirm("Hapus produk ini secara permanen?"))
            setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
    };

    const handleMarkSold = (id) => {
        if (window.confirm("Tandai produk ini sebagai terjual?"))
            setProducts((prev) =>
                prev.map((p) => {
                    const productId = p.id || p._id;
                    return productId === id ? { ...p, status: "SOLD" } : p;
                })
            );
    };

    return (
        <div className="flex min-h-screen bg-[#F9F9F9]" style={{ fontFamily: "Poppins, sans-serif" }}>
            <main className="flex-1 p-12 flex flex-col gap-12 min-w-0">

                <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[40px] font-semibold leading-[48px] text-[#1A1C1C]">Daftar Produk Saya</h1>
                        <p className="text-base font-medium leading-6 text-[#474747]">
                            Manage your inventory, pricing, and review quality control status.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/product/add")}
                        className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-[#F0FDF4] text-sm font-semibold px-[18px] py-3 rounded-[6px] shadow-sm transition-colors flex-shrink-0 h-[46px]"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Produk Baru
                    </button>
                </div>

                <div className="flex flex-col gap-8">
                    {products.length === 0 ? (
                        <div className="bg-white shadow-[0_4px_8px_rgba(0,0,0,0.12)] p-12 text-center">
                            <p className="text-sm text-[#474747]">Belum ada produk.</p>
                        </div>
                    ) : (
                        products.map((product) => {
                            const productId = product.id || product._id || "PRD-UNKNOWN";
                            const productTitle = product.title || product.name || "Produk Tanpa Nama";
                            const productCategory = product.category || "Umum";
                            const productPrice = product.price || 0;
                            const productDate = product.date || product.createdAt || "-";
                            const productStatus = product.status || "PENDING";

                            return (
                                <div key={productId} className="flex flex-col items-end gap-2">
                                    <div className="w-full bg-white shadow-[0_4px_8px_rgba(0,0,0,0.12)] p-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-8 max-w-[284px] w-full">
                                            <ImagePlaceholder />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-base font-bold leading-6 text-[#1A1C1C]">{productTitle}</p>
                                                <p className="text-xs text-[#474747] pt-1">ID: {productId}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#1A1C1C] max-w-[80px] w-full">{productCategory}</p>
                                        <p className="text-xs font-bold text-[#1A1C1C] max-w-[66px] w-full">{formatRupiah(productPrice)}</p>
                                        <p className="text-xs text-[#474747] max-w-[75px] w-full">{productDate}</p>
                                        <QCBadge status={productStatus} />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Tombol Mata -> Menuju /product/[id] */}
                                        <button
                                            onClick={() => router.push(`/product/detail/${productId}`)}
                                            className="p-2 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] rounded-lg hover:bg-gray-50 transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <Eye className="w-4 h-4 text-[#1A1C1C]" />
                                        </button>

                                        {/* Tombol Pensil -> Menuju /product/edit/[id] */}
                                        {productStatus !== "SOLD" && (
                                            <button
                                                onClick={() => router.push(`/product/edit/${productId}`)}
                                                className="p-2 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] rounded-lg hover:bg-gray-50 transition-colors"
                                                title="Edit Produk"
                                            >
                                                <Pencil className="w-4 h-4 text-[#1A1C1C]" />
                                            </button>
                                        )}

                                        {productStatus === "APPROVED" && (
                                            <button onClick={() => handleMarkSold(productId)} className="p-2 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] rounded-lg hover:bg-emerald-50 transition-colors" title="Tandai Terjual">
                                                <Check className="w-4 h-4 text-emerald-600" />
                                            </button>
                                        )}

                                        {productStatus !== "SOLD" && (
                                            <button onClick={() => handleDelete(productId)} className="p-2 bg-[#EF4444] hover:bg-red-600 shadow-[0_2px_4px_rgba(0,0,0,0.08)] rounded-lg transition-colors" title="Hapus Produk">
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="flex justify-center">
                    <button className="h-[46px] px-[18px] py-3 border border-[#2563EB] text-[#2563EB] text-sm font-semibold rounded-[6px] hover:bg-[#2563EB] hover:text-white transition-colors shadow-sm">
                        Load More
                    </button>
                </div>
            </main>
        </div>
    );
}
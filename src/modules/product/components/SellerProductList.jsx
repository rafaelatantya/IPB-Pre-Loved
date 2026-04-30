"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Check, ExternalLink } from "lucide-react";
import { getProducts, deleteProduct, markProductAsSold } from "@/modules/product/actions";

// Badge QC Status
function QCBadge({ status }) {
    const styles = {
        APPROVED: {
            dot: "bg-green-600",
            badge: "bg-green-50 text-green-800 border-green-200",
        },
        PENDING: {
            dot: "bg-orange-500 animate-pulse",
            badge: "bg-orange-50 text-orange-700 border-orange-200",
        },
        REJECTED: {
            dot: "bg-red-500",
            badge: "bg-red-50 text-red-700 border-red-200",
        },
        SOLD: {
            dot: "bg-blue-500",
            badge: "bg-blue-50 text-blue-700 border-blue-200",
        },
    };
    const s = styles[status] || styles["PENDING"];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${s.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
}

// Fallback kalau gambar tidak ada
function ImagePlaceholder() {
    return (
        <div className="w-[52px] h-[52px] border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="1" />
                <line x1="3" y1="3" x2="21" y2="21" />
                <line x1="21" y1="3" x2="3" y2="21" />
            </svg>
        </div>
    );
}

function ProductImage({ src, alt }) {
    const [error, setError] = useState(false);
    if (!src || error) return <ImagePlaceholder />;
    return (
        <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            className="w-[52px] h-[52px] rounded-lg object-cover border border-gray-200 flex-shrink-0"
        />
    );
}

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

export default function SellerProductList({ initialData = [], initialHasMore = false }) {
    const [products, setProducts] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);

    const handleDelete = async (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
        try {
            const res = await deleteProduct(id);
            if (res.success) {
                setProducts(prev => prev.filter(p => p.id !== id));
            } else {
                alert(res.error || "Gagal menghapus");
            }
        } catch (err) {
            alert("Terjadi kesalahan");
        }
    };

    const handleMarkSold = async (id) => {
        if (!confirm("Tandai produk ini sebagai Terjual?")) return;
        try {
            const res = await markProductAsSold(id);
            if (res.success) {
                setProducts(prev => prev.map(p => p.id === id ? { ...p, status: "SOLD" } : p));
            } else {
                alert(res.error || "Gagal update");
            }
        } catch (err) {
            alert("Terjadi kesalahan");
        }
    };

    const fetchProducts = async (pageNumber = 1, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const res = await getProducts({ page: pageNumber, limit: 10 });
            if (res.success) {
                if (isInitial) {
                    setProducts(res.data);
                } else {
                    setProducts(prev => [...prev, ...res.data]);
                }
                setHasMore(res.hasMore);
                setPage(pageNumber);
            } else {
                throw new Error(res.error || "Gagal memuat produk");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Jika data awal kosong, coba fetch sekali
    useEffect(() => {
        if (initialData.length === 0) {
            fetchProducts(1, true);
        }
    }, []);

    function handleLoadMore() {
        if (!loadingMore && hasMore) {
            fetchProducts(page + 1);
        }
    }

    if (loading && products.length === 0) {
        return (
            <div className="max-w-5xl mx-auto animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 border-b">
                            <div className="w-[52px] h-[52px] bg-gray-100 rounded" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 bg-gray-100 rounded" />
                                <div className="h-3 w-1/4 bg-gray-50 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Daftar Produk Saya</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Manage your inventory, pricing, and review quality control status.
                    </p>
                </div>
                <Link
                    href="/product/add"
                    className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Produk Baru
                </Link>
            </div>

            {/* Error state */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-6">
                    {error}
                </div>
            )}

            {/* Empty state */}
            {products.length === 0 && !loading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <p className="text-sm text-gray-400 mb-4">Belum ada produk. Yuk tambah produk pertamamu!</p>
                    <Link
                        href="/product/add"
                        className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Produk
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3 w-[72px]">Image</th>
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Product Details</th>
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3 w-[120px]">Category</th>
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3 w-[120px]">Price</th>
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3 w-[120px]">Date Added</th>
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3 w-[130px]">QC Status</th>
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3 w-[90px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <ProductImage 
                                                src={product.images?.[0]?.url} 
                                                alt={product.title} 
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-gray-900 uppercase italic tracking-tight">{product.title}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {product.id}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {product.category?.name || "UMUM"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-bold text-blue-600">{formatRupiah(product.price)}</td>
                                        <td className="px-4 py-4 text-gray-400 text-xs font-medium">
                                            {new Date(product.createdAt).toLocaleDateString("id-ID", {
                                                day: "numeric", month: "short", year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-4 py-4">
                                            <QCBadge status={product.status} />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/product/${product.id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Lihat Detail"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                
                                                {product.status === "APPROVED" && (
                                                    <button
                                                        onClick={() => handleMarkSold(product.id)}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                        title="Tandai Terjual"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Hapus Produk"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Load More */}
                    {hasMore && (
                        <div className="flex justify-center py-5 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="text-xs font-medium uppercase tracking-wider text-gray-400 border border-gray-200 px-7 py-2.5 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all disabled:opacity-50"
                            >
                                {loadingMore ? "Memuat..." : "Load More"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

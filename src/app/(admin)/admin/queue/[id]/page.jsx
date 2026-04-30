"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { X, Check, User } from "lucide-react";
import { getProductById } from "@/modules/catalog/services";
import { reviewProduct } from "@/modules/admin/actions";

// Thumbnail klikable
function Thumbnail({ src, alt, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`w-full aspect-square border rounded-lg overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center transition-all ${active ? "border-gray-900 border-2" : "border-gray-200 hover:border-gray-400"
                }`}
        >
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <path d="M3 17l5-5 4 4 3-3 6 6" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                </svg>
            )}
        </div>
    );
}

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

export default function AdminReviewDetailPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [submitting, setSubmitting] = useState(null); // "approve" | "reject"
    const [flagging, setFlagging] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (!productId) return;
            try {
                const res = await getProductById(productId);
                if (res.success) {
                    setProduct(res.data);
                } else {
                    alert(res.error || "Gagal memuat produk");
                    router.push("/admin/queue");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [productId]);

    async function handleDecision(action) {
        let decision = action === "approve" ? "APPROVED" : "REJECTED";
        let note = "";
        
        if (decision === "REJECTED") {
            note = prompt("Alasan Penolakan:", "Foto kurang jelas / Deskripsi tidak sesuai");
            if (!note) return;
        }

        setSubmitting(action);
        try {
            const res = await reviewProduct({ 
                productId, 
                decision, 
                note: note || "Lolos QC Admin" 
            });

            if (res.success) {
                router.push("/admin/queue");
            } else {
                alert(res.error || "Gagal memproses review");
            }
        } catch {
            alert("Terjadi kesalahan, coba lagi.");
        } finally {
            setSubmitting(null);
        }
    }

    async function handleFlagUser() {
        setFlagging(true);
        try {
            // Simulasi flag user
            await new Promise((r) => setTimeout(r, 500));
            alert("User berhasil diflag.");
        } catch {
            alert("Gagal flag user.");
        } finally {
            setFlagging(false);
        }
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto animate-pulse">
                <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-48 bg-gray-100 rounded mb-8" />
                <div className="flex gap-8">
                    <div className="flex-1 h-[420px] bg-gray-100 rounded-xl" />
                    <div className="w-[300px] flex flex-col gap-4">
                        <div className="h-6 w-48 bg-gray-200 rounded" />
                        <div className="h-8 w-32 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-100 rounded" />
                        <div className="h-4 w-full bg-gray-100 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    // Gabungkan media untuk galeri
    const allImages = product.images?.length > 0 ? product.images.map(img => img.url) : [null, null, null, null];
    const mainImage = allImages[activeImg];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Review Item: #{product.id}
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Submitted by: {product.seller?.name || "Unknown"}
                    </p>
                </div>
                <button
                    onClick={handleFlagUser}
                    disabled={flagging}
                    className="border border-gray-200 text-sm font-medium text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    {flagging ? "Memproses..." : "Flag User"}
                </button>
            </div>

            {/* Content: Foto kiri, Detail kanan */}
            <div className="flex gap-8">

                {/* Kiri: Galeri */}
                <div className="flex-1">
                    {/* Main Image */}
                    <div className="w-full aspect-[4/3] bg-gray-100 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center mb-3">
                        {mainImage ? (
                            <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="0.8">
                                <rect x="3" y="3" width="18" height="18" rx="1" />
                                <path d="M3 17l5-5 4 4 3-3 6 6" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                            </svg>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2">
                        {allImages.slice(0, 4).map((img, i) => (
                            <Thumbnail
                                key={i}
                                src={img}
                                alt={`Foto ${i + 1}`}
                                active={activeImg === i}
                                onClick={() => setActiveImg(i)}
                            />
                        ))}
                    </div>
                </div>

                {/* Kanan: Info + Aksi */}
                <div className="w-[300px] flex flex-col">

                    {/* Nama & Harga */}
                    <h2 className="text-xl font-bold text-gray-900 leading-snug mb-2">
                        {product.title}
                    </h2>
                    <p className="text-3xl font-bold text-gray-900 mb-5">
                        {formatRupiah(product.price)}
                    </p>

                    {/* Grid info 2 kolom */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Category</p>
                            <p className="text-sm text-gray-900">{product.category?.name || "UMUM"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Condition</p>
                            <p className="text-sm text-gray-900 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-900 inline-block" />
                                {product.condition}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Brand</p>
                            <p className="text-sm text-gray-900">{product.brand || "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Location</p>
                            <p className="text-sm text-gray-900">{product.location || "—"}</p>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="border-t border-gray-100 pt-4 mb-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Description</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Seller Card */}
                    <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{product.seller?.name}</p>
                            <p className="text-xs text-gray-400">
                                Seller Account
                            </p>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Action Buttons */}
                    <div className="border-t border-gray-100 pt-5 flex gap-3">
                        <button
                            onClick={() => handleDecision("reject")}
                            disabled={!!submitting}
                            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-sm font-semibold text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                            {submitting === "reject" ? "Menolak..." : "Reject Listing"}
                        </button>
                        <button
                            onClick={() => handleDecision("approve")}
                            disabled={!!submitting}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" />
                            {submitting === "approve" ? "Menyetujui..." : "Approve Listing"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
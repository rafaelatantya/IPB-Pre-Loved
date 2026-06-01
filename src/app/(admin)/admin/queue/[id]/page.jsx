"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { X, Check, User, PlayCircle } from "lucide-react";
import { getProductById } from "@/modules/catalog/services";
import { reviewProduct, toggleFlagUser } from "@/modules/admin/actions";

// Thumbnail klikable
function Thumbnail({ media, active, onClick }) {
    const isVideo = media?.type === "video";
    const src = isVideo ? media.thumbnail : media?.url;

    return (
        <div
            onClick={onClick}
            className={`w-full aspect-square border rounded-lg overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center relative transition-all ${
                active ? "border-gray-900 border-2" : "border-gray-200 hover:border-gray-400"
            }`}
        >
            {src ? (
                <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <path d="M3 17l5-5 4 4 3-3 6 6" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                </svg>
            )}
            {isVideo && (
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <PlayCircle className="w-8 h-8 text-white" />
                </div>
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
    const [reason, setReason] = useState("Tidak ada alasan");

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

        const finalReason = reason.trim() || "Tidak ada alasan";
        if (finalReason.length < 10) {
            alert("Alasan review minimal harus 10 karakter!");
            return;
        }
        if (finalReason.length > 250) {
            alert("Alasan review maksimal 250 karakter!");
            return;
        }

        setSubmitting(action);
        try {
            const res = await reviewProduct({
                productId,
                decision,
                note: finalReason
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
        if (!product?.seller?.id) return;
        setFlagging(true);
        try {
            const res = await toggleFlagUser(product.seller.id, true);
            if (res.success) {
                alert("Seller berhasil ditandai sebagai mencurigakan (flagged).");
            } else {
                alert(res.error || "Gagal melakukan flag seller.");
            }
        } catch {
            alert("Terjadi kesalahan sistem saat memproses.");
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
    const mediaList = [];
    if (product.videoUrl) {
        mediaList.push({ type: "video", url: product.videoUrl, thumbnail: product.images?.[0]?.url });
    }
    if (product.images && product.images.length > 0) {
        product.images.forEach((img) => mediaList.push({ type: "image", url: img.url }));
    }
    while (mediaList.length < 4) {
        mediaList.push({ type: "image", url: null });
    }

    const currentMedia = mediaList[activeImg] ?? null;

    return (
        <div className="max-w-5xl mx-auto py-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-[32px] font-black text-gray-900 tracking-tight leading-tight font-sans">
                        Review Item: #{product.id}
                    </h1>
                    <p className="text-sm text-gray-400 font-medium mt-1">
                        Submitted by: {product.seller?.name || "Unknown"}
                    </p>
                </div>
                <button
                    onClick={handleFlagUser}
                    disabled={flagging}
                    className="border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-700 px-5 py-2.5 rounded shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {flagging ? "Processing..." : "Flag User"}
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Kiri: Galeri Foto */}
                <div className="flex-1">
                    {/* Main Image / Video */}
                    <div className="w-full aspect-square bg-[#FAFAFA] border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                        {currentMedia?.type === "video" ? (
                            <video src={currentMedia.url} controls className="w-full h-full object-contain bg-black" />
                        ) : currentMedia?.url ? (
                            <img src={currentMedia.url} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="0.8">
                                <rect x="3" y="3" width="18" height="18" rx="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                            </svg>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-3">
                        {mediaList.slice(0, 4).map((media, i) => (
                            <Thumbnail
                                key={i}
                                media={media}
                                active={activeImg === i}
                                onClick={() => setActiveImg(i)}
                            />
                        ))}
                    </div>
                </div>

                {/* Kanan: Detail Cards */}
                <div className="w-full lg:w-[380px] flex flex-col gap-4">
                    {/* Card 1: Title & Price */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-snug tracking-tight">
                                {product.title}
                            </h2>
                            <p className="text-2xl font-black text-gray-900 mt-2">
                                {formatRupiah(product.price)}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-4 border-t border-gray-100 text-xs">
                            <div>
                                <p className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-1">Category</p>
                                <p className="font-semibold text-gray-800">{product.category?.name || "UMUM"}</p>
                            </div>
                            <div>
                                <p className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-1">Condition</p>
                                <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {product.condition}
                                </p>
                            </div>
                            <div>
                                <p className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-1">Brand</p>
                                <p className="font-semibold text-gray-800">{product.brand || "—"}</p>
                            </div>
                            <div>
                                <p className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-1">Location</p>
                                <p className="font-semibold text-gray-800 truncate" title={product.location}>{product.location || "—"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Description */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-2">
                        <p className="font-bold text-[10px] uppercase tracking-widest text-gray-400">Description</p>
                        <p className="text-sm text-gray-600 leading-relaxed font-normal whitespace-pre-wrap">
                            {product.description || "Tidak ada deskripsi."}
                        </p>
                    </div>

                    {/* Card 3: Seller Card */}
                    <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-none">{product.seller?.name || "Seller"}</p>
                                <p className="text-[10px] text-gray-400 font-semibold mt-1">
                                    Joined {product.seller?.createdAt ? new Date(product.seller.createdAt).toLocaleDateString("en-US", { month: 'short', year: 'numeric' }) : "—"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.open(`/admin/users?search=${product.seller?.name || ""}`, '_blank')}
                            className="text-xs font-bold text-gray-900 hover:underline"
                        >
                            View History
                        </button>
                    </div>

                    {/* Card 4: QC Note (Textarea) */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-3">
                        <label className="font-bold text-[10px] uppercase tracking-widest text-gray-400">
                            QC Note / Reason
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Tulis alasan approve/reject..."
                            className="w-full h-20 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none bg-white font-sans transition-all"
                            maxLength={250}
                        />
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
                            <span>Min 10, Max 250 kar.</span>
                            <span>{reason.length}/250</span>
                        </div>
                    </div>

                    {/* Card 5: Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => handleDecision("reject")}
                            disabled={!!submitting}
                            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-extrabold uppercase tracking-wider text-gray-700 py-3.5 rounded transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                            {submitting === "reject" ? "Menolak..." : "Reject Listing"}
                        </button>
                        <button
                            onClick={() => handleDecision("approve")}
                            disabled={!!submitting}
                            className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white text-xs font-extrabold uppercase tracking-wider py-3.5 rounded transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
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
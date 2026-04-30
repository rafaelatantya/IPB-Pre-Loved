"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Check, User, Loader2 } from "lucide-react";
import { getPendingProducts, reviewProduct } from "@/modules/admin/actions";

// Thumbnail klikable (Original Style)
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

export default function AdminQueueDoomScrollPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [submitting, setSubmitting] = useState(null);
    const [flagging, setFlagging] = useState(false);

    async function fetchQueue() {
        try {
            const res = await getPendingProducts();
            if (res.success) {
                setItems(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQueue();
    }, []);

    const item = items[0]; // Ambil yang paling depan (Doom Scroll)

    async function handleDecision(action) {
        if (!item) return;
        let decision = action === "approve" ? "APPROVED" : "REJECTED";
        let note = "";
        
        if (decision === "REJECTED") {
            note = prompt("Alasan Penolakan:", "Foto kurang jelas / Deskripsi tidak sesuai");
            if (!note) return;
        }

        setSubmitting(action);
        try {
            const res = await reviewProduct({ 
                productId: item.id, 
                decision, 
                note: note || "Lolos QC Admin" 
            });

            if (res.success) {
                // Hapus barang yang baru di-review dari state (Doom Scroll effect)
                setItems(prev => prev.slice(1));
                setActiveImg(0);
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
        if (!item?.seller?.id) return;
        setFlagging(true);
        try {
            // Simulasi flag user (bisa dihubungkan ke action nanti)
            await new Promise((r) => setTimeout(r, 500));
            alert("User berhasil diflag.");
        } finally {
            setFlagging(false);
        }
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-6 h-6 animate-spin text-gray-200" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="max-w-5xl mx-auto text-center py-20 bg-white border border-gray-200 rounded-xl text-gray-400 shadow-sm">
                <p className="italic font-medium">Antrean QC Bersih! Tidak ada barang baru menunggu validasi.</p>
                <button onClick={fetchQueue} className="mt-4 text-blue-600 font-semibold hover:underline">Refresh</button>
            </div>
        );
    }

    const allImages = item.images?.length > 0 ? item.images.map(img => img.url) : [null, null, null, null];
    const mainImage = allImages[activeImg];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Review Item: #{item.id}
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Queue Position: 1 / {items.length} items remaining
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

            {/* Content */}
            <div className="flex gap-8">
                {/* Kiri: Galeri Foto */}
                <div className="flex-1">
                    {/* Main Image */}
                    <div className="w-full aspect-[4/3] bg-gray-100 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center mb-3">
                        {mainImage ? (
                            <img src={mainImage} alt={item.title} className="w-full h-full object-cover" />
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

                {/* Kanan: Detail + Aksi */}
                <div className="w-[300px] flex flex-col">
                    {/* Nama & Harga */}
                    <h2 className="text-xl font-bold text-gray-900 leading-snug mb-2">
                        {item.title}
                    </h2>
                    <p className="text-3xl font-bold text-gray-900 mb-5">
                        {formatRupiah(item.price)}
                    </p>

                    {/* Grid info */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                                Category
                            </p>
                            <p className="text-sm text-gray-900">{item.category?.name || "UMUM"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                                Condition
                            </p>
                            <p className="text-sm text-gray-900 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-900 inline-block" />
                                {item.condition}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                                Location
                            </p>
                            <p className="text-sm text-gray-900 truncate">{item.location || "IPB Dramaga"}</p>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="border-t border-gray-100 pt-4 mb-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                            Description
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed italic opacity-80">
                            "{item.description}"
                        </p>
                    </div>

                    {/* Seller Card */}
                    <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.seller?.name}</p>
                            <p className="text-xs text-gray-400">Seller Account</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-100 pt-5 flex gap-3 mt-auto">
                        <button
                            onClick={() => handleDecision("reject")}
                            disabled={!!submitting}
                            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-sm font-semibold text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                            {submitting === "reject" ? "Wait..." : "Reject"}
                        </button>
                        <button
                            onClick={() => handleDecision("approve")}
                            disabled={!!submitting}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" />
                            {submitting === "approve" ? "Wait..." : "Approve"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
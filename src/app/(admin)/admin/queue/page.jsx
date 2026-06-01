"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Check, User, Loader2, PlayCircle } from "lucide-react";
import { getPendingProducts, reviewProduct, toggleFlagUser } from "@/modules/admin/actions";

function formatRupiah(num) {
  if (!num) return "Rp 0";
  return "Rp " + Number(num).toLocaleString("id-ID");
}

function formatSubmitTime(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffHours / 24)} day(s) ago`;
}

function MetaField({ label, children }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-[rgba(119,119,119,0.12)] last:border-0 last:pb-0 font-poppins">
      <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#777777]">
        {label}
      </p>
      <div className="text-[16px] font-medium text-[#1A1C1C] leading-6">
        {children}
      </div>
    </div>
  );
}

function Thumbnail({ media, active, onClick }) {
  const isVideo = media?.type === "video";
  const src = isVideo ? media.thumbnail : media?.url;

  return (
    <div
      onClick={onClick}
      className={`aspect-square rounded-[4px] overflow-hidden cursor-pointer bg-[#E8E8E8] flex items-center justify-center relative transition-all ${active ? "ring-2 ring-[#1A1C1C]" : "hover:opacity-80"
        }`}
    >
      {src ? (
        <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      )}
      {isVideo && (
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
          <PlayCircle className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}

export default function AdminQueueReviewPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [submitting, setSubmitting] = useState(null); // Membuang type generic TS
  const [flagging, setFlagging] = useState(false);
  const [reason, setReason] = useState("");

  async function fetchQueue() {
    setLoading(true);
    try {
      const res = await getPendingProducts();
      if (res && res.success) {
        setItems(res.data || []);
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

  const item = items[0];

  async function handleDecision(action) {
    if (!item) return;
    const finalReason = reason.trim();
    if (action === "reject" && finalReason.length < 10) {
      alert("Alasan penolakan review minimal harus 10 karakter!");
      return;
    }
    setSubmitting(action);
    try {
      const res = await reviewProduct({
        productId: item.id,
        decision: action === "approve" ? "APPROVED" : "REJECTED",
        note: finalReason,
      });
      if (res && res.success) {
        setItems((prev) => prev.slice(1));
        setActiveImg(0);
        setReason("");
      } else {
        alert((res && res.error) || "Gagal memproses review");
      }
    } catch {
      alert("Terjadi kesalahan, coba lagi.");
    } finally {
      setSubmitting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20 bg-white border border-neutral-200/60 rounded-xl text-[#777777] font-poppins shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <p className="italic font-medium text-sm">
          Antrean QC bersih! Tidak ada barang menunggu validasi.
        </p>
        <button
          onClick={fetchQueue}
          className="mt-4 text-[#1A1C1C] font-semibold text-sm underline hover:opacity-80 transition-opacity"
        >
          Refresh
        </button>
      </div>
    );
  }

  const mediaList = [];
  if (item.videoUrl) {
    mediaList.push({ type: "video", url: item.videoUrl, thumbnail: item.images?.[0]?.url });
  }
  if (item.images && item.images.length > 0) {
    item.images.forEach((img) => mediaList.push({ type: "image", url: img.url }));
  }
  while (mediaList.length < 4) {
    mediaList.push({ type: "image", url: null });
  }

  const currentMedia = mediaList[activeImg] ?? null;

  return (
    <div className="font-poppins max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold leading-tight text-[#1A1C1C] tracking-tight">
            Review Item: #{item.id}
          </h1>
          <p className="text-sm font-medium text-[#474747] tracking-[0.4px]">
            Submitted {formatSubmitTime(item.createdAt)} by StudentID:{" "}
            {item.seller?.studentId ?? item.seller?.id ?? "—"}
          </p>
        </div>
      </div>

      {/* Body Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Kolom Kiri: Media Visual */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-neutral-100 border border-neutral-200/60 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex items-center justify-center">
            {currentMedia?.type === "video" ? (
              <video src={currentMedia.url} controls className="w-full h-full object-contain bg-black" />
            ) : currentMedia?.url ? (
              <img src={currentMedia.url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="p-4 bg-neutral-200/60 rounded-xl">
                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="1.5" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}
          </div>

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

        {/* Kolom Kanan: Detail & Validasi */}
        <div className="flex flex-col gap-6">
          {/* Card: Title & Price */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#1A1C1C] leading-snug">
              {item.title}
            </h2>
            <p className="text-2xl font-bold text-black tracking-tight">
              {formatRupiah(item.price)}
            </p>
            <div className="pt-2">
              <MetaField label="Category">{item.category?.name ?? "UMUM"}</MetaField>
              <MetaField label="Condition">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                  {item.condition ?? "—"}
                </span>
              </MetaField>
              <MetaField label="Brand">{item.brand ?? "—"}</MetaField>
              <MetaField label="Location">{item.location ?? "IPB Dramaga"}</MetaField>
            </div>
          </div>

          {/* Card: Description */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#777777]">
              Description
            </p>
            <p className="text-sm font-normal text-[#474747] leading-relaxed whitespace-pre-wrap">
              {item.description ?? "Tidak ada deskripsi."}
            </p>
          </div>

          {/* Seller Profile Card */}
          <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-neutral-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-[#777777]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1A1C1C] truncate">
                {item.seller?.name ?? "Seller"}
              </p>
              <p className="text-xs text-[#474747] mt-0.5">
                Joined{" "}
                {item.seller?.createdAt
                  ? new Date(item.seller.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                  : "—"}{" "}
                • {item.seller?.totalSold ?? 0} sold
              </p>
            </div>
            <button
              onClick={() =>
                window.open(`/admin/users?search=${encodeURIComponent(item.seller?.name ?? "")}`, "_blank")
              }
              className="text-xs font-semibold text-black hover:underline px-2 flex-shrink-0"
            >
              View History
            </button>
          </div>

          {/* QC Note Input */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <label className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#777777]">
              QC Note / Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tulis alasan approve/reject... (min. 10 karakter khusus Reject)"
              maxLength={250}
              rows={3}
              className="w-full px-3 py-2.5 text-sm text-[#1A1C1C] border border-neutral-300 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-black resize-none bg-white font-sans transition-all placeholder:text-neutral-400"
            />
            <div className="flex justify-between text-[11px] font-semibold text-[#777777]">
              <span>Min 10 karakter (khusus Reject), Maks 250</span>
              <span>{reason.length}/250</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-4">
            <button
              onClick={() => handleDecision("reject")}
              disabled={!!submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[4px] border border-neutral-300 text-sm font-bold text-[#1A1C1C] bg-white hover:bg-neutral-50 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              {submitting === "reject" ? "Processing..." : "Reject Listing"}
            </button>
            <button
              onClick={() => handleDecision("approve")}
              disabled={!!submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[4px] bg-black text-white text-sm font-bold hover:bg-zinc-900 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {submitting === "approve" ? "Processing..." : "Approve Listing"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
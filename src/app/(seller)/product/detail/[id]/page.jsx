"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  CheckCircle2,
  Clock,
  XCircle,
  Tag,
  MessageCircle,
} from "lucide-react";
import { getProductById, markProductAsSold } from "@/modules/product/actions";

const STATUS_CONFIG = {
  PENDING: {
    label: "Menunggu Validasi",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  APPROVED: {
    label: "Aktif & Tayang",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  REJECTED: {
    label: "Ditolak QC",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  SOLD: {
    label: "Terjual",
    icon: Tag,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
};

function formatRupiah(num) {
  if (!num) return "Rp 0";
  return "Rp " + Number(num).toLocaleString("id-ID");
}

export default function SellerProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAsSold, setMarkingAsSold] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        const res = await getProductById(id);
        if (res.success) {
          setProduct(res.data);
        } else {
          setError(res.error || "Produk tidak ditemukan.");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleMarkAsSold = async () => {
    if (!product || !confirm("Tandai produk ini sebagai terjual?")) return;
    setMarkingAsSold(true);
    try {
      const res = await markProductAsSold(product.id);
      if (res.success) {
        setProduct((prev) => ({ ...prev, status: "SOLD" }));
      } else {
        alert(res.error || "Gagal menandai produk.");
      }
    } catch {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setMarkingAsSold(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500 font-medium">{error || "Produk tidak ditemukan."}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xs font-semibold text-[#1A1C1C] underline hover:opacity-70"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[product.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;
  const allImages = (product.images || []).map((img) => img.url).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Detail Produk</span>
        </div>

        {/* Status Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${statusCfg.bg} ${statusCfg.border}`}>
          <StatusIcon className={`w-5 h-5 ${statusCfg.color} flex-shrink-0`} />
          <div>
            <p className={`text-sm font-bold ${statusCfg.color}`}>
              Status: {statusCfg.label}
            </p>
            {product.status === "PENDING" && (
              <p className="text-xs text-amber-700 mt-0.5">
                Produkmu sedang dalam antrean review Admin. Biasanya selesai dalam 1×24 jam.
              </p>
            )}
            {product.status === "REJECTED" && (
              <p className="text-xs text-red-700 mt-0.5">
                Produk ditolak oleh Admin. Cek alasan penolakan lalu edit ulang produkmu.
              </p>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left: Images */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
              {allImages.length > 0 ? (
                <img
                  src={allImages[activeImg]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-4 opacity-30">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="1.5" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-black" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1C1C] leading-tight">{product.title}</h1>
              <p className="text-3xl font-black text-black mt-2">{formatRupiah(product.price)}</p>
            </div>

            <div className="flex flex-col divide-y divide-gray-100 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {[
                { label: "Kategori", value: product.category?.name ?? "Umum" },
                { label: "Kondisi", value: product.condition ?? "—" },
                { label: "Lokasi COD", value: product.location ?? "IPB Dramaga" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between px-5 py-3.5">
                  <span className="text-xs font-bold uppercase tracking-[1px] text-gray-400">
                    {row.label}
                  </span>
                  <span className="text-sm font-semibold text-[#1A1C1C]">{row.value}</span>
                </div>
              ))}
            </div>

            {product.description && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-[1px] text-gray-400 mb-2">Deskripsi</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              {product.status === "REJECTED" && (
                <button
                  onClick={() => router.push(`/product/edit/${product.id}`)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-lg font-semibold text-sm hover:bg-zinc-900 transition-all active:scale-[0.98]"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Produk
                </button>
              )}

              {product.status === "APPROVED" && (
                <>
                  <button
                    onClick={() => router.push(`/product/edit/${product.id}`)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-300 text-[#1A1C1C] rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Produk
                  </button>
                  <button
                    onClick={handleMarkAsSold}
                    disabled={markingAsSold}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-lg font-semibold text-sm hover:bg-zinc-900 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <Tag className="w-4 h-4" />
                    {markingAsSold ? "Memproses..." : "Tandai Terjual"}
                  </button>
                </>
              )}

              {product.status === "SOLD" && (
                <div className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold text-sm text-center">
                  Produk ini sudah terjual
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
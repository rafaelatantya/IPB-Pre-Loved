"use client";

import React, { useState } from "react";
import { ArrowLeft, Share2, MapPin, Tag, ShieldCheck, MessageCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import WishlistButton from "@/modules/wishlist/components/WishlistButton";

export default function ProductDetailView({ product }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const mediaList = [];
  if (product.videoUrl) {
    mediaList.push({ type: "video", url: product.videoUrl });
  }
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => mediaList.push({ type: "image", url: img.url }));
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionLabel = (cond) => {
    switch (cond) {
      case "NEW": return "Baru";
      case "LIKE_NEW": return "Seperti Baru";
      case "GOOD": return "Bagus";
      case "FAIR": return "Cukup";
      default: return cond;
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* NAVIGATION BAR */}
      <div className="w-full border-b border-[#E2E8F0] sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <div className="w-full px-6 md:px-10 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#0F172A] font-bold text-xs uppercase tracking-widest hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Share2 className="w-5 h-5 text-gray-500" /></button>
            <WishlistButton 
              key={product.id}
              productId={product.id} 
              className="p-2 hover:bg-gray-100 rounded-full"
              iconSize={20}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: MEDIA GALLERY */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-sm relative group">
              {mediaList.length > 0 ? (
                mediaList[activeIndex].type === "video" ? (
                  <video 
                    src={mediaList[activeIndex].url} 
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                  />
                ) : (
                  <img 
                    src={mediaList[activeIndex].url} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {mediaList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {mediaList.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeIndex === idx ? "border-[#2563EB] shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {media.type === "video" ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white opacity-50" />
                      </div>
                    ) : (
                      <img src={media.url} className="w-full h-full object-cover" alt="" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-[#2563EB] text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100">
                {product.category?.name || "Uncategorized"}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100">
                {getConditionLabel(product.condition)}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] leading-tight mb-2 uppercase tracking-tight">
              {product.title}
            </h1>
            
            <div className="text-3xl font-black text-[#2563EB] mb-8">
              {formatPrice(product.price)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#E2E8F0]">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lokasi</p>
                  <p className="text-sm font-bold text-gray-700">{product.location || "IPB Dramaga"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#E2E8F0]">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Diposting</p>
                  <p className="text-sm font-bold text-gray-700">{new Date(product.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Deskripsi Barang</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {product.description}
              </p>
            </div>

            {/* SELLER INFO & ACTION */}
            <div className="mt-auto p-6 bg-[#0F172A] rounded-3xl text-white shadow-xl shadow-blue-900/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-black text-xl">
                    {product.seller?.name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Penjual</p>
                    <p className="font-bold text-lg">{product.seller?.name || "User IPB"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-[10px] font-bold uppercase">Terverifikasi</span>
                </div>
              </div>

              <a 
                href={`https://wa.me/${product.seller?.whatsappNumber || "628"}`}
                target="_blank"
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20"
              >
                <MessageCircle className="w-6 h-6" />
                Hubungi Penjual via WhatsApp
              </a>
              <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em]">
                Transaksi dilakukan di luar platform IPB Pre-Loved
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

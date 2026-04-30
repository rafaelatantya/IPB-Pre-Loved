"use client";

export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Heart, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  Tag, 
  Clock, 
  Share2,
  CheckCircle2,
  Info,
  PlayCircle
} from "lucide-react";
import Link from "next/link";
import ProductCard from "@/modules/catalog/components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Satukan media: Video di urutan pertama (jika ada), lalu foto-foto
  const mediaList = [];
  if (product?.videoUrl) {
    mediaList.push({ type: "video", url: product.videoUrl, thumbnail: product.images?.[0]?.url });
  }
  if (product?.images) {
    product.images.forEach(img => mediaList.push({ type: "image", ...img }));
  }

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const res = await response.json();
        if (res.success) {
          setProduct(res.data);
          setRecommended(res.recommended || []);
        } else {
          setError(res.error || "Gagal memuat produk");
        }
      } catch (err) {
        setError("Terjadi kesalahan jaringan");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 uppercase tracking-widest text-xs font-bold italic">Memuat detail produk...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 uppercase italic mb-4">WADUH! {error || "Produk Tidak Ditemukan"}</h2>
        <button onClick={() => router.push("/catalog")} className="px-6 py-3 bg-blue-600 text-white font-bold uppercase tracking-widest rounded-xl">
          KEMBALI KE KATALOG
        </button>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const phone = product.seller?.whatsappNumber?.replace(/\D/g, "") || "628123456789";
    const text = encodeURIComponent(`Halo ${product.seller?.name}, saya tertarik dengan produk "${product.title}" seharga Rp ${product.price?.toLocaleString("id-ID")} yang Anda jual di IPB Preloved. Apakah masih tersedia?`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const currentMedia = mediaList[activeIndex];

  return (
    <div className="w-full min-h-screen bg-white font-sans">
      
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
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${isWishlisted ? "text-red-500" : "text-gray-500"}`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-6 md:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: IMAGE GALLERY (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-square bg-[#F8FAFC] overflow-hidden border border-[#E2E8F0] rounded-3xl relative group">
              {currentMedia?.type === "video" ? (
                <video 
                  src={currentMedia.url} 
                  controls 
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <img 
                  src={currentMedia?.url || "/placeholder-product.png"} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {mediaList.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all ${activeIndex === idx ? "w-8 bg-[#2563EB]" : "w-2 bg-gray-300"}`}></div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {mediaList.map((media, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative shrink-0 w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeIndex === idx ? "border-[#2563EB]" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  {media.type === "video" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <img 
                    src={media.type === "video" ? media.thumbnail : media.url} 
                    className="w-full h-full object-cover" 
                    alt={`Thumb ${idx}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: INFO & ACTIONS (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-[#2563EB] text-[10px] font-bold rounded-full uppercase tracking-widest border border-blue-100">
                  {product.category?.name || "UMUM"}
                </span>
                <span className="px-3 py-1 bg-green-50 text-[#16A34A] text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-100">
                  {product.condition}
                </span>
              </div>
              
              <h1 className="text-[#0F172A] text-3xl md:text-4xl font-bold leading-tight tracking-tight uppercase italic">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-2">
                <span className="text-[#2563EB] text-4xl font-extrabold tracking-tighter">
                  Rp {product.price?.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-100 text-[#64748B] text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  {product.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString("id-ID") : "Baru Diposting"}
                </div>
              </div>
            </div>

            {/* SELLER CARD */}
            <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {product.seller?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-black font-bold uppercase text-sm tracking-wide">{product.seller?.name || "Penjual IPB"}</span>
                      <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50" />
                    </div>
                    <span className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest">
                      {product.seller?.userType || "STUDENT"} IPB
                    </span>
                  </div>
                </div>
                <button className="text-[#2563EB] text-xs font-bold underline uppercase tracking-widest">LIHAT PROFIL</button>
              </div>

              <button 
                onClick={handleWhatsApp}
                className="w-full h-14 bg-[#16A34A] text-white font-bold uppercase tracking-[2px] rounded-2xl flex justify-center items-center gap-3 hover:bg-[#15803d] transition-all shadow-md group active:scale-95"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                HUBUNGI VIA WHATSAPP
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-widest border-b border-gray-100 pb-2">
                <Info className="w-4 h-4" />
                Info Tambahan
              </div>
              <div className="grid grid-cols-2 gap-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-tight">Kondisi</span>
                  <span className="text-black text-sm font-semibold">{product.condition}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-tight">Lokasi COD</span>
                  <span className="text-black text-sm font-semibold">{product.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION SECTION */}
        <div className="mt-20 flex flex-col gap-8 max-w-4xl">
          <div className="flex flex-col gap-4">
            <h2 className="text-black text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-4 inline-block self-start">DESKRIPSI PRODUK</h2>
            <p className="text-[#475569] text-lg leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
            <ShieldCheck className="w-16 h-16 text-[#2563EB] shrink-0" strokeWidth={1} />
            <div className="flex flex-col gap-2">
              <h3 className="text-[#2563EB] text-lg font-bold uppercase tracking-wide">Transaksi Aman Khusus IPB</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">
                Pastikan transaksi dilakukan dengan sistem Cash on Delivery (COD) di lingkungan kampus IPB. Selalu periksa kondisi barang secara langsung sebelum melakukan pembayaran. Gunakan akun IPB Apps Anda untuk keamanan bersama.
              </p>
            </div>
          </div>
        </div>

        {/* RECOMMENDED SECTION */}
        <div className="mt-32 flex flex-col gap-12">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <h2 className="text-black text-base md:text-xl font-normal leading-relaxed uppercase tracking-wide">REKOMENDASI UNTUK ANDA</h2>
              <div className="w-20 h-1 bg-black"></div>
            </div>
            <Link href="/catalog" className="text-black text-sm font-semibold underline uppercase tracking-widest">LIHAT LAINNYA</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.length > 0 ? (
              recommended.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400 py-10 italic">Tidak ada rekomendasi saat ini.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

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
  PlayCircle,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import ProductCard from "@/modules/catalog/components/ProductCard";
import WishlistButton from "@/modules/wishlist/components/WishlistButton";
import { openWhatsAppChat } from "@/lib/whatsapp";
import { useSession } from "next-auth/react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
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

  const handleWhatsApp = async () => {
    console.log("[WA_LEADS] WhatsApp button clicked, tracking engagement for product ID:", product.id);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "POST",
      });
      const res = await response.json();
      console.log("[WA_LEADS] Click tracked successfully via API, response:", res);
    } catch (err) {
      console.error("[WA_LEADS] Failed to track WhatsApp click via API:", err);
    }
    
    openWhatsAppChat(
      product.seller?.name,
      product.seller?.whatsappNumber,
      product.title,
      product.price
    );
  };

  const currentMedia = mediaList[activeIndex];

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] md:bg-white font-poppins md:font-sans">


      {/* BREADCRUMB (Desktop Only) */}
      <div className="hidden md:block w-full bg-white border-b border-gray-200">
        <div className="w-full max-w-[1280px] px-10 py-6 mx-auto flex items-center gap-2">
          <Link href="/catalog" className="text-[#777777] text-[14px] font-poppins font-normal leading-[16.8px] hover:text-black uppercase">KATALOG</Link>
          <ChevronRight className="w-4 h-4 text-[#777777]" />
          <span className="text-[#020617] text-[14px] font-poppins font-normal leading-[16.8px] uppercase">PRODUCT DETAIL</span>
        </div>
      </div>

      <div className="w-full bg-indigo-50 md:bg-[#F8FAFC] pb-32 md:pb-12">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8 md:py-12 flex flex-col gap-8">
          
          {/* Status Warning Banner for Non-Approved Products */}
          {product.status !== "APPROVED" && (
            <div className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 shadow-sm ${
              product.status === "PENDING" 
                ? "bg-amber-50 border-amber-200 text-amber-900" 
                : product.status === "REJECTED"
                ? "bg-rose-50 border-rose-200 text-rose-955"
                : "bg-slate-100 border-slate-200 text-slate-900"
            }`}>
              <div className="flex items-start md:items-center gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${
                  product.status === "PENDING"
                    ? "bg-amber-100 text-amber-600 shadow-sm"
                    : product.status === "REJECTED"
                    ? "bg-rose-100 text-rose-600 shadow-sm"
                    : "bg-slate-200 text-slate-600 shadow-sm"
                }`}>
                  {product.status === "PENDING" && <Clock className="w-6 h-6 animate-pulse" />}
                  {product.status === "REJECTED" && <Info className="w-6 h-6" />}
                  {product.status === "SOLD" && <Tag className="w-6 h-6" />}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base md:text-[18px] font-bold tracking-tight font-poppins uppercase leading-snug">
                    Listing Tidak Live ({product.status})
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed font-normal opacity-90 max-w-2xl font-poppins">
                    {product.status === "PENDING" && "Produk ini tidak tayang di katalog publik karena statusnya masih PENDING (Menunggu QC & Persetujuan Admin). Hanya Anda (Penjual) dan Admin yang dapat mengakses preview halaman ini."}
                    {product.status === "REJECTED" && "Produk ini tidak tayang di katalog publik karena statusnya REJECTED (Ditolak QC oleh Admin). Silakan sunting produk ini melalui dashboard untuk mengajukan kembali."}
                    {product.status === "SOLD" && "Produk ini tidak tayang di katalog publik karena statusnya SOLD (Sudah Terjual)."}
                  </p>
                </div>
              </div>
              <div className="self-stretch md:self-center flex items-center justify-end">
                <div className="px-3.5 py-1.5 bg-white border border-current/10 rounded-full flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase font-poppins shadow-xs select-none shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                  <span>
                    Viewing as: {session?.user?.role === "ADMIN" ? "Admin" : "Uploader"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            
            {/* LEFT COLUMN: IMAGES & DESCRIPTION */}
            <div className="flex-1 flex flex-col gap-8 lg:w-[680px]">
              
              {/* IMAGE GALLERY (Responsive) */}
              <div className="flex flex-col gap-4 md:gap-6">
                {/* Main Image */}
                <div className="w-full aspect-square md:h-[510px] bg-neutral-200 md:bg-gray-100 rounded-sm md:outline md:outline-1 md:outline-[#C6C6C6] md:-outline-offset-1 flex justify-center items-center relative overflow-hidden group">
                  {currentMedia?.type === "video" ? (
                    <video src={currentMedia.url} controls className="w-full h-full object-contain bg-black" />
                  ) : (
                    <img src={currentMedia?.url || "/placeholder-product.png"} alt={product.title} className="w-full h-full object-contain" />
                  )}
                </div>

                {/* Thumbnails */}
                <div className="flex flex-row gap-3 md:grid md:grid-cols-4 md:gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                  {mediaList.map((media, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative shrink-0 w-20 h-20 md:w-full md:h-[158px] bg-neutral-200 md:bg-gray-100 rounded-sm md:outline md:outline-1 md:outline-[#C6C6C6] md:-outline-offset-1 overflow-hidden transition-all ${activeIndex === idx ? "ring-2 ring-blue-600 md:outline-[#2563EB] md:outline-2" : "hover:opacity-80"}`}
                    >
                      {media.type === "video" ? (
                        <video src={media.url} className="w-full h-full object-cover" preload="metadata" muted playsInline />
                      ) : (
                        <img src={media.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      )}
                      {media.type === "video" && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <PlayCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* MOBILE PRODUCT TITLE & PRICE */}
              <div className="md:hidden flex flex-col gap-4">
                  <div className="flex flex-row gap-2">
                      <div className="px-2 py-0.5 bg-blue-600 rounded-[36px] shadow-[0px_1px_2px_0px_rgba(105,81,255,0.05)] flex justify-center items-center overflow-hidden">
                          <span className="text-green-50 text-xs font-semibold font-poppins uppercase">{product.category?.name || "UMUM"}</span>
                      </div>
                      <div className="px-2 py-0.5 bg-green-600 rounded-[36px] shadow-[0px_1px_2px_0px_rgba(105,81,255,0.05)] flex justify-center items-center overflow-hidden">
                          <span className="text-green-50 text-xs font-semibold font-poppins uppercase">{product.condition}</span>
                      </div>
                  </div>
                  <div className="flex flex-col gap-2">
                      <h1 className="text-black text-2xl font-semibold font-poppins leading-7 uppercase">{product.title}</h1>
                      <div className="text-black text-xl font-semibold font-poppins">Rp {product.price?.toLocaleString("id-ID")}</div>
                      <div className="flex items-center gap-1.5">
                          <MapPin className="size-4 text-slate-700" />
                          <span className="text-slate-700 text-sm font-semibold font-poppins leading-4">{product.location}</span>
                      </div>
                  </div>
              </div>

              {/* DESCRIPTION */}
              <div className="p-6 bg-white rounded-sm md:bg-transparent md:p-0 md:pt-8 md:border-t md:border-[#C6C6C6] flex flex-col gap-4 md:gap-6">
                <h2 className="text-black text-lg md:text-[18px] font-poppins font-semibold uppercase leading-5 md:leading-[21.6px]">DESKRIPSI PRODUK</h2>
                <div className="text-black text-xs md:text-[16px] font-poppins font-normal leading-4 md:leading-[24px] text-justify whitespace-pre-line">
                  {product.description}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: INFO & ACTIONS */}
            <div className="w-full lg:w-[500px] flex flex-col gap-8">
              
              {/* DESKTOP INFO AREA */}
              <div className="hidden md:flex flex-col gap-4">
                {product?.status === "PENDING" ? (
                  <div className="h-[24px] px-2.5 bg-orange-50 rounded-full inline-flex items-center gap-2 self-start shadow-[0_1px_2px_rgba(105,81,255,0.05)] border border-orange-200">
                     <Clock className="w-3 h-3 text-orange-500" />
                     <span className="text-orange-500 text-[12px] font-poppins font-semibold">Menunggu Persetujuan</span>
                  </div>
                ) : (
                  <div className="h-[24px] px-2.5 bg-[#ECFEFF] rounded-full inline-flex items-center gap-2 self-start shadow-[0_1px_2px_rgba(105,81,255,0.05)]">
                     <div className="w-2.5 h-2.5 bg-[#06B6D4] rounded-full"></div>
                     <span className="text-[#06B6D4] text-[12px] font-poppins font-semibold leading-[14.4px]">Admin Verified</span>
                  </div>
                )}
                
                <h1 className="text-black text-[40px] font-poppins font-semibold leading-[48px] uppercase">{product.title}</h1>
                <div className="text-black text-[24px] font-poppins font-normal leading-[28.8px]">Rp {product.price?.toLocaleString("id-ID")}</div>
              </div>

              {/* DESKTOP INFO BOX */}
              <div className="hidden md:flex p-6 bg-white outline outline-1 outline-[#E2E8F0] -outline-offset-1 flex flex-col gap-4">
                 <div className="flex flex-row gap-4">
                    <div className="w-[157px] flex flex-col gap-1">
                       <span className="text-[#777777] text-[12px] font-poppins uppercase leading-[18px]">KATEGORI</span>
                       <span className="text-black text-[14px] font-poppins leading-[16.8px] uppercase">{product.category?.name || "UMUM"}</span>
                    </div>
                    <div className="w-[157px] flex flex-col gap-1">
                       <span className="text-[#777777] text-[12px] font-poppins uppercase leading-[18px]">KONDISI</span>
                       <span className="text-black text-[14px] font-poppins leading-[16.8px] uppercase">{product.condition}</span>
                    </div>
                 </div>
                 <div className="w-full flex flex-col gap-1 pt-2">
                    <span className="text-[#777777] text-[12px] font-poppins uppercase leading-[18px]">LOKASI</span>
                    <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-black" />
                       <span className="text-black text-[14px] font-poppins leading-[16.8px] uppercase">{product.location}</span>
                    </div>
                 </div>
              </div>

              {/* SELLER IDENTITY BOX */}
              <div className="p-6 bg-white rounded-sm md:outline md:outline-1 md:outline-[#E2E8F0] md:-outline-offset-1 flex flex-col gap-4 shadow-[0px_20px_40px_0px_rgba(26,28,28,0.06)] md:shadow-none">
                 <h2 className="text-black text-lg font-semibold font-poppins leading-5 uppercase">INFORMASI PENJUAL</h2>
                 <div className="flex items-center gap-4">
                    <img src={product.seller?.image || `https://ui-avatars.com/api/?name=${product.seller?.name}&background=random`} alt={product.seller?.name} className="size-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 flex flex-col justify-center items-start gap-1">
                        <span className="text-black text-sm md:text-[18px] font-poppins font-semibold uppercase">{product.seller?.name || "NAMA PENJUAL"}</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-zinc-700 text-[10px] md:text-xs font-semibold font-poppins uppercase">MEMBER SEJAK</span>
                        <span className="text-black text-xs font-semibold font-poppins uppercase">{product.seller?.createdAt ? new Date(product.seller.createdAt).getFullYear() : "2024"}</span>
                    </div>
                 </div>
              </div>

              {/* WARNING BOX */}
              <div className="p-4 bg-zinc-100 md:bg-[#E2E2E2] rounded-sm border-l-4 border-black flex items-start gap-3 md:outline md:outline-1 md:outline-[#C6C6C6] md:-outline-offset-1 md:border-none">
                 <Info className="size-4 md:w-4 md:h-4 text-black md:text-[#5E5E5E] shrink-0 mt-0.5" />
                 <p className="text-zinc-900 md:text-[#5E5E5E] text-xs md:text-[12px] font-poppins leading-4 md:leading-[18px]">
                    Bertransaksilah secara COD (Cash on Delivery) di area kampus IPB. Hindari transfer uang sebelum menerima dan mengecek barang.
                 </p>
              </div>

              {/* DESKTOP ACTIONS */}
              <div className="hidden md:flex flex-col gap-2">
                 <button onClick={handleWhatsApp} className="w-full h-[46px] bg-[#16A34A] rounded-md shadow-[0_1px_2px_rgba(105,81,255,0.05)] flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
                    <MessageCircle className="w-[18px] h-[18px] text-[#F0FDF4]" />
                    <span className="text-[#F0FDF4] text-[14px] font-poppins font-semibold uppercase leading-[16.8px]">HUBUNGI VIA WHATSAPP</span>
                 </button>
                 <div className="relative w-full h-[46px]">
                    <div className={`w-full h-full rounded-md shadow-[0_1px_2px_rgba(105,81,255,0.05)] flex items-center justify-center gap-2 transition-colors ${isWishlisted ? "bg-red-500 hover:bg-red-600" : "bg-[#2563EB] hover:bg-blue-700"}`}>
                       <Heart className={`w-[18px] h-[18px] text-[#F0FDF4] ${isWishlisted ? "fill-current" : ""}`} />
                       <span className="text-[#F0FDF4] text-[14px] font-poppins font-semibold uppercase leading-[16.8px]">
                         {isWishlisted ? "TERSIMPAN DI WISHLIST" : "TAMBAH KE WISHLIST"}
                       </span>
                    </div>
                    <WishlistButton productId={product.id} className="absolute inset-0 w-full h-full opacity-0" iconSize={0} onToggle={setIsWishlisted} />
                 </div>
              </div>

            </div>
          </div>

          {/* RECOMMENDED SECTION */}
          <div className="mt-20 md:mt-32 flex flex-col gap-8 md:gap-12">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-2">
                <h2 className="text-black text-base md:text-xl font-normal leading-relaxed uppercase tracking-wide">REKOMENDASI UNTUK ANDA</h2>
                <div className="w-20 h-1 bg-black"></div>
              </div>
              <Link href="/catalog" className="text-black text-sm font-semibold underline uppercase tracking-widest">LIHAT LAINNYA</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {recommended.length > 0 ? (
                recommended.map((prod) => (
                  <ProductCard key={prod.id} product={prod} variant="landing" />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-400 py-10 italic">Tidak ada rekomendasi saat ini.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE STICKY FOOTER */}
      <div className="md:hidden fixed bottom-20 left-0 w-full p-4 bg-white shadow-[0px_-10px_40px_0px_rgba(26,28,28,0.06)] z-50">
          <div className="w-full flex justify-start items-center gap-4">
              <button 
                onClick={handleWhatsApp}
                className="flex-1 px-6 py-4 bg-green-600 rounded-sm flex justify-center items-center gap-2 active:scale-[0.98] transition-transform"
              >
                  <MessageCircle className="size-5 text-stone-200" />
                  <span className="text-center text-stone-200 text-sm font-bold font-inter uppercase leading-tight tracking-wider">
                    HUBUNGI VIA<br/>WHATSAPP
                  </span>
              </button>
              <div className={`relative size-12 rounded-sm outline outline-1 outline-neutral-500/40 flex justify-center items-center active:scale-95 transition-transform ${isWishlisted ? "bg-red-500" : "bg-white"}`}>
                  <Heart className={`size-5 ${isWishlisted ? "text-white fill-current" : "text-gray-400"}`} />
                  <WishlistButton productId={product.id} className="absolute inset-0 w-full h-full opacity-0" iconSize={0} onToggle={setIsWishlisted} />
              </div>
          </div>
      </div>

    </div>
  );
}


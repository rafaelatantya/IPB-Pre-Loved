"use client";

import React, { useState } from "react";
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
  Info
} from "lucide-react";
import Link from "next/link";
import ProductCard from "@/modules/catalog/components/ProductCard";

// Mock Data untuk Detail
const PRODUCT_DETAIL = {
  id: "1",
  title: "Jas Laboratorium Ukuran L - Kondisi Sangat Baik",
  price: 80000,
  category: "PRAKTIKUM",
  condition: "BAIK",
  location: "DRAMAGA, BOGOR",
  timePosted: "2 HARI LALU",
  seller: {
    name: "Andi Mahasiswa",
    joined: "SEPTEMBER 2023",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    rating: 4.8,
    totalSales: 12
  },
  description: "Jas laboratorium warna putih, ukuran L. Baru dipakai 1 semester untuk praktikum Kimia Dasar. Kondisi masih sangat putih, tidak ada noda kimia yang membekas, kancing lengkap. \n\nCocok untuk mahasiswa baru yang mencari perlengkapan praktikum dengan harga terjangkau. Bahan kain tebal dan nyaman dipakai lama di lab.",
  images: [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800",
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800",
    "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=800"
  ],
  specs: [
    { label: "UKURAN", value: "L (LARGE)" },
    { label: "BAHAN", value: "KATUN DRILL" },
    { label: "WARNA", value: "PUTIH BERSIH" }
  ]
};

const RECOMMENDED = [
  { id: "4", title: "Buku Kalkulus Edisi 9", price: 150000, condition: "BAIK", category: "BUKU", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop", location: "BABAKAN" },
  { id: "8", title: "Modul Praktikum Fisika", price: 25000, condition: "BAIK", category: "BUKU", image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=400&auto=format&fit=crop", location: "DRAMAGA" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
            <div className="aspect-square bg-[#F8FAFC] overflow-hidden border border-[#E2E8F0] rounded-3xl relative">
              <img 
                src={PRODUCT_DETAIL.images[activeImage]} 
                alt="Product Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {PRODUCT_DETAIL.images.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all ${activeImage === idx ? "w-8 bg-[#2563EB]" : "w-2 bg-gray-300"}`}></div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {PRODUCT_DETAIL.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? "border-[#2563EB]" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: INFO & ACTIONS (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-[#2563EB] text-[10px] font-bold rounded-full uppercase tracking-widest border border-blue-100">
                  {PRODUCT_DETAIL.category}
                </span>
                <span className="px-3 py-1 bg-green-50 text-[#16A34A] text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-100">
                  {PRODUCT_DETAIL.condition}
                </span>
              </div>
              
              <h1 className="text-[#0F172A] text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                {PRODUCT_DETAIL.title}
              </h1>
              
              <div className="flex items-baseline gap-2">
                <span className="text-[#2563EB] text-4xl font-extrabold">
                  Rp {PRODUCT_DETAIL.price.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-center gap-6 py-4 border-y border-gray-100 text-[#64748B] text-xs font-semibold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  {PRODUCT_DETAIL.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {PRODUCT_DETAIL.timePosted}
                </div>
              </div>
            </div>

            {/* SELLER CARD */}
            <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img src={PRODUCT_DETAIL.seller.avatar} alt="Seller" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-black font-bold uppercase text-sm tracking-wide">{PRODUCT_DETAIL.seller.name}</span>
                      {PRODUCT_DETAIL.seller.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50" />}
                    </div>
                    <span className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest">BERGABUNG {PRODUCT_DETAIL.seller.joined}</span>
                  </div>
                </div>
                <button className="text-[#2563EB] text-xs font-bold underline uppercase tracking-widest">PROFIL</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-2xl border border-gray-100 flex flex-col items-center gap-1">
                  <span className="text-black font-bold text-sm">{PRODUCT_DETAIL.seller.rating}</span>
                  <span className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-tighter">RATING</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-gray-100 flex flex-col items-center gap-1">
                  <span className="text-black font-bold text-sm">{PRODUCT_DETAIL.seller.totalSales}</span>
                  <span className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-tighter">TERJUAL</span>
                </div>
              </div>

              <button className="w-full h-14 bg-[#16A34A] text-white font-bold uppercase tracking-[2px] rounded-2xl flex justify-center items-center gap-3 hover:bg-[#15803d] transition-all shadow-md group">
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                HUBUNGI VIA WHATSAPP
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-widest border-b border-gray-100 pb-2">
                <Info className="w-4 h-4" />
                Spesifikasi
              </div>
              <div className="grid grid-cols-2 gap-y-4">
                {PRODUCT_DETAIL.specs.map((spec, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-tight">{spec.label}</span>
                    <span className="text-black text-sm font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION SECTION */}
        <div className="mt-20 flex flex-col gap-8 max-w-4xl">
          <div className="flex flex-col gap-4">
            <h2 className="text-black text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-4 inline-block self-start">DESKRIPSI PRODUK</h2>
            <p className="text-[#475569] text-lg leading-relaxed whitespace-pre-line">
              {PRODUCT_DETAIL.description}
            </p>
          </div>

          <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
            <ShieldCheck className="w-16 h-16 text-[#2563EB] shrink-0" strokeWidth={1} />
            <div className="flex flex-col gap-2">
              <h3 className="text-[#2563EB] text-lg font-bold uppercase tracking-wide">Transaksi Aman Khusus IPB</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">
                Pastikan transaksi dilakukan dengan sistem Cash on Delivery (COD) di lingkungan kampus IPB. Selalu periksa kondisi barang secara langsung sebelum melakukan pembayaran.
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
            {RECOMMENDED.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

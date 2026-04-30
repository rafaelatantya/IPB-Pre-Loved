"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, MapPin, Grid, MessageCircle, Heart, Tag, ShieldCheck } from "lucide-react";
import ProductCard from "@/modules/catalog/components/ProductCard";
import { getFeaturedProducts } from "@/modules/catalog/services"; // Tetap simpan jika ada dep lain
import { upgradeToSeller } from "@/modules/user/actions";
export const dynamic = "force-dynamic";

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    async function loadFeatured() {
      if (status === "authenticated") {
        setLoading(true);
        try {
          const response = await fetch("/api/products/featured");
          const res = await response.json();
          if (res.success) {
            setFeaturedProducts(res.data || []);
          }
        } catch (error) {
          console.error("Failed to load featured products:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadFeatured();
  }, [status]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/catalog`);
    }
  };

  const handleJualSekarang = async () => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    const userRole = session?.user?.role;

    if (userRole === "BUYER") {
      setIsUpgrading(true);
      try {
        // Step 1: Cek apakah butuh No WA (Request pertama ke API)
        let response = await fetch("/api/user/upgrade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ whatsappNumber: null })
        });
        let res = await response.json();
        
        // Step 2: Jika butuh No WA, minta ke user
        if (!res.success && res.code === "NEED_WHATSAPP") {
          const wa = window.prompt("Masukkan nomor WhatsApp aktif Anda untuk mulai berjualan (Contoh: 08123456789):");
          if (wa) {
            response = await fetch("/api/user/upgrade", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ whatsappNumber: wa })
            });
            res = await response.json();
          } else {
            return; // User membatalkan prompt
          }
        }

        // Step 3: Handle Hasil Akhir
        if (res.success) {
          await update(); // Refresh session client-side
          alert("Selamat! Anda sekarang resmi menjadi Penjual.");
          window.location.href = "/dashboard";
        } else {
          alert(res.error || "Gagal upgrade ke Seller");
        }
      } catch (err) {
        console.error("Upgrade client error:", err);
        alert("Terjadi kesalahan sistem: " + (err.message || "Gagal menghubungi server"));
      } finally {
        setIsUpgrading(false);
      }
    }
 else if (userRole === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      // Jika sudah SELLER
      router.push("/dashboard");
    }
  };

  const loginPrompt = (
    <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
      <p className="text-gray-500 uppercase tracking-widest text-xs font-bold italic">
        anda harus signup/login terlebih dahulu
      </p>
    </div>
  );

  return (
    <div className="w-full relative bg-gradient-to-t from-[#F9F9F9] to-white flex flex-col items-center font-sans">
        
        {/* HERO SECTION */}
        <div className="w-full px-6 md:px-10 py-16 md:py-24 bg-[#EAF2FF] flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="flex-1 flex flex-col justify-start items-start gap-8">
                <div className="flex flex-col justify-start items-start gap-4">
                    <h1 className="text-[#0F172A] text-4xl md:text-5xl lg:text-[48px] font-semibold leading-tight break-words">IPB Preloved</h1>
                    <p className="text-[#334155] text-lg font-semibold leading-[21.60px] max-w-[448px] break-words">Platform terstruktur untuk transaksi barang pre-loved di lingkungan IPB.</p>
                </div>
                
                <div className="w-full flex flex-col justify-start items-start gap-4">
                    {/* Search Bar */}
                    <div className="w-full max-w-[576px] p-2 bg-white shadow-sm rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center w-full px-4">
                            <Search className="w-5 h-5 text-[#787B7C]" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Cari buku, laptop, atau kursi kos..." 
                                className="w-full px-4 py-3 bg-transparent outline-none text-[#6B7280] text-sm"
                            />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] shadow-sm rounded-xl flex justify-center items-center hover:bg-blue-700 transition-colors"
                        >
                            <span className="text-[#F0FDF4] text-sm font-semibold whitespace-nowrap">Cari Barang</span>
                        </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-start items-start gap-3">
                        <div className="px-4 py-2 bg-[#2563EB] rounded-full flex justify-center items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                            <span className="text-white text-sm font-medium">Kategori</span>
                        </div>
                        <div className="px-4 py-2 bg-[#2563EB] rounded-full flex justify-center items-center gap-2">
                            <div className="w-3 h-2 bg-white"></div>
                            <span className="text-white text-sm font-medium">Harga</span>
                        </div>
                        <div className="px-4 py-2 bg-[#2563EB] rounded-full flex justify-center items-center gap-2">
                            <div className="w-3 h-3 bg-white"></div>
                            <span className="text-white text-sm font-medium">Kondisi</span>
                        </div>
                    </div>
                </div>
                
                <Link href="/catalog" className="px-8 py-4 bg-[#0891B2] flex justify-center items-center hover:bg-cyan-700 transition-colors">
                    <span className="text-white text-base font-bold font-sans tracking-wide">MULAI EKSPLORASI</span>
                </Link>
            </div>
            
            <div className="flex-1 w-full max-w-[576px]">
                <img className="w-full h-auto aspect-square rounded-2xl object-contain" src="/landing_page/Landing_Page.png" alt="Hero Image" />
            </div>
        </div>

        {/* TEMUAN PILIHAN */}
        <div className="w-full px-6 md:px-10 py-16 md:py-24 bg-white flex flex-col gap-12">
            <div className="w-full flex justify-between items-end">
                <h2 className="text-black text-base md:text-xl font-normal leading-relaxed uppercase tracking-wide">TEMUAN PILIHAN</h2>
                <Link href="/catalog" className="text-black text-sm md:text-base font-semibold underline leading-relaxed uppercase">LIHAT SEMUA</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {status === "authenticated" ? (
                  loading ? (
                    <p className="col-span-full text-center text-gray-500 py-10 uppercase tracking-widest text-xs font-bold animate-pulse">Memuat produk...</p>
                  ) : featuredProducts.length > 0 ? (
                    featuredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-400 py-10 italic">Tidak ada produk pilihan saat ini.</p>
                  )
                ) : (
                  loginPrompt
                )}
            </div>
        </div>

        {/* TEMUAN KATEGORI */}
        <div className="w-full px-6 md:px-10 py-16 md:py-24 bg-[#EAF2FF] flex flex-col gap-12">
            <h2 className="text-black text-base md:text-xl font-normal leading-relaxed uppercase tracking-wide">TEMUAN KATEGORI</h2>
            
            <div className="w-full">
              {status === "authenticated" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:h-[600px]">
                    <Link href="/catalog?category=PERALATAN PRAKTIKUM" className="relative overflow-hidden border border-[#C6C6C6] flex justify-center items-center p-8 group cursor-pointer aspect-[4/3] md:aspect-auto">
                        <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Peralatan Praktikum" />
                        <div className="absolute inset-0 bg-[#2563EB]/40 group-hover:bg-[#2563EB]/30 transition-colors"></div>
                        <div className="relative z-10 px-6 py-3 bg-white border border-[#020617] flex justify-center items-center">
                            <span className="text-black text-lg font-semibold uppercase tracking-wide">PERALATAN PRAKTIKUM</span>
                        </div>
                    </Link>
                    
                    <Link href="/catalog?category=ELECTRONICS" className="relative overflow-hidden border border-[#C6C6C6] flex justify-center items-center p-8 group cursor-pointer aspect-[4/3] md:aspect-auto">
                        <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Elektronik" />
                        <div className="absolute inset-0 bg-[#2563EB]/40 group-hover:bg-[#2563EB]/30 transition-colors"></div>
                        <div className="relative z-10 px-6 py-3 bg-white border border-[#020617] flex justify-center items-center">
                            <span className="text-black text-lg font-semibold uppercase tracking-wide">ELEKTRONIK</span>
                        </div>
                    </Link>

                    <Link href="/catalog?category=DORM ESSENTIALS" className="relative overflow-hidden border border-[#C6C6C6] flex justify-center items-center p-8 group cursor-pointer aspect-[4/3] md:aspect-auto">
                        <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="Kebutuhan Kost" />
                        <div className="absolute inset-0 bg-[#2563EB]/40 group-hover:bg-[#2563EB]/30 transition-colors"></div>
                        <div className="relative z-10 px-6 py-3 bg-white border border-[#020617] flex justify-center items-center">
                            <span className="text-black text-lg font-semibold uppercase tracking-wide">KEBUTUHAN KOST</span>
                        </div>
                    </Link>

                    <Link href="/catalog?category=BUKU" className="relative overflow-hidden border border-[#C6C6C6] flex justify-center items-center p-8 group cursor-pointer aspect-[4/3] md:aspect-auto">
                        <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Buku & Modul" />
                        <div className="absolute inset-0 bg-[#2563EB]/40 group-hover:bg-[#2563EB]/30 transition-colors"></div>
                        <div className="relative z-10 px-6 py-3 bg-white border border-[#020617] flex justify-center items-center">
                            <span className="text-black text-lg font-semibold uppercase tracking-wide">BUKU & MODUL</span>
                        </div>
                    </Link>
                </div>
              ) : (
                loginPrompt
              )}
            </div>
        </div>

        {/* FEATURES */}
        <div className="w-full px-6 md:px-10 py-16 md:py-24 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex flex-col gap-4 group hover:shadow-md transition-all">
                    <Heart className="w-6 h-6 text-[#2563EB]" strokeWidth={2} />
                    <h3 className="text-black text-base font-bold uppercase tracking-wide">WISHLIST SYSTEM</h3>
                    <p className="text-[#5E5E5E] text-base font-normal leading-relaxed">Simpan dan pantau barang incaran dengan sistem terstruktur.</p>
                </div>

                <div className="p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex flex-col gap-4 group hover:shadow-md transition-all">
                    <MessageCircle className="w-6 h-6 text-[#16A34A]" strokeWidth={2} />
                    <h3 className="text-black text-base font-bold uppercase tracking-wide">DIRECT WHATSAPP</h3>
                    <p className="text-[#5E5E5E] text-base font-normal leading-relaxed">Komunikasi langsung tanpa perantara untuk efisiensi transaksi.</p>
                </div>

                <div className="p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex flex-col gap-4 group hover:shadow-md transition-all">
                    <Tag className="w-6 h-6 text-[#0891B2]" strokeWidth={2} />
                    <h3 className="text-black text-base font-bold uppercase tracking-wide">JUAL MUDAH</h3>
                    <p className="text-[#5E5E5E] text-base font-normal leading-relaxed">Listing barang pre-loved Anda dalam hitungan menit.</p>
                </div>

                <div className="p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex flex-col gap-4 group hover:shadow-md transition-all">
                    <ShieldCheck className="w-6 h-6 text-purple-600" strokeWidth={2} />
                    <h3 className="text-black text-base font-bold uppercase tracking-wide">VERIFIKASI IPB</h3>
                    <p className="text-[#5E5E5E] text-base font-normal leading-relaxed">Ekosistem aman khusus civitas akademika IPB.</p>
                </div>

            </div>
        </div>

        {/* CTA SECTION */}
        <div className="w-full px-6 md:px-10 py-24 md:py-32 bg-[#EAF2FF] flex flex-col justify-center items-center gap-8 mb-24 md:mb-0">
            <h2 className="text-black text-base md:text-lg font-medium uppercase tracking-widest text-center">SIAP Menjual BARANG ANDA?</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleJualSekarang}
                  disabled={isUpgrading}
                  className="px-8 py-4 bg-[#2563EB] flex justify-center items-center hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
                >
                    <span className="text-white text-base font-bold uppercase tracking-[1.6px]">
                      {isUpgrading ? "Sedang Upgrade..." : "JUAL SEKARANG"}
                    </span>
                </button>
                <Link href="/catalog" className="px-8 py-4 border border-black flex justify-center items-center hover:bg-white transition-all">
                    <span className="text-black text-base font-bold uppercase tracking-[1.6px]">CARI BARANG</span>
                </Link>
            </div>
        </div>

    </div>
  );
}

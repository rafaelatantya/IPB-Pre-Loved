"use client";


import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, MapPin, LayoutGrid, MessageCircle, Heart, Tag, Banknote, BadgeCheck } from "lucide-react";
import ProductCard from "@/modules/catalog/components/ProductCard";
import { getFeaturedProducts } from "@/modules/catalog/services"; // Tetap simpan jika ada dep lain
import { upgradeToSeller } from "@/modules/user/actions";
export const dynamic = "force-dynamic";
export const runtime = "edge";

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
          let wa = window.prompt("Masukkan nomor WhatsApp aktif Anda untuk mulai berjualan (Contoh: 08123456789):");
          if (wa) {
            // Autocorrect Prompt
            let clean = wa.replace(/[^0-9+]/g, "");
            let corrected = clean;
            if (clean.startsWith("0")) {
              corrected = "+62" + clean.substring(1);
            } else if (clean.startsWith("62")) {
              corrected = "+" + clean;
            } else if (clean.startsWith("+62")) {
              corrected = clean;
            } else if (clean.length > 0) {
              corrected = "+62" + clean;
            }

            // Selalu konfirmasi karena prompt bawaan browser tidak memiliki label "+62" statis di UI-nya
            const confirmBox = window.confirm(`Autocorrect: nomor yang akan tercatat: ${corrected}\n\nKlik OK untuk setuju, atau Cancel untuk ketik ulang.`);
            if (!confirmBox) return; // User membatalkan

            response = await fetch("/api/user/upgrade", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ whatsappNumber: corrected })
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
    <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 gap-4">
      <p className="text-gray-500 uppercase tracking-widest text-xs font-bold italic">
        anda harus signup/login terlebih dahulu
      </p>
      <button 
        onClick={() => router.push("/login")}
        className="px-6 py-2.5 bg-black hover:bg-zinc-900 active:scale-[0.98] transition-all text-white text-xs font-bold uppercase tracking-wider"
      >
        Masuk Sekarang
      </button>
    </div>
  );

  return (
    <div className="w-full relative bg-[#FAFAFA] md:bg-gradient-to-t md:from-[#F9F9F9] md:to-white flex flex-col items-center font-poppins md:font-sans pb-20 md:pb-0">
        
        {/* MOBILE HERO SECTION */}
        <div className="md:hidden w-full px-6 py-8 flex flex-col justify-start items-start gap-12">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
                {/* Hero Illustration Placeholder */}
                <div className="self-stretch h-48 relative rounded-sm bg-blue-100 flex flex-col justify-center items-center overflow-hidden">
                    <img 
                      src="/landing_page/Landing_Page.png" 
                      className="w-full h-full object-contain opacity-80" 
                      alt="Hero"
                    />
                    <div className="absolute inset-0 bg-[#2563EB]/10 pointer-events-none"></div>
                </div>

                {/* Search Bar Mobile */}
                <div className="w-full h-16 p-2 bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] inline-flex justify-start items-start flex-wrap content-start">
                    <div className="self-stretch flex justify-start items-center">
                        <div className="pl-4 inline-flex flex-col justify-start items-center">
                            <Search className="size-4 text-zinc-500" />
                        </div>
                    </div>
                    <div className="flex-1 self-stretch px-4 py-3.5 inline-flex flex-col justify-center items-start overflow-hidden">
                        <input 
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          placeholder="Cari buku, laptop, atau kursi kos..." 
                          className="w-full bg-transparent outline-none text-gray-500 text-sm font-normal font-poppins leading-4 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="self-stretch pb-2 flex justify-start items-start gap-3 overflow-x-auto no-scrollbar">
                    <button onClick={() => router.push(status === "authenticated" ? '/catalog' : '/login')} className="shrink-0 px-4 py-2 bg-blue-600 rounded-full flex justify-start items-center gap-2 active:scale-95 transition-all">
                        <LayoutGrid className="w-3.5 h-3.5 text-white" />
                        <span className="text-center text-white text-sm font-medium font-poppins leading-5">Kategori</span>
                    </button>
                    <button onClick={() => router.push(status === "authenticated" ? '/catalog' : '/login')} className="shrink-0 px-4 py-2 bg-blue-600 rounded-full flex justify-start items-center gap-2 active:scale-95 transition-all">
                        <Banknote className="w-3.5 h-3.5 text-white" />
                        <span className="text-center text-white text-sm font-medium font-poppins leading-5">Harga</span>
                    </button>
                    <button onClick={() => router.push(status === "authenticated" ? '/catalog' : '/login')} className="shrink-0 px-4 py-2 bg-blue-600 rounded-full flex justify-start items-center gap-2 active:scale-95 transition-all">
                        <BadgeCheck className="w-3.5 h-3.5 text-white" />
                        <span className="text-center text-white text-sm font-medium font-poppins leading-5">Kondisi</span>
                    </button>
                </div>
            </div>
        </div>

        {/* DESKTOP HERO SECTION */}
        <div className="hidden md:flex w-full bg-[#EAF2FF]">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col lg:flex-row justify-between items-center gap-12">
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

                    <div className="flex flex-wrap justify-start items-start gap-3">
                        <Link href={status === "authenticated" ? "/catalog" : "/login"} className="px-4 py-2 bg-[#2563EB] rounded-full flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors">
                            <LayoutGrid className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">Kategori</span>
                        </Link>
                        <Link href={status === "authenticated" ? "/catalog" : "/login"} className="px-4 py-2 bg-[#2563EB] rounded-full flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors">
                            <Banknote className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">Harga</span>
                        </Link>
                        <Link href={status === "authenticated" ? "/catalog" : "/login"} className="px-4 py-2 bg-[#2563EB] rounded-full flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors">
                            <BadgeCheck className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">Kondisi</span>
                        </Link>
                    </div>
                </div>
                
                <Link href={status === "authenticated" ? "/catalog" : "/login"} className="px-8 py-4 bg-[#0891B2] flex justify-center items-center hover:bg-cyan-700 transition-colors">
                    <span className="text-white text-base font-bold font-sans tracking-wide">MULAI EKSPLORASI</span>
                </Link>
            </div>
            
            <div className="flex-1 w-full max-w-[576px]">
                <img className="w-full h-auto aspect-square rounded-2xl object-contain" src="/landing_page/Landing_Page.png" alt="Hero Image" />
                </div>
        </div>
        </div>

        {/* TEMUAN PILIHAN */}
        <div className="w-full px-6 md:px-10 py-12 md:py-24 bg-white md:bg-transparent flex flex-col gap-6 md:gap-12">
            <div className="w-full flex justify-between items-center md:items-end">
                <h2 className="text-black text-2xl md:text-xl font-semibold md:font-normal leading-7 md:leading-relaxed md:uppercase md:tracking-wide font-poppins">Temuan Pilihan</h2>
                <Link href="/catalog" className="text-black text-sm md:text-base font-semibold underline leading-relaxed uppercase hidden md:block">LIHAT SEMUA</Link>
            </div>
            
            {/* Product Display */}
            {status === "authenticated" ? (
              loading ? (
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : featuredProducts.length > 0 ? (
                <div className="w-full flex md:grid md:grid-cols-4 gap-6 overflow-x-auto no-scrollbar pb-4 md:pb-0">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="shrink-0 w-48 md:w-full">
                      <ProductCard product={product} variant="landing" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                    <p className="text-gray-400 italic">Tidak ada produk pilihan saat ini.</p>
                </div>
              )
            ) : (
              <div className="w-full">
                {loginPrompt}
              </div>
            )}
        </div>

        {/* TEMUAN KATEGORI */}
        <div className="w-full px-6 md:px-10 py-12 md:py-24 bg-white md:bg-[#EAF2FF] flex flex-col gap-6 md:gap-12">
            <h2 className="text-black text-2xl md:text-xl font-semibold md:font-normal leading-7 md:leading-relaxed md:uppercase md:tracking-wide font-poppins">Temuan Kategori</h2>
            
            <div className="w-full">
              {status === "authenticated" ? (
                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 md:pb-0">
                    <Link href="/catalog?category=BUKU" className="relative shrink-0 w-64 h-40 md:w-full md:h-[280px] overflow-hidden border border-[#C6C6C6] flex justify-center items-center group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Buku & Modul" />
                        <div className="absolute inset-0 bg-[#2563EB]/40 group-hover:bg-[#2563EB]/30 transition-colors"></div>
                        <div className="relative z-10 px-4 py-2 bg-white outline outline-[0.38px] outline-slate-950 flex justify-center items-center">
                            <span className="text-black text-xs md:text-lg font-semibold uppercase tracking-wide font-poppins">BUKU & MODUL</span>
                        </div>
                    </Link>

                    <Link href="/catalog?category=PERALATAN PRAKTIKUM" className="relative shrink-0 w-64 h-40 md:w-full md:h-[280px] overflow-hidden border border-[#C6C6C6] flex justify-center items-center group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Peralatan Praktikum" />
                        <div className="absolute inset-0 bg-[#2563EB]/40 group-hover:bg-[#2563EB]/30 transition-colors"></div>
                        <div className="relative z-10 px-4 py-2 bg-white outline outline-[0.38px] outline-slate-950 flex justify-center items-center text-center">
                            <span className="text-black text-xs md:text-lg font-semibold uppercase tracking-wide font-poppins">PERALATAN PRAKTIKUM</span>
                        </div>
                    </Link>
                    
                    <Link href="/catalog?category=ELECTRONICS" className="relative shrink-0 w-64 h-40 md:w-full md:h-[280px] overflow-hidden border border-[#C6C6C6] flex justify-center items-center group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Elektronik" />
                        <div className="absolute inset-0 bg-[#2563EB]/40 group-hover:bg-[#2563EB]/30 transition-colors"></div>
                        <div className="relative z-10 px-4 py-2 bg-white outline outline-[0.38px] outline-slate-950 flex justify-center items-center text-center">
                            <span className="text-black text-xs md:text-lg font-semibold uppercase tracking-wide font-poppins">ELEKTRONIK</span>
                        </div>
                    </Link>

                    <Link href="/catalog?category=DORM ESSENTIALS" className="relative shrink-0 w-64 h-40 md:w-full md:h-[280px] overflow-hidden border border-[#C6C6C6] flex justify-center items-center group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="Kebutuhan Kost" />
                        <div className="absolute inset-0 bg-[#2563EB]/40 group-hover:bg-[#2563EB]/30 transition-colors"></div>
                        <div className="relative z-10 px-4 py-2 bg-white outline outline-[0.38px] outline-slate-950 flex justify-center items-center text-center">
                            <span className="text-black text-xs md:text-lg font-semibold uppercase tracking-wide font-poppins">KEBUTUHAN KOST</span>
                        </div>
                    </Link>
                </div>
              ) : (
                loginPrompt
              )}
            </div>
        </div>

        {/* FEATURES (Hidden on Mobile as per snippet) */}
        <div className="hidden md:block w-full px-6 md:px-10 py-16 md:py-24 bg-white">
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
                    <BadgeCheck className="w-6 h-6 text-purple-600" strokeWidth={2} />
                    <h3 className="text-black text-base font-bold uppercase tracking-wide">VERIFIKASI IPB</h3>
                    <p className="text-[#5E5E5E] text-base font-normal leading-relaxed">Ekosistem aman khusus civitas akademika IPB.</p>
                </div>

            </div>
        </div>

        {/* CTA SECTION */}
        <div className="w-full px-6 md:px-10 py-16 md:py-32 bg-indigo-50 md:bg-[#EAF2FF] flex flex-col justify-center items-center gap-8 mb-0 md:mb-0">
            <h2 className="text-black text-[18px] md:text-lg font-normal md:font-medium uppercase tracking-normal md:tracking-widest text-center font-poppins">SIAP Menjual BARANG ANDA?</h2>
            <div className="flex flex-row md:flex-row gap-4">
                <button 
                  onClick={handleJualSekarang}
                  disabled={isUpgrading}
                  className="px-4 py-4 md:px-8 md:py-4 bg-blue-700 md:bg-[#2563EB] flex justify-center items-center hover:bg-blue-800 transition-all shadow-md disabled:bg-gray-400"
                >
                    <span className="text-white text-sm md:text-base font-semibold md:bold uppercase tracking-normal md:tracking-[1.6px] font-poppins">
                      {isUpgrading ? "Sedang Upgrade..." : "JUAL SEKARANG"}
                    </span>
                </button>
                <Link href="/catalog" className="px-4 py-4 md:px-8 md:py-4 border border-black flex justify-center items-center hover:bg-white transition-all">
                    <span className="text-black text-sm md:text-base font-semibold md:bold uppercase tracking-normal md:tracking-[1.6px] font-poppins">CARI BARANG</span>
                </Link>
            </div>
        </div>

    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Heart, ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/modules/catalog/components/ProductCard";

export default function WishlistView({ initialItems }) {
  const [wishlistItems, setWishlistItems] = useState(initialItems || []);
  const [isPending, setIsPending] = useState(false);

  const removeItem = async (id) => {
    if (isPending) return;
    setIsPending(true);
    
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: id, action: "TOGGLE" }),
      });
      const data = await res.json();
      if (data.success) {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
      }
    } catch (e) {
      alert("Gagal menghapus item");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] md:bg-[#F8FAFC] font-poppins md:font-sans pb-32 md:pb-20">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden w-full px-6 py-4 bg-white shadow-[0px_4px_20px_0px_rgba(26,28,28,0.03)] flex justify-between items-center sticky top-0 z-50">
          <div className="flex-1 flex justify-between items-center overflow-hidden">
              <div className="justify-center text-zinc-900 text-lg font-semibold font-poppins leading-5 uppercase">IPB PRE LOVED</div>
              <div className="w-9 px-4 py-2 bg-blue-300 rounded-[36px] shadow-[0px_1px_2px_0px_rgba(105,81,255,0.05)] flex justify-center items-center gap-1.5 overflow-hidden">
                  <div className="size-5 relative overflow-hidden flex items-center justify-center">
                      <div className="size-4 bg-blue-600 rounded-full"></div>
                  </div>
              </div>
          </div>
      </div>

      {/* MOBILE HERO SECTION */}
      <div className="md:hidden w-full px-6 pt-8 pb-12 bg-indigo-50 flex flex-col justify-start items-start gap-2">
          <h1 className="self-stretch justify-center text-black text-5xl font-semibold font-poppins leading-[57.60px]">Wishlist Saya</h1>
          <p className="self-stretch justify-center text-zinc-600 text-base font-medium font-poppins leading-6 tracking-widest uppercase">SAVED ITEMS</p>
      </div>

      {/* DESKTOP HEADER */}
      <div className="hidden md:block w-full bg-white border-b border-[#E2E8F0] py-12">
        <div className="w-full px-10 flex flex-col gap-4">
          <Link href="/catalog" className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest hover:translate-x-1 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Kembali Belanja
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-2xl">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#0F172A] text-3xl md:text-4xl font-bold tracking-tight uppercase">Wishlist Saya</h1>
              <p className="text-[#64748B] text-sm font-medium uppercase tracking-[2px]">Barang incaran yang lu simpan</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full px-4 md:px-10 py-8 md:py-12">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard product={item} variant="landing" />
                {/* Remove Button Overlay (Refined for Mobile Design) */}
                <button 
                  onClick={() => removeItem(item.id)}
                  disabled={isPending}
                  className="absolute top-2 right-2 p-1.5 md:p-2 bg-red-500 text-white rounded-full shadow-lg z-20 active:scale-90 transition-all md:opacity-0 md:group-hover:opacity-100"
                  title="Hapus dari Wishlist"
                >
                  <Trash2 className="size-4 md:w-4 md:h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 md:py-32 gap-6 bg-white rounded-xl md:rounded-[40px] border border-dashed border-gray-200">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-gray-300" />
            </div>
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 uppercase">Wishlist Lu Masih Kosong</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xs">Cari barang keren di katalog terus klik ikon hati buat simpan di sini.</p>
            </div>
            <Link href="/catalog" className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white font-bold rounded-xl md:rounded-2xl shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest text-xs md:text-sm">
              Eksplorasi Katalog
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}


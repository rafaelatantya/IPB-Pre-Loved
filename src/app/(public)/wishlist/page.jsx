"use client";

export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { Heart, ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/modules/catalog/components/ProductCard";

// Data Boongan khusus buat Wishlist
const DUMMY_WISHLIST = [
  { id: "1", title: "Jas Laboratorium Ukuran L", price: 80000, condition: "BAIK", category: "PRAKTIKUM", image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400&auto=format&fit=crop", location: "DRAMAGA" },
  { id: "2", title: "Kalkulator Scientific Casio", price: 200000, condition: "LIKE NEW", category: "ELEKTRONIK", image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=400&auto=format&fit=crop", location: "DRAMAGA" },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(DUMMY_WISHLIST);

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans pb-20">
      
      {/* HEADER */}
      <div className="w-full bg-white border-b border-[#E2E8F0] py-12">
        <div className="w-full px-6 md:px-10 flex flex-col gap-4">
          <Link href="/catalog" className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest hover:translate-x-1 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Kembali Belanja
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-2xl">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#0F172A] text-3xl md:text-4xl font-bold tracking-tight">Wishlist Saya</h1>
              <p className="text-[#64748B] text-sm font-medium uppercase tracking-[2px]">Barang incaran yang lu simpan</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full px-6 md:px-10 py-12">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard product={item} />
                {/* Tombol Hapus Cepat */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-2 -right-2 p-2 bg-white border border-red-100 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                  title="Hapus dari Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-[40px] border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800">Wishlist Lu Masih Kosong</h2>
              <p className="text-gray-500 text-center max-w-xs">Cari barang keren di katalog terus klik ikon hati buat simpan di sini.</p>
            </div>
            <Link href="/catalog" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest text-sm">
              Eksplorasi Katalog
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}

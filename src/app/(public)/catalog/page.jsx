import React from "react";
import Link from "next/link";
import { ChevronRight, Leaf, Search, LayoutGrid, X, ChevronDown, Check, ChevronLeft } from "lucide-react";
import ProductCard from "@/modules/catalog/components/ProductCard";

const DUMMY_CATALOG = [
  { id: "1", title: "Laptop Asus Vivobook A416", price: 4250000, condition: "LIKE NEW", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=500&auto=format&fit=crop", location: "DRAMAGA", timePosted: "2J YANG LALU" },
  { id: "2", title: "Buku Biostatistika Terapan", price: 85000, condition: "BAIK", category: "BUKU", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop", location: "BARANANGSIANG", timePosted: "5J YANG LALU" },
  { id: "3", title: "Kalkulator Casio FX-991EX", price: 280000, condition: "BARU", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1574607383476-f517f220d398?q=80&w=500&auto=format&fit=crop", location: "DRAMAGA", timePosted: "1 HARI LALU" },
  { id: "4", title: "Nike Revolution 5 Maroon", price: 350000, condition: "CUKUP", category: "FASHION", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop", location: "GUNUNG GEDE", timePosted: "2 HARI LALU" },
  { id: "5", title: "Instax Mini 11 Charcoal", price: 720000, condition: "BARU", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=500&auto=format&fit=crop", location: "DRAMAGA", timePosted: "4 HARI LALU" },
  { id: "6", title: "Portable Laptop Stand Alumunium", price: 125000, condition: "LIKE NEW", category: "DORM ESSENTIALS", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=500&auto=format&fit=crop", location: "BARANANGSIANG", timePosted: "1 MINGGU LALU" },
];

export default function CatalogPage() {
  return (
    <div className="bg-[#FBF9F9] min-h-screen pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Top Header Section */}
        <div className="mb-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-[#5C6060] font-medium mb-4">
            <Link href="/" className="hover:text-[#303334] transition">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#303334]">Katalog</span>
          </div>

          {/* Title & Badge */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-[#303334] mb-2 tracking-tight">Telusuri Produk</h1>
              <p className="text-[#5C6060] font-medium text-base">Temukan barang berkualitas dari rekan mahasiswa IPB.</p>
            </div>
            
            <div className="flex-shrink-0">
              <div className="px-4 py-2 bg-[#B9EEAB] rounded-full flex items-center gap-2 shadow-sm">
                <Leaf className="w-4 h-4 text-[#2D5A27]" />
                <span className="text-[#2D5A27] text-xs font-bold tracking-wide uppercase">GREEN CAMPUS INITIATIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 bg-[#F4F3F3] rounded-2xl p-6 flex flex-col gap-8">
            
            {/* Categories */}
            <div>
              <h3 className="text-[#303334] text-sm font-bold tracking-[1.4px] uppercase mb-4">CATEGORIES</h3>
              <div className="flex flex-col gap-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 transition">
                  <LayoutGrid className="w-4 h-4 text-[#303334]" />
                  <span className="text-[#303334] text-sm font-bold">All Items</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 transition">
                  <div className="w-4 h-4 rounded-sm bg-gray-400"></div>
                  <span className="text-[#5C6060] text-sm font-medium">Textbooks</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 transition">
                  <div className="w-4 h-4 rounded-sm bg-gray-400"></div>
                  <span className="text-[#5C6060] text-sm font-medium">Electronics</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 transition">
                  <div className="w-4 h-4 rounded-sm bg-gray-400"></div>
                  <span className="text-[#5C6060] text-sm font-medium">Dorm Essentials</span>
                </button>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-[#303334] text-sm font-bold tracking-[1.4px] uppercase mb-4">PRICE RANGE</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="text-[#5C6060] text-[10px] font-bold">MIN</span>
                  <div className="bg-white rounded-lg px-3 py-2.5 shadow-sm border border-gray-100 flex items-center">
                     <span className="text-[#6B7280] text-sm font-medium">Rp 0</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <span className="text-[#5C6060] text-[10px] font-bold">MAX</span>
                  <div className="bg-white rounded-lg px-3 py-2.5 shadow-sm border border-gray-100 flex items-center">
                     <span className="text-[#6B7280] text-sm font-medium">Rp 5jt+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-[#303334] text-sm font-bold tracking-[1.4px] uppercase mb-4">LOCATION</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded md bg-[#5F5E5E] flex items-center justify-center shadow-sm">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[#303334] text-sm font-medium group-hover:text-black transition">Dramaga</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-[#B0B2B3] bg-white group-hover:border-gray-500 transition shadow-sm"></div>
                  <span className="text-[#5C6060] text-sm font-medium group-hover:text-[#303334] transition">Baranangsiang</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-[#B0B2B3] bg-white group-hover:border-gray-500 transition shadow-sm"></div>
                  <span className="text-[#5C6060] text-sm font-medium group-hover:text-[#303334] transition">Gunung Gede</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <button className="w-full py-3 bg-[#5F5E5E] text-[#FAF7F6] font-bold rounded-xl shadow-sm hover:bg-[#4a4a4a] transition">
                Apply Filters
              </button>
              <button className="w-full py-3 text-[#5C6060] text-xs font-bold hover:text-[#303334] transition">
                Reset all filters
              </button>
            </div>

          </aside>

          {/* Right Content */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            
            {/* Top Bar (Active filters & sort) */}
            <div className="bg-[#F4F3F3] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-[#303334] text-sm font-bold">Menampilkan 248 produk</span>
                <div className="hidden sm:block w-px h-5 bg-[#B0B2B3]"></div>
                
                {/* Active Filters Badges */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition">
                    <span className="text-[#303334] text-[11px] font-bold">Electronics</span>
                    <X className="w-3 h-3 text-[#303334]" />
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition">
                    <span className="text-[#303334] text-[11px] font-bold">Dramaga</span>
                    <X className="w-3 h-3 text-[#303334]" />
                  </button>
                </div>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-3">
                <span className="text-[#5C6060] text-xs font-bold tracking-wider uppercase">SORT BY:</span>
                <button className="flex items-center gap-6 py-2 px-4 bg-transparent border border-transparent hover:border-gray-300 rounded-xl transition">
                  <span className="text-[#303334] text-sm font-bold">Terbaru</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>

            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {DUMMY_CATALOG.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="pt-8 flex justify-center">
              <div className="flex items-center gap-2 p-2 bg-[#F4F3F3] rounded-2xl">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#5C6060] hover:bg-gray-200 transition">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#5F5E5E] text-[#FAF7F6] font-bold shadow-sm">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#5C6060] font-bold hover:bg-gray-200 transition">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#5C6060] font-bold hover:bg-gray-200 transition">
                  3
                </button>
                <div className="px-2 text-[#5C6060]">...</div>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#5C6060] font-bold hover:bg-gray-200 transition">
                  12
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#5C6060] hover:bg-gray-200 transition">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

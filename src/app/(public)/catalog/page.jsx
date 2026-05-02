"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { Search, Filter, Grid, List, ChevronDown, MapPin, Tag, Clock } from "lucide-react";
import ProductCard from "@/modules/catalog/components/ProductCard";
import { getApprovedProducts } from "@/modules/catalog/services";
import { getCategories } from "@/modules/category/actions";
import { useSearchParams } from "next/navigation";

// Sub-component untuk handle logic search params
function CatalogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk input (yang diketik user)
  const [searchInput, setSearchInput] = useState(initialSearch);
  // State untuk query (yang dikirim ke backend - di-debounce)
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // 1. Fetch Categories
  useEffect(() => {
    async function loadCategories() {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    }
    loadCategories();
  }, []);

  // 2. Debounce Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500); // Tunggu 500ms setelah user berhenti ngetik

    return () => clearTimeout(timer);
  }, [searchInput]);

  // 3. Fetch Products when search/category changes
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await getApprovedProducts({
          search: searchQuery,
          categoryId: selectedCategory === "all" ? "" : selectedCategory,
        });
        if (res.success) {
          setProducts(res.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [searchQuery, selectedCategory]);

  return (
    <>
      {/* HEADER SECTION (Tetap di dalam agar bisa akses searchQuery) */}
      <div className="w-full bg-white border-b border-[#E2E8F0] flex justify-center items-center py-12 md:py-16">
        <div className="w-full px-6 md:px-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#0F172A] text-3xl md:text-4xl font-bold tracking-tight">Katalog Barang</h1>
            <p className="text-[#64748B] text-base font-medium uppercase tracking-[2px]">Eksplorasi Temuan Civitas IPB</p>
          </div>
          
          <div className="w-full max-w-[800px] flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <input 
                type="text"
                placeholder="Cari buku, elektronik, atau furniture..."
                className="w-full pl-12 pr-4 py-4 bg-[#F1F5F9] border-none rounded-2xl text-[#1E293B] text-sm focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setSearchQuery(searchInput)}
              className="px-8 py-4 bg-[#2563EB] text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>CARI</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full px-6 md:px-10 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <div className="lg:w-[280px] flex flex-col gap-8 shrink-0">
          <div className="flex flex-col gap-4">
            <h3 className="text-[#0F172A] text-xs font-bold uppercase tracking-widest border-b border-gray-200 pb-2">KATEGORI UTAMA</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setSelectedCategory("all")}
                className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedCategory === "all" 
                    ? "bg-[#2563EB] text-white shadow-md" 
                    : "text-[#64748B] hover:bg-white hover:text-[#2563EB]"
                }`}
              >
                SEMUA KATEGORI
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategory === cat.id 
                      ? "bg-[#2563EB] text-white shadow-md" 
                      : "text-[#64748B] hover:bg-white hover:text-[#2563EB]"
                  }`}
                >
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
            <h3 className="text-[#0F172A] text-xs font-bold uppercase tracking-widest">FILTER HARGA</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#94A3B8]">MINIMAL</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B]">RP</span>
                  <input type="number" className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs" placeholder="0" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#94A3B8]">MAKSIMAL</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B]">RP</span>
                  <input type="number" className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs" placeholder="10.000.000" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <span className="text-[#64748B] text-sm font-medium">
              {loading ? "Memuat data..." : `Menampilkan ${products.length} Produk`}
            </span>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
                <button className="p-2 bg-white text-[#2563EB] rounded-md shadow-sm"><Grid className="w-4 h-4" /></button>
                <button className="p-2 text-[#94A3B8] hover:text-[#2563EB]"><List className="w-4 h-4" /></button>
              </div>
              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
              <button className="flex items-center gap-2 text-sm font-bold text-[#1E293B] hover:text-[#2563EB] transition-colors">
                TERBARU <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {!loading && products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {!loading && products.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#64748B]">
                <p>Tidak ada produk yang ditemukan.</p>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-2 py-10">
            <button className="w-10 h-10 flex justify-center items-center rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#2563EB] hover:text-white transition-all shadow-sm">1</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Memuat Katalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

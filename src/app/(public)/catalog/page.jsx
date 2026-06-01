"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import React, { useState, useEffect, Suspense } from "react";
import { Search, Filter, Grid, List, ChevronDown, ChevronLeft, ChevronRight, Check, SlidersHorizontal, LayoutGrid, Banknote, BadgeCheck } from "lucide-react";
import ProductCard from "@/modules/catalog/components/ProductCard";
import MobileFilter from "@/modules/catalog/components/MobileFilter";
import { getApprovedProducts } from "@/modules/catalog/services";
import { getCategories } from "@/modules/category/actions";
import { useSearchParams } from "next/navigation";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [searchInput, setSearchInput] = useState(initialSearch);
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory === "all" ? [] : [initialCategory]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [condition, setCondition] = useState([]); // Empty means "Semua Kondisi"
  
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

  // State for applied filters to reduce server load
  const [appliedFilters, setAppliedFilters] = useState({
    search: initialSearch,
    category: initialCategory === "all" ? [] : [initialCategory],
    minPrice: "",
    maxPrice: "",
    condition: [],
    sortBy: "latest"
  });

  useEffect(() => {
    async function loadCategories() {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    }
    loadCategories();
  }, []);

  const handleSearch = () => {
    setPage(1);
    setAppliedFilters({
      search: searchInput,
      category: selectedCategory,
      minPrice: minPrice,
      maxPrice: maxPrice,
      condition: condition,
      sortBy: sortBy
    });
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategory([]);
    setMinPrice("");
    setMaxPrice("");
    setCondition([]);
    setSortBy("latest");
    setSearchInput("");
    setPage(1);
    setAppliedFilters({
      search: "",
      category: [],
      minPrice: "",
      maxPrice: "",
      condition: [],
      sortBy: "latest"
    });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setAppliedFilters(prev => ({ ...prev, sortBy: newSortBy }));
    setPage(1);
  };

  const toggleCategory = (id) => {
    if (id === "all") {
      setSelectedCategory([]);
      return;
    }
    setSelectedCategory(prev => {
      if (prev.includes(id)) {
        return prev.filter(c => c !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleCondition = (k) => {
    if (k === "Semua Kondisi") {
      setCondition([]);
      return;
    }
    setCondition(prev => {
      if (prev.includes(k)) {
        return prev.filter(c => c !== k);
      } else {
        return [...prev, k];
      }
    });
  };

  const mapConditions = (conds) => {
    const mapped = [];
    if (conds.includes("Baru")) mapped.push("NEW");
    if (conds.includes("Pernah Dipakai")) mapped.push("LIKE_NEW", "GOOD");
    if (conds.includes("Perlu Perbaikan")) mapped.push("FAIR");
    return mapped;
  };

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await getApprovedProducts({
          search: appliedFilters.search,
          categoryId: appliedFilters.category,
          minPrice: appliedFilters.minPrice ? parseInt(appliedFilters.minPrice) : 0,
          maxPrice: appliedFilters.maxPrice ? parseInt(appliedFilters.maxPrice) : 1000000000,
          condition: mapConditions(appliedFilters.condition),
          sortBy: appliedFilters.sortBy,
          page: page,
          limit: 12
        });
        if (res.success) {
          setProducts(res.data || []);
          setPagination(res.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [appliedFilters, page]);

  return (
    <div className="w-full bg-[#FAFAFA] md:bg-[#F8FAFC] flex flex-col items-center">
      

      {/* MOBILE HERO SECTION */}
      <div className="md:hidden w-full px-6 pt-8 pb-12 bg-indigo-50 flex flex-col justify-start items-start gap-8">
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <h1 className="self-stretch justify-center text-zinc-900 text-5xl font-semibold font-poppins leading-[57.60px]">Catalog</h1>
              <p className="self-stretch justify-center text-neutral-500 text-base font-medium font-poppins leading-6 uppercase tracking-wider">DISCOVER PRE-LOVED ITEMS</p>
          </div>
          
          <div className="w-full flex justify-start items-center gap-4">
              {/* Search Bar Mobile */}
              <div className="flex-1 h-12 p-2 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex justify-start items-center">
                  <div className="pl-4 flex justify-start items-center">
                      <Search className="size-4 text-zinc-500" />
                  </div>
                  <input 
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Cari Barang..."
                    className="flex-1 px-4 bg-transparent outline-none text-zinc-900 text-sm font-normal font-poppins leading-4 placeholder:text-gray-500"
                  />
              </div>
              
              {/* Filter Button Mobile */}
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="w-10 h-10 bg-white rounded-sm outline outline-1 outline-slate-300 flex justify-center items-center active:scale-95 transition-transform"
              >
                  <SlidersHorizontal className="size-5 text-black" />
              </button>
          </div>

          {/* Quick Filter Pills (Mobile) */}
          <div className="self-stretch flex justify-start items-start gap-3 overflow-x-auto no-scrollbar pt-2">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="shrink-0 px-4 py-2 bg-blue-600 rounded-full flex justify-start items-center gap-2 active:scale-95 transition-all"
              >
                  <LayoutGrid className="w-3.5 h-3.5 text-white" />
                  <span className="text-center text-white text-sm font-medium font-poppins leading-5">Kategori</span>
              </button>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="shrink-0 px-4 py-2 bg-blue-600 rounded-full flex justify-start items-center gap-2 active:scale-95 transition-all"
              >
                  <Banknote className="w-3.5 h-3.5 text-white" />
                  <span className="text-center text-white text-sm font-medium font-poppins leading-5">Harga</span>
              </button>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="shrink-0 px-4 py-2 bg-blue-600 rounded-full flex justify-start items-center gap-2 active:scale-95 transition-all"
              >
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                  <span className="text-center text-white text-sm font-medium font-poppins leading-5">Kondisi</span>
              </button>
          </div>
      </div>

      {/* MOBILE FILTER MODAL */}
      <MobileFilter 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        toggleCategory={toggleCategory}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        condition={condition}
        toggleCondition={toggleCondition}
        onApply={handleSearch}
        onReset={resetFilters}
      />

      {/* DESKTOP SEARCH BAR CONTAINER */}
      <div className="hidden md:flex w-full bg-[#F8FAFC] py-8 justify-center items-center sticky top-20 z-40">
        <div className="w-full max-w-7xl px-10 flex items-center gap-3">
           <div className="flex-1 h-14 px-4 bg-white shadow-sm border border-gray-200 rounded-xl flex items-center focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-500 transition-all">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input 
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Cari barang di katalog..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 text-sm font-inter placeholder:text-gray-400"
              />
              <button 
                onClick={handleSearch}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-poppins font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cari
              </button>
           </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="w-full max-w-7xl px-4 md:px-10 pb-24 bg-[#F8FAFC] flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
        
        {/* LEFT SIDEBAR FILTERS (Desktop) */}
        <div className="hidden lg:flex w-[260px] xl:w-[280px] flex-col gap-8 shrink-0 sticky top-36">
          
          <div className="w-full border-b border-gray-200 pb-4 flex justify-between items-center">
            <h2 className="text-gray-900 text-base font-bold font-poppins">Filter</h2>
            <button onClick={resetFilters} className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">Reset</button>
          </div>
          
          {/* Kategori */}
          <div className="flex flex-col gap-4">
            <h3 className="text-gray-900 text-sm font-bold font-poppins">Kategori</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => toggleCategory("all")} className="flex items-center gap-3 group text-left">
                 <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedCategory.length === 0 ? "bg-blue-600 border-blue-600" : "border-2 border-gray-300 group-hover:border-blue-500"}`}>
                    {selectedCategory.length === 0 && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                 </div>
                 <span className={`text-sm font-inter transition-colors ${selectedCategory.length === 0 ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>Semua Kategori</span>
              </button>
              {categories.map(cat => {
                 const isActive = selectedCategory.includes(cat.id);
                 return (
                    <button key={cat.id} onClick={() => toggleCategory(cat.id)} className="flex items-center gap-3 group text-left">
                       <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isActive ? "bg-blue-600 border-blue-600" : "border-2 border-gray-300 group-hover:border-blue-500"}`}>
                          {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                       </div>
                       <span className={`text-sm font-inter transition-colors ${isActive ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>{cat.name}</span>
                    </button>
                 );
              })}
            </div>
          </div>

          {/* Harga */}
          <div className="flex flex-col gap-4">
            <h3 className="text-gray-900 text-sm font-bold font-poppins">Harga</h3>
            <div className="w-full flex justify-between items-center gap-3">
               <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                  <input 
                     type="number"
                     value={minPrice}
                     onChange={e => setMinPrice(e.target.value)}
                     placeholder="Min"
                     className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-inter text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                  />
               </div>
               <span className="text-gray-400 font-medium">-</span>
               <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                  <input 
                     type="number"
                     value={maxPrice}
                     onChange={e => setMaxPrice(e.target.value)}
                     placeholder="Max"
                     className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-inter text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                  />
               </div>
            </div>
          </div>

          {/* Kondisi */}
          <div className="flex flex-col gap-4">
            <h3 className="text-gray-900 text-sm font-bold font-poppins">Kondisi</h3>
            <div className="flex flex-col gap-3">
              {["Semua Kondisi", "Baru", "Pernah Dipakai", "Perlu Perbaikan"].map((k) => {
                 const isActive = k === "Semua Kondisi" ? condition.length === 0 : condition.includes(k);
                 return (
                    <button key={k} onClick={() => toggleCondition(k)} className="flex items-center gap-3 group text-left">
                       <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isActive ? "bg-blue-600 border-blue-600" : "border-2 border-gray-300 group-hover:border-blue-500"}`}>
                          {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                       </div>
                       <span className={`text-sm font-inter transition-colors ${isActive ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>{k}</span>
                    </button>
                 );
              })}
            </div>
          </div>

          <button onClick={handleSearch} className="w-full py-3 bg-blue-600 text-white shadow-md shadow-blue-600/20 flex justify-center items-center rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all transform active:scale-[0.98]">
             <span className="text-sm font-semibold font-poppins">Terapkan Filter</span>
          </button>
        </div>

        {/* RIGHT MAIN AREA (PRODUCTS) */}
        <div className="flex-1 w-full flex flex-col gap-8">
          
          <div className="w-full border-b border-[#020617] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
             <div className="flex items-end gap-1.5">
                <span className="text-black text-[18px] font-semibold font-poppins leading-[21.6px]">
                  {loading ? "..." : pagination.totalItems}
                </span>
                <span className="text-[#777777] text-[16px] font-poppins leading-[19.2px]">ITEMS FOUND</span>
             </div>
             <div className="flex items-center gap-4">
                <span className="text-[#777777] text-[14px] font-poppins leading-[16.8px] uppercase">SORT BY</span>
                <div className="relative">
                   <select 
                     value={sortBy} 
                     onChange={(e) => handleSortChange(e.target.value)}
                     className="appearance-none px-4 py-2 pr-10 outline outline-1 outline-[#2563EB] -outline-offset-1 rounded-md text-[#2563EB] text-[12px] font-semibold font-poppins shadow-[0_1px_2px_rgba(105,81,255,0.05)] bg-white cursor-pointer focus:outline-none"
                   >
                      <option value="latest">Terbaru</option>
                      <option value="cheapest">Termurah</option>
                      <option value="expensive">Termahal</option>
                      <option value="oldest">Terlama</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563EB] pointer-events-none" />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {!loading && products.map(product => (
              <ProductCard key={product.id} product={product} variant="landing" />
            ))}
            {!loading && products.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#64748B]">
                  <p>Tidak ada produk yang ditemukan.</p>
                </div>
            )}
            {loading && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#64748B]">
                  <p>Memuat Katalog...</p>
                </div>
            )}
          </div>

          {/* PAGINATION */}
          {pagination.totalPages > 1 && (
            <div className="w-full pt-8 mt-8 border-t border-[#020617] flex justify-center items-center gap-2">
              <button 
                onClick={() => setPage(Math.max(1, page - 1))}
                className="w-10 h-10 bg-white outline outline-1 outline-[#C6C6C6] -outline-offset-1 flex justify-center items-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-black" />
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button 
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-10 h-10 flex justify-center items-center font-inter text-[14px] transition-colors ${
                    page === p 
                      ? "bg-black text-white font-bold outline outline-1 outline-black -outline-offset-1" 
                      : "bg-white outline outline-1 outline-[#C6C6C6] -outline-offset-1 text-black font-medium hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button 
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                className="w-10 h-10 bg-white outline outline-1 outline-[#C6C6C6] -outline-offset-1 flex justify-center items-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-black" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-[#F8FAFC]">Memuat Katalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

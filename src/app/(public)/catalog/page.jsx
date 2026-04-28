"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, ChevronDown, Check, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import ProductCard from "@/modules/catalog/components/ProductCard";

const DUMMY_CATALOG = [
  { id: "1", title: "Laptop Asus Vivobook A416", price: 4250000, condition: "LIKE NEW", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=500&auto=format&fit=crop", location: "DRAMAGA", timePosted: "2J YANG LALU" },
  { id: "2", title: "Buku Biostatistika Terapan", price: 85000, condition: "BAIK", category: "BUKU", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop", location: "BARANANGSIANG", timePosted: "5J YANG LALU" },
  { id: "3", title: "Kalkulator Casio FX-991EX", price: 280000, condition: "BARU", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1574607383476-f517f220d398?q=80&w=500&auto=format&fit=crop", location: "DRAMAGA", timePosted: "1 HARI LALU" },
  { id: "4", title: "Nike Revolution 5 Maroon", price: 350000, condition: "CUKUP", category: "FASHION", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop", location: "GUNUNG GEDE", timePosted: "2 HARI LALU" },
  { id: "5", title: "Instax Mini 11 Charcoal", price: 720000, condition: "BARU", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=500&auto=format&fit=crop", location: "DRAMAGA", timePosted: "4 HARI LALU" },
  { id: "6", title: "Portable Laptop Stand Alumunium", price: 125000, condition: "LIKE NEW", category: "DORM ESSENTIALS", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=500&auto=format&fit=crop", location: "BARANANGSIANG", timePosted: "1 MINGGU LALU" },
];

const CATEGORY_OPTIONS = [
  { label: "Buku & Modul", value: "BUKU" },
  { label: "Elektronik", value: "ELECTRONICS" },
  { label: "Kebutuhan Kost", value: "DORM ESSENTIALS" },
  { label: "Peralatan Praktikum", value: "PERALATAN PRAKTIKUM" },
  { label: "Fashion", value: "FASHION" }
];

const CONDITION_OPTIONS = [
  { label: "Baru", value: "BARU" },
  { label: "Like New", value: "LIKE NEW" },
  { label: "Baik", value: "BAIK" },
  { label: "Cukup", value: "CUKUP" }
];

function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQueryParam = searchParams.get("search") || "";
  const activeCategory = searchParams.get("category") || "";
  const activeConditions = searchParams.get("condition")?.split(",").filter(Boolean) || [];
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const sortParam = searchParams.get("sort") || "terbaru";

  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  useEffect(() => {
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setSearchQuery(searchQueryParam);
  }, [minPriceParam, maxPriceParam, searchQueryParam]);

  const updateQueryParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => updateQueryParam("search", searchQuery);

  const handleCategoryClick = (val) => {
    if (activeCategory === val) {
      updateQueryParam("category", "");
    } else {
      updateQueryParam("category", val);
    }
  };

  const handleConditionToggle = (cond) => {
    let newConditions = [...activeConditions];
    if (newConditions.includes(cond)) {
      newConditions = newConditions.filter(c => c !== cond);
    } else {
      newConditions.push(cond);
    }
    updateQueryParam("condition", newConditions.join(","));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (searchQuery) params.set("search", searchQuery);
    else params.delete("search");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  // Filter Data
  let filteredCatalog = DUMMY_CATALOG.filter((item) => {
    if (searchQueryParam && !item.title.toLowerCase().includes(searchQueryParam.toLowerCase())) return false;
    if (activeCategory && item.category !== activeCategory) return false;
    if (activeConditions.length > 0 && !activeConditions.includes(item.condition)) return false;
    if (minPriceParam && item.price < parseInt(minPriceParam)) return false;
    if (maxPriceParam && item.price > parseInt(maxPriceParam)) return false;
    return true;
  });

  // Sort Data
  if (sortParam === "termurah") {
    filteredCatalog.sort((a, b) => a.price - b.price);
  } else if (sortParam === "termahal") {
    filteredCatalog.sort((a, b) => b.price - a.price);
  } else {
    filteredCatalog.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }

  return (
    <div className="w-full relative bg-gradient-to-t from-[#F9F9F9] to-white flex flex-col items-center">
      
      {/* Search Bar Section */}
      <div className="w-full bg-[#F8FAFC] py-4 px-6 md:px-10 flex justify-center border-b border-[#E2E8F0]">
        <div className="w-full max-w-[1440px] flex justify-center">
          <div className="w-full max-w-[800px] h-12 px-4 bg-white shadow-md rounded-lg flex items-center">
            <Search className="w-[18px] h-[18px] text-[#777777] mr-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="SEARCH CATALOG..." 
              className="flex-1 bg-transparent border-none outline-none text-[#777777] text-xs font-normal font-['Inter'] uppercase tracking-[1.20px]"
            />
            <button 
              onClick={handleSearch}
              className="ml-4 px-4 py-2 bg-[#2563EB] shadow-[0px_1px_2px_rgba(105,81,255,0.05)] rounded-md flex justify-center items-center hover:bg-blue-700 transition"
            >
              <span className="text-[#F0FDF4] text-xs font-semibold font-['Poppins'] leading-[14.40px]">Cari Barang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="w-full max-w-[1440px] px-6 md:px-10 py-12 bg-[#F8FAFC] flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0 bg-transparent flex flex-col gap-8">
          
          <div className="w-full pb-3 flex justify-between items-end">
            <h2 className="text-black text-xl font-extrabold tracking-tight">Filters</h2>
            <button onClick={handleResetFilters} className="text-[#2563EB] text-sm font-semibold hover:underline">
              Reset
            </button>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-[#303334] text-sm font-bold tracking-[1.4px] uppercase mb-4">KATEGORI</h3>
            <div className="flex flex-col gap-3">
              {CATEGORY_OPTIONS.map((cat) => {
                const isActive = activeCategory === cat.value;
                return (
                  <label 
                    key={cat.value} 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => handleCategoryClick(cat.value)}
                  >
                    <div className={`w-5 h-5 rounded-[4px] flex justify-center items-center shadow-sm transition-all ${isActive ? 'bg-[#2563EB]' : 'bg-white border border-[#2563EB] group-hover:bg-blue-50'}`}>
                       {isActive && (
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                       )}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${isActive ? 'text-black font-bold' : 'text-[#5C6060] group-hover:text-black'}`}>
                      {cat.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Harga */}
          <div>
            <h3 className="text-[#303334] text-sm font-bold tracking-[1.4px] uppercase mb-4">HARGA</h3>
            
            {/* Price Inputs */}
            <div className="flex items-center gap-3">
               <div className="flex-1 flex flex-col gap-2">
                  <span className="text-[#5C6060] text-[10px] font-bold">MIN</span>
                  <div className="bg-white rounded-lg px-3 py-2.5 shadow-sm border border-[#2563EB]/20 flex items-center">
                    <span className="text-black text-sm font-normal mr-1">Rp</span>
                    <input 
                      type="number" 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-black text-sm font-medium"
                      placeholder="0"
                    />
                  </div>
               </div>
               <div className="flex-1 flex flex-col gap-2">
                  <span className="text-[#5C6060] text-[10px] font-bold">MAX</span>
                  <div className="bg-white rounded-lg px-3 py-2.5 shadow-sm border border-[#2563EB]/20 flex items-center">
                    <span className="text-black text-sm font-normal mr-1">Rp</span>
                    <input 
                      type="number" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-black text-sm font-medium"
                      placeholder="500k"
                    />
                  </div>
               </div>
            </div>
          </div>

          {/* Kondisi */}
          <div>
            <h3 className="text-[#303334] text-sm font-bold tracking-[1.4px] uppercase mb-4">KONDISI</h3>
            <div className="flex flex-col gap-3">
              {CONDITION_OPTIONS.map((cond) => {
                const isActive = activeConditions.includes(cond.value);
                return (
                  <label 
                    key={cond.value} 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => handleConditionToggle(cond.value)}
                  >
                    <div className={`w-5 h-5 rounded-[4px] flex justify-center items-center shadow-sm transition-all ${isActive ? 'bg-[#2563EB]' : 'bg-white border border-[#2563EB] group-hover:bg-blue-50'}`}>
                       {isActive && (
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                       )}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${isActive ? 'text-black font-bold' : 'text-[#5C6060] group-hover:text-black'}`}>
                      {cond.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-2">
             <button 
               onClick={handleApplyFilters} 
               className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 transition"
             >
               Apply Filters
             </button>
          </div>

        </aside>

        {/* Right Content / Product Grid */}
        <div className="flex-1 flex flex-col gap-8 w-full max-w-[852px]">
          
          {/* Top Bar (Count & Sort) */}
          <div className="w-full pb-4 border-b border-[#020617] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-black text-lg font-semibold font-['Poppins'] leading-[21.60px]">
                {filteredCatalog.length}
              </span>
              <span className="text-[#777777] text-base font-normal font-['Poppins'] leading-[19.20px]">
                ITEMS FOUND
              </span>
            </div>
            
            <div className="flex items-center gap-4">
               <span className="text-[#777777] text-sm font-normal font-['Poppins'] leading-[16.80px]">SORT BY</span>
               <div className="relative">
                  <select 
                    value={sortParam}
                    onChange={(e) => updateQueryParam("sort", e.target.value)}
                    className="appearance-none flex items-center px-4 py-2 bg-transparent border border-[#2563EB] shadow-[0px_1px_2px_rgba(105,81,255,0.05)] rounded-md text-[#2563EB] text-xs font-semibold font-['Poppins'] leading-[14.40px] pr-10 outline-none cursor-pointer"
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="termurah">Termurah</option>
                    <option value="termahal">Termahal</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                     <ChevronDown className="w-4 h-4 text-[#2563EB]" strokeWidth={3} />
                  </div>
               </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredCatalog.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCatalog.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <Search className="w-6 h-6 text-gray-400" />
               </div>
               <h3 className="text-lg font-bold text-[#303334] mb-2">Tidak ada produk ditemukan</h3>
               <p className="text-[#5C6060] text-sm max-w-sm mb-6">Coba sesuaikan filter kategori, kondisi, atau rentang harga.</p>
               <button onClick={handleResetFilters} className="px-6 py-2 bg-[#F4F3F3] text-[#303334] font-bold rounded-xl hover:bg-gray-200 transition">
                 Reset Filter
               </button>
            </div>
          )}

          {/* Pagination Mockup */}
          {filteredCatalog.length > 0 && (
            <div className="w-full pt-8 border-t border-[#020617] flex justify-center items-center gap-2">
               <button className="w-10 h-10 bg-white border border-[#C6C6C6] flex justify-center items-center hover:bg-gray-50 transition">
                  <ChevronLeft className="w-4 h-4 text-black" strokeWidth={3} />
               </button>
               <button className="w-10 h-10 bg-black border border-black flex justify-center items-center text-white text-sm font-bold font-['Inter'] leading-tight">
                  1
               </button>
               <button className="w-10 h-10 bg-white border border-[#C6C6C6] flex justify-center items-center text-black text-sm font-medium font-['Inter'] leading-tight hover:bg-gray-50 transition">
                  2
               </button>
               <button className="w-10 h-10 bg-white border border-[#C6C6C6] flex justify-center items-center text-black text-sm font-medium font-['Inter'] leading-tight hover:bg-gray-50 transition">
                  3
               </button>
               <span className="px-2 text-[#777777] text-base font-normal font-['Inter'] leading-normal">...</span>
               <button className="w-10 h-10 bg-white border border-[#C6C6C6] flex justify-center items-center hover:bg-gray-50 transition">
                  <ChevronRight className="w-4 h-4 text-black" strokeWidth={3} />
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}

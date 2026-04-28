"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, Leaf, LayoutGrid, X, ChevronDown, Check, ChevronLeft, Search } from "lucide-react";
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
  { label: "All Items", value: "" },
  { label: "Buku", value: "BUKU" },
  { label: "Electronics", value: "ELECTRONICS" },
  { label: "Dorm Essentials", value: "DORM ESSENTIALS" },
  { label: "Fashion", value: "FASHION" }
];

const LOCATION_OPTIONS = ["DRAMAGA", "BARANANGSIANG", "GUNUNG GEDE"];

function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current URL params
  const activeCategory = searchParams.get("category") || "";
  const activeLocations = searchParams.get("location")?.split(",").filter(Boolean) || [];
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const sortParam = searchParams.get("sort") || "terbaru";

  // Local state for price inputs
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  // Sync local state when URL changes
  useEffect(() => {
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
  }, [minPriceParam, maxPriceParam]);

  // Helper to update URL params
  const updateQueryParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Click Handlers
  const handleCategoryClick = (val) => updateQueryParam("category", val);

  const handleLocationToggle = (loc) => {
    let newLocations = [...activeLocations];
    if (newLocations.includes(loc)) {
      newLocations = newLocations.filter(l => l !== loc);
    } else {
      newLocations.push(loc);
    }
    updateQueryParam("location", newLocations.join(","));
  };

  const handleApplyPrice = () => {
    const params = new URLSearchParams(searchParams);
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const handleRemoveFilter = (key, valueToRemove) => {
    if (key === "location") {
      handleLocationToggle(valueToRemove);
    } else {
      updateQueryParam(key, "");
    }
  };

  // Apply filters to data
  let filteredCatalog = DUMMY_CATALOG.filter((item) => {
    if (activeCategory && item.category !== activeCategory) return false;
    if (activeLocations.length > 0 && !activeLocations.includes(item.location)) return false;
    if (minPriceParam && item.price < parseInt(minPriceParam)) return false;
    if (maxPriceParam && item.price > parseInt(maxPriceParam)) return false;
    return true;
  });

  // Apply sorting
  if (sortParam === "termurah") {
    filteredCatalog.sort((a, b) => a.price - b.price);
  } else if (sortParam === "termahal") {
    filteredCatalog.sort((a, b) => b.price - a.price);
  } else {
    // terbaru (default array order / reverse id)
    filteredCatalog.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8">
      {/* Top Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#5C6060] font-medium mb-4">
          <Link href="/" className="hover:text-[#303334] transition">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#303334]">Katalog</span>
        </div>

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
            <div className="flex flex-col gap-3">
              {CATEGORY_OPTIONS.map((cat) => {
                const isActive = activeCategory === cat.value;
                return (
                  <label key={cat.label} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category"
                      className="hidden" 
                      checked={isActive} 
                      onChange={() => handleCategoryClick(cat.value)}
                    />
                    {isActive ? (
                       <div className="w-4 h-4 rounded-[4px] bg-[#5F5E5E] shadow-sm transition"></div>
                    ) : (
                       <div className="w-4 h-4 rounded-[4px] bg-[#D1D5DB] group-hover:bg-[#9CA3AF] transition shadow-sm"></div>
                    )}
                    <span className={`text-sm font-medium transition ${isActive ? 'text-[#303334]' : 'text-[#5C6060] group-hover:text-[#303334]'}`}>
                      {cat.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-[#303334] text-sm font-bold tracking-[1.4px] uppercase mb-4">PRICE RANGE</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[#5C6060] text-[10px] font-bold">MIN</span>
                <div className="bg-white rounded-lg px-3 py-2.5 shadow-sm border border-gray-100 flex items-center">
                   <span className="text-[#6B7280] font-medium text-sm mr-1">Rp</span>
                   <input 
                     type="number" 
                     value={minPrice} 
                     onChange={(e) => setMinPrice(e.target.value)}
                     className="w-full text-[#303334] text-sm font-medium bg-transparent border-none outline-none p-0" 
                     placeholder="0"
                   />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[#5C6060] text-[10px] font-bold">MAX</span>
                <div className="bg-white rounded-lg px-3 py-2.5 shadow-sm border border-gray-100 flex items-center">
                   <span className="text-[#6B7280] font-medium text-sm mr-1">Rp</span>
                   <input 
                     type="number" 
                     value={maxPrice} 
                     onChange={(e) => setMaxPrice(e.target.value)}
                     className="w-full text-[#303334] text-sm font-medium bg-transparent border-none outline-none p-0" 
                     placeholder="5jt+"
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-[#303334] text-sm font-bold tracking-[1.4px] uppercase mb-4">LOCATION</h3>
            <div className="flex flex-col gap-3">
              {LOCATION_OPTIONS.map((loc) => {
                const isActive = activeLocations.includes(loc);
                return (
                  <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isActive} 
                      onChange={() => handleLocationToggle(loc)}
                    />
                    {isActive ? (
                       <div className="w-5 h-5 rounded md bg-[#5F5E5E] flex items-center justify-center shadow-sm transition">
                         <Check className="w-3.5 h-3.5 text-white" />
                       </div>
                    ) : (
                       <div className="w-5 h-5 rounded border border-[#B0B2B3] bg-white group-hover:border-gray-500 transition shadow-sm"></div>
                    )}
                    <span className={`text-sm font-medium transition ${isActive ? 'text-[#303334]' : 'text-[#5C6060] group-hover:text-[#303334]'}`}>
                      {loc.charAt(0) + loc.slice(1).toLowerCase()}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <button onClick={handleApplyPrice} className="w-full py-3 bg-[#5F5E5E] text-[#FAF7F6] font-bold rounded-xl shadow-sm hover:bg-[#4a4a4a] transition">
              Apply Filters
            </button>
            <button onClick={handleResetFilters} className="w-full py-3 text-[#5C6060] text-xs font-bold hover:text-[#303334] transition">
              Reset all filters
            </button>
          </div>

        </aside>

        {/* Right Content */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          
          {/* Top Bar (Active filters & sort) */}
          <div className="bg-[#F4F3F3] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[#303334] text-sm font-bold">Menampilkan {filteredCatalog.length} produk</span>
              
              {(activeCategory || activeLocations.length > 0 || minPriceParam || maxPriceParam) && (
                <div className="hidden sm:block w-px h-5 bg-[#B0B2B3]"></div>
              )}
              
              {/* Active Filters Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {activeCategory && (
                  <button onClick={() => handleRemoveFilter("category")} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition">
                    <span className="text-[#303334] text-[11px] font-bold">{CATEGORY_OPTIONS.find(c => c.value === activeCategory)?.label || activeCategory}</span>
                    <X className="w-3 h-3 text-[#303334]" />
                  </button>
                )}
                {activeLocations.map((loc) => (
                  <button key={loc} onClick={() => handleRemoveFilter("location", loc)} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition">
                    <span className="text-[#303334] text-[11px] font-bold">{loc.charAt(0) + loc.slice(1).toLowerCase()}</span>
                    <X className="w-3 h-3 text-[#303334]" />
                  </button>
                ))}
                {minPriceParam && (
                  <button onClick={() => handleRemoveFilter("minPrice")} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition">
                    <span className="text-[#303334] text-[11px] font-bold">Min: Rp {parseInt(minPriceParam).toLocaleString('id-ID')}</span>
                    <X className="w-3 h-3 text-[#303334]" />
                  </button>
                )}
                {maxPriceParam && (
                  <button onClick={() => handleRemoveFilter("maxPrice")} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition">
                    <span className="text-[#303334] text-[11px] font-bold">Max: Rp {parseInt(maxPriceParam).toLocaleString('id-ID')}</span>
                    <X className="w-3 h-3 text-[#303334]" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-3">
              <span className="text-[#5C6060] text-xs font-bold tracking-wider uppercase">SORT BY:</span>
              <div className="relative">
                <select 
                  value={sortParam}
                  onChange={(e) => updateQueryParam("sort", e.target.value)}
                  className="appearance-none flex items-center py-2 pl-4 pr-10 bg-transparent border border-transparent hover:border-gray-300 rounded-xl transition text-[#303334] text-sm font-bold outline-none cursor-pointer"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="termurah">Termurah</option>
                  <option value="termahal">Termahal</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Product Grid */}
          {filteredCatalog.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCatalog.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <Search className="w-6 h-6 text-gray-400" />
               </div>
               <h3 className="text-lg font-bold text-[#303334] mb-2">Tidak ada produk ditemukan</h3>
               <p className="text-[#5C6060] text-sm max-w-sm">Coba sesuaikan filter kategori, lokasi, atau rentang harga untuk menemukan produk yang lo cari.</p>
               <button onClick={handleResetFilters} className="mt-6 px-6 py-2 bg-[#F4F3F3] text-[#303334] font-bold rounded-xl hover:bg-gray-200 transition">
                 Reset Filter
               </button>
            </div>
          )}

          {/* Pagination */}
          {filteredCatalog.length > 0 && (
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
          )}

        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="bg-[#FBF9F9] min-h-screen pt-24 pb-20 font-sans">
      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#3C6A35] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <CatalogContent />
      </Suspense>
    </div>
  );
}

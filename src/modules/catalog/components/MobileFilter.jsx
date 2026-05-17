import React from "react";
import { X, Check } from "lucide-react";

export default function MobileFilter({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory, 
  toggleCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  condition,
  toggleCondition,
  onApply,
  onReset
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex justify-center items-end sm:items-center p-4 sm:p-0">
      <div className="w-full max-w-sm bg-white rounded-[32px] sm:rounded-2xl flex flex-col justify-start items-start gap-4 overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="w-full px-6 py-4 bg-white border-b border-gray-100 flex justify-between items-center">
          <button 
            onClick={onReset}
            className="text-center text-zinc-600 text-sm font-medium font-poppins leading-5 uppercase tracking-wider hover:text-blue-600 transition-colors"
          >
            RESET
          </button>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="size-5 text-zinc-600" />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="w-full flex-1 overflow-y-auto max-h-[70vh] flex flex-col gap-6 py-4">
          
          {/* Kategori */}
          <div className="px-6 flex flex-col gap-4">
            <h3 className="text-slate-950 text-base font-medium font-poppins leading-6">KATEGORI</h3>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => toggleCategory("all")}
                className="flex items-center gap-3 text-left group"
              >
                <div className={`size-5 rounded-sm border-2 flex items-center justify-center transition-colors ${
                  selectedCategory.length === 0 ? "bg-slate-950 border-slate-950" : "bg-white border-zinc-400/50"
                }`}>
                  {selectedCategory.length === 0 && <Check className="size-3 text-white" strokeWidth={4} />}
                </div>
                <span className={`text-slate-950 text-base font-poppins leading-6 ${selectedCategory.length === 0 ? "font-bold" : "font-medium"}`}>
                  Semua Kategori
                </span>
              </button>
              {categories.map((cat) => {
                const isActive = selectedCategory.includes(cat.id);
                return (
                  <button 
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className="flex items-center gap-3 text-left group"
                  >
                    <div className={`size-5 rounded-sm border-2 flex items-center justify-center transition-colors ${
                      isActive ? "bg-slate-950 border-slate-950" : "bg-white border-zinc-400/50"
                    }`}>
                      {isActive && <Check className="size-3 text-white" strokeWidth={4} />}
                    </div>
                    <span className={`text-slate-950 text-base font-poppins leading-6 ${isActive ? "font-bold" : "font-medium"}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Harga */}
          <div className="px-6 flex flex-col gap-2">
            <h3 className="text-slate-950 text-base font-medium font-poppins leading-6">HARGA</h3>
            <div className="pt-2 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-zinc-600 text-sm font-medium font-poppins leading-5 uppercase tracking-wide">MIN</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm font-medium font-poppins">Rp</span>
                  <input 
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-3 py-2 bg-white border-b-2 border-zinc-400/20 outline-none text-zinc-800 text-sm font-medium font-poppins focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-600 text-sm font-medium font-poppins leading-5 uppercase tracking-wide">MAX</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm font-medium font-poppins">Rp</span>
                  <input 
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="500.000"
                    className="w-full pl-10 pr-3 py-2 bg-white border-b-2 border-zinc-400/20 outline-none text-zinc-800 text-sm font-medium font-poppins focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kondisi */}
          <div className="px-6 flex flex-col gap-4">
            <h3 className="text-slate-950 text-base font-medium font-poppins leading-6">KONDISI</h3>
            <div className="flex flex-col gap-4">
              {["Semua Kondisi", "Baru", "Pernah Dipakai", "Perlu Perbaikan"].map((k) => {
                const isActive = k === "Semua Kondisi" ? condition.length === 0 : condition.includes(k);
                return (
                  <button 
                    key={k}
                    onClick={() => toggleCondition(k)}
                    className="flex items-center gap-3 text-left group"
                  >
                    <div className={`size-5 rounded-sm border-2 flex items-center justify-center transition-colors ${
                      isActive ? "bg-slate-950 border-slate-950" : "bg-white border-zinc-400/50"
                    }`}>
                      {isActive && <Check className="size-3 text-white" strokeWidth={4} />}
                    </div>
                    <span className={`text-slate-950 text-base font-poppins leading-6 ${isActive ? "font-bold" : "font-medium"}`}>
                      {k}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full p-6 bg-white border-t border-gray-100">
          <button 
            onClick={onApply}
            className="w-full py-3.5 bg-blue-600 rounded-xl shadow-[0px_4px_14px_rgba(48,51,52,0.15)] text-center text-white text-base font-bold font-sans leading-6 active:scale-[0.98] transition-transform"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
}

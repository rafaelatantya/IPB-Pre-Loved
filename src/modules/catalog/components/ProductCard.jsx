"use client";

import React from "react";
import Link from "next/link";
import { Heart, MapPin, Tag } from "lucide-react";
import WishlistButton from "@/modules/wishlist/components/WishlistButton";

const ProductCard = ({ product, variant = "default" }) => {
  // Logic untuk handle data asli vs dummy
  const imageUrl = product.images?.[0]?.url || product.image || "https://placehold.co/268x200";
  const categoryName = product.category?.name || product.category || "UMUM";
  const sellerName = product.seller?.name || product.sellerName || "Penjual IPB";
  const condition = product.condition || "BARU";

  const isLanding = variant === "landing";

  return (
    <Link href={`/product/${product.id}`} className={`group bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border border-stone-300 w-full`}>
      {/* Image Container */}
      <div className={`relative ${isLanding ? 'h-32 md:h-48' : 'aspect-[4/3]'} overflow-hidden bg-stone-100 p-2 md:p-4 flex flex-col justify-start`}>
        <img 
          src={imageUrl} 
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
        />
        
        {/* Top Overlay Elements */}
        <div className="relative z-10 w-full flex justify-between items-center">
            {/* Category Pill */}
            <div className={`${isLanding ? 'px-1.5 py-0.5' : 'px-2 py-0.5'} bg-blue-600 shadow-[0_1px_2px_rgba(105,81,255,0.05)] rounded-full md:rounded-full flex justify-center items-center`}>
                <span className={`text-emerald-50 ${isLanding ? 'text-[8px] md:text-[12px]' : 'text-[12px]'} font-semibold font-poppins uppercase whitespace-nowrap`}>
                  {categoryName}
                </span>
            </div>
            
            {/* Wishlist Button */}
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <WishlistButton 
                productId={product.id} 
                className={`${isLanding ? 'w-6 h-6 md:w-8 md:h-8' : 'w-8 h-8'} bg-[#EF4444] rounded-full text-white hover:bg-red-600 transition-colors shadow-sm flex justify-center items-center`}
                iconSize={isLanding ? 12 : 15}
              />
            </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${isLanding ? 'px-3 py-2 md:p-4' : 'p-4'} bg-white border-t border-stone-300 flex flex-col gap-1 md:gap-2 flex-1`}>
        {/* Row 1: Title & Kondisi */}
        <div className="w-full flex justify-between items-center gap-1 md:gap-2">
            <h3 className={`flex-1 text-zinc-900 ${isLanding ? 'text-[11px] md:text-[20px]' : 'text-[20px]'} font-semibold font-poppins leading-tight md:leading-normal line-clamp-1 group-hover:text-blue-600 transition-colors uppercase md:normal-case`}>
                {product.title}
            </h3>
            <div className={`px-1.5 py-0.5 bg-[#DCFCE7] shadow-[0_1px_2px_rgba(105,81,255,0.05)] rounded-full flex justify-center items-center shrink-0`}>
                <span className={`text-[#16A34A] ${isLanding ? 'text-[8px] md:text-[12px]' : 'text-[12px]'} font-semibold font-poppins uppercase`}>{condition}</span>
            </div>
        </div>
        
        {/* Row 2: Penjual */}
        <div className="w-full flex justify-start items-start">
            <span className={`text-slate-500 ${isLanding ? 'text-[9px] md:text-[12px]' : 'text-[12px]'} font-semibold font-poppins leading-normal line-clamp-1`}>
                {sellerName}
            </span>
        </div>
        
        {/* Row 3: Price */}
        <div className="w-full mt-auto pt-1 flex justify-between items-center">
            <span className={`text-zinc-900 ${isLanding ? 'text-[11px] md:text-[20px]' : 'text-[20px]'} font-semibold font-poppins leading-normal`}>
                Rp {product.price?.toLocaleString("id-ID") || 0}
            </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

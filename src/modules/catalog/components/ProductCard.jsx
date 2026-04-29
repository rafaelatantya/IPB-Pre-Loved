"use client";

import React from "react";
import Link from "next/link";
import { Heart, MapPin, Tag } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <Link href={`/product/${product.id}`} className="group bg-white border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <button 
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-bold text-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {product.category}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-black text-sm font-semibold line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
            {product.title}
          </h3>
          <p className="text-blue-600 text-lg font-bold">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-500 font-medium uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {product.location}
          </div>
          <span>{product.timePosted || "Baru"}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

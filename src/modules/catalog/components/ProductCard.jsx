import React from "react";
import Link from "next/link";
import { Heart, Leaf } from "lucide-react";

const ProductCard = ({ product }) => {
  const categoryName = product.category?.name || product.category || 'BARANG BEKAS';
  const isSustainable = product.condition === 'BAIK' || product.condition === 'BARU'; // Contoh dummy logic
  const locationText = product.location || "DRAMAGA";
  const timeText = product.timePosted || "1 HARI LALU";

  return (
    <Link href={`/product/${product.id}`} className="group w-full">
      <div className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
        
        {/* Image Section */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
            {/* Condition Badge */}
            <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[9px] font-black uppercase text-[#303334] tracking-wider shadow-sm">
              {product.condition}
            </div>
            {/* Category / Sustainable Badge */}
            {isSustainable ? (
               <div className="px-2 py-1 bg-[#3C6A35] rounded flex items-center gap-1 shadow-sm">
                 <Leaf className="w-2 h-2 text-[#EBFFE0]" />
                 <span className="text-[9px] font-black uppercase text-[#EBFFE0] tracking-wider">SUSTAINABLE</span>
               </div>
            ) : (
               <div className="px-2 py-1 bg-[#5F5E5E] rounded text-[9px] font-black uppercase text-[#FAF7F6] tracking-wider shadow-sm">
                 {categoryName}
               </div>
            )}
          </div>

          {/* Wishlist Button (Overlay Top Right) */}
          <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#5C6060] hover:text-rose-500 transition shadow-sm">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Info Section */}
        <div className="p-4 md:p-5">
          <div className="mb-1">
            <p className="text-[9px] md:text-[10px] font-bold text-[#5C6060] uppercase tracking-widest mb-2">
              {locationText} • {timeText}
            </p>
            <h3 className="text-base md:text-lg font-bold text-[#303334] line-clamp-2 leading-snug group-hover:text-[#3C6A35] transition-colors">
              {product.title}
            </h3>
          </div>
          
          <div className="mt-2 md:mt-3">
            <p className="text-[#303334] font-black text-lg md:text-xl">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
        
      </div>
    </Link>
  );
};

export default ProductCard;

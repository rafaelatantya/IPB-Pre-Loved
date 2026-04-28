import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

const ProductCard = ({ product }) => {
  const categoryName = product.category?.name || product.category || 'BARANG BEKAS';
  const sellerName = product.sellerName || "Mhs IPB";

  return (
    <Link href={`/product/${product.id}`} className="group w-full max-w-[268px] mx-auto md:mx-0">
      <div className="bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col items-start transition-transform duration-300 hover:scale-[1.02]">
        
        {/* Image Section */}
        <div className="w-full h-[200px] relative flex flex-col overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 w-full p-4 flex justify-between items-start">
            {/* Category Badge */}
            <div className="h-[22px] px-2 py-0.5 bg-[#2563EB] shadow-[0px_1px_2px_rgba(105,81,255,0.05)] rounded-[36px] flex justify-center items-center">
              <span className="text-[#F0FDF4] text-xs font-semibold font-['Poppins'] leading-[14.40px]">
                {categoryName.toUpperCase()}
              </span>
            </div>

            {/* Heart Button */}
            <div className="w-8 h-8 bg-[#EF4444] rounded-full flex justify-center items-center shadow-sm hover:bg-red-600 transition-colors">
               <Heart className="w-[15px] h-[14px] text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full p-4 bg-white border-t border-[#C6C6C6] flex flex-col gap-2">
          <div className="w-full overflow-hidden">
             <h3 className="text-black text-sm font-semibold font-['Poppins'] leading-[16.80px] line-clamp-2">
               {product.title}
             </h3>
          </div>
          
          <div className="w-full pt-2 flex justify-between items-center">
             <div className="text-black text-xl font-semibold font-['Poppins'] leading-normal">
               Rp {product.price.toLocaleString('id-ID')}
             </div>
             <div className="h-[22px] px-2 py-0.5 bg-[#DCFCE7] shadow-[0px_1px_2px_rgba(105,81,255,0.05)] rounded-[36px] flex justify-center items-center">
                <span className="text-[#16A34A] text-xs font-semibold font-['Poppins'] leading-[14.40px]">
                  {product.condition}
                </span>
             </div>
          </div>

          <div className="w-full overflow-hidden mt-1">
             <p className="text-[#64748B] text-xs font-semibold font-['Poppins'] leading-[14.40px]">
               {sellerName}
             </p>
          </div>
        </div>
        
      </div>
    </Link>
  );
};

export default ProductCard;

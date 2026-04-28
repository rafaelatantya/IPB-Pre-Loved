import React from "react";
import Link from "next/link";
import { MessageCircle, Heart, MapPin, AlertCircle } from "lucide-react";

export const runtime = 'edge';
import ProductCard from "@/modules/catalog/components/ProductCard";

// Mock Product Data
const DUMMY_PRODUCT = {
  id: "1",
  title: "Laptop Asus Vivobook S14",
  price: 4250000,
  condition: "Like New",
  category: "ELEKTRONIK",
  location: "Dramaga",
  timePosted: "2 days ago",
  images: [
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
  ],
  description: "Halo kawan-kawan! Mau jual laptop pegangan wajib nih buat yang lagi ngambil matkul pemrograman atau struktur data. Isinya ngebahas fondasi logika, array, linked list, sampai sorting yang diimplementasiin langsung pakai bahasa pemrograman Java. Cocok banget buat anak SSMI yang lagi butuh referensi tambahan selain slide dosen.\n\nMinus Barang: Ada bekas stiker di bagian bawah casing.\nAlasan Jual: Udah lulus matkulnya semester kemaren dan lagi mau decluttering biar agak lega.\nLokasi COD: Bisa ketemuan langsung di sekitaran Kantin Cyber, Perpustakaan LSI, atau depan Grha Widya Wisuda (GWW).",
  seller: {
    name: "Andi (Mahasiswa IPB)",
    verified: true,
    joined: "2023",
    status: "Student",
    replyTime: "Typically replies in 1-2 hours",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
  }
};

const DUMMY_RECOMMENDATIONS = [
  { id: "101", title: "iPad Air 4 64GB Silver", price: 5100000, condition: "LIKE NEW", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=500&auto=format&fit=crop", location: "BABAKAN", timePosted: "3 HARI LALU" },
  { id: "102", title: "Sony WH-1000XM4 Mulus", price: 2450000, condition: "BAIK", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=500&auto=format&fit=crop", location: "DRAMAGA", timePosted: "5 JAM LALU" },
  { id: "103", title: "Backpack Tigernu Waterproof", price: 250000, condition: "CUKUP", category: "FASHION", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop", location: "CILIBENDE", timePosted: "1 MINGGU LALU" },
  { id: "104", title: "Logitech MX Master 2S", price: 650000, condition: "LIKE NEW", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=500&auto=format&fit=crop", location: "DRAMAGA", timePosted: "1 HARI LALU" },
];

export default function ProductDetailPage() {
  return (
    <div className="w-full relative bg-gradient-to-t from-[#F9F9F9] to-white flex flex-col items-center">
      
      {/* Product Detail Layout */}
      <div className="w-full max-w-[1440px] px-6 md:px-10 py-8 md:py-12 bg-[#F8FAFC] flex flex-col gap-10">
        
        {/* Breadcrumb */}
        <div className="w-full flex justify-start items-center gap-2 mt-4 md:mt-0">
            <Link href="/catalog" className="text-[#777777] text-sm font-normal font-['Poppins'] leading-[16.80px] hover:text-black transition">
              KATALOG
            </Link>
            <div className="w-[4.32px] h-[7px] bg-[#777777]" />
            <div className="text-[#020617] text-sm font-normal font-['Poppins'] leading-[16.80px]">
              PRODUCT DETAIL
            </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="w-full flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left Column (Images & Description) */}
            <div className="flex-1 flex flex-col gap-6 w-full">
                
                {/* Images */}
                <div className="flex flex-col gap-6 w-full">
                    <div className="w-full aspect-[4/3] md:h-[510px] bg-gray-100 border border-[#C6C6C6] relative overflow-hidden flex justify-center items-center group">
                        <img 
                          src={DUMMY_PRODUCT.images[0]} 
                          alt={DUMMY_PRODUCT.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4 w-full h-[80px] md:h-[158px]">
                        <div className="h-full bg-gray-100 border border-[#C6C6C6] overflow-hidden cursor-pointer hover:border-black transition-colors">
                           <img src={DUMMY_PRODUCT.images[1]} alt="thumb 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="h-full bg-gray-100 border border-[#C6C6C6] overflow-hidden cursor-pointer hover:border-black transition-colors">
                           <img src={DUMMY_PRODUCT.images[2]} alt="thumb 2" className="w-full h-full object-cover" />
                        </div>
                        <div className="h-full bg-gray-100 border border-[#C6C6C6] overflow-hidden cursor-pointer hover:border-black transition-colors">
                           <img src={DUMMY_PRODUCT.images[3]} alt="thumb 3" className="w-full h-full object-cover" />
                        </div>
                        <div className="h-full bg-gray-800 border border-[#C6C6C6] flex justify-center items-center relative overflow-hidden cursor-pointer">
                            <img src={DUMMY_PRODUCT.images[0]} alt="thumb 4" className="w-full h-full object-cover opacity-50 hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                              <span className="text-white text-base md:text-xl font-bold font-['Inter']">+3</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="w-full pt-8 flex flex-col">
                    <div className="w-full pt-8 border-t border-[#C6C6C6] flex flex-col gap-6">
                        <h2 className="text-black text-lg font-semibold font-['Poppins'] leading-[21.60px]">
                          DESCRIPTION
                        </h2>
                        <div className="text-black text-base font-normal font-['Poppins'] leading-[19.20px] text-justify whitespace-pre-wrap">
                          {DUMMY_PRODUCT.description}
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column (Info & Actions) */}
            <div className="w-full lg:w-[472px] flex flex-col gap-8 shrink-0 lg:sticky lg:top-24">
                
                {/* Header Info */}
                <div className="flex flex-col gap-4">
                    <div className="h-6 px-2.5 py-0.5 bg-[#ECFEFF] shadow-[0px_1px_2px_rgba(105,81,255,0.05)] rounded-[36px] flex justify-center items-center gap-2 self-start">
                        <div className="w-3 h-3 relative overflow-hidden flex justify-center items-center">
                            <div className="w-2.5 h-2.5 bg-[#06B6D4] rounded-sm" />
                        </div>
                        <div className="text-[#06B6D4] text-xs font-semibold font-['Poppins'] leading-[14.40px]">
                          Admin Verified
                        </div>
                    </div>
                    <h1 className="text-black text-3xl md:text-[40px] font-semibold font-['Poppins'] leading-[1.2] md:leading-[48px]">
                        {DUMMY_PRODUCT.title}
                    </h1>
                    <div className="text-black text-2xl font-normal font-['Poppins'] leading-[28.80px]">
                        Rp {DUMMY_PRODUCT.price.toLocaleString('id-ID')}
                    </div>
                </div>

                {/* Attributes Card */}
                <div className="w-full p-6 bg-white border border-[#E2E8F0] flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <div className="text-[#777777] text-xs font-normal font-['Poppins'] leading-[14.40px]">KATEGORI</div>
                        <div className="text-black text-sm font-normal font-['Poppins'] leading-[16.80px]">{DUMMY_PRODUCT.category}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-[#777777] text-xs font-normal font-['Poppins'] leading-[14.40px]">KONDISI</div>
                        <div className="text-black text-sm font-normal font-['Poppins'] leading-[16.80px]">{DUMMY_PRODUCT.condition}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-[#777777] text-xs font-normal font-['Poppins'] leading-[14.40px]">LOKASI</div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-black" />
                            <div className="text-black text-sm font-normal font-['Poppins'] leading-[16.80px]">{DUMMY_PRODUCT.location}</div>
                        </div>
                    </div>
                </div>

                {/* Seller Card */}
                <div className="w-full p-6 bg-white border border-[#E2E8F0] flex items-center gap-4">
                    <img 
                      className="w-12 h-12 border border-[#C6C6C6] rounded-full object-cover" 
                      src={DUMMY_PRODUCT.seller.avatar} 
                      alt={DUMMY_PRODUCT.seller.name} 
                    />
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="text-[#777777] text-xs font-normal font-['Poppins'] leading-[14.40px]">
                          IDENTITAS PENJUAL
                        </div>
                        <div className="text-black text-lg font-semibold font-['Poppins'] leading-[21.60px]">
                          {DUMMY_PRODUCT.seller.name}
                        </div>
                        <div className="text-[#5E5E5E] text-xs font-normal font-['Poppins'] leading-[14.40px]">
                          {DUMMY_PRODUCT.seller.status} • Joined {DUMMY_PRODUCT.seller.joined}
                        </div>
                        <div className="pt-2 flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-[#777777] rounded-full" />
                            <div className="text-[#777777] text-xs font-normal font-['Poppins'] leading-[14.40px]">
                              {DUMMY_PRODUCT.seller.replyTime}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-2">
                    <button className="w-full h-[46px] px-[18px] py-3 bg-[#16A34A] shadow-[0px_1px_2px_rgba(105,81,255,0.05)] rounded-md flex justify-center items-center gap-2 hover:bg-green-700 transition">
                        <MessageCircle className="w-4 h-4 text-[#F0FDF4]" />
                        <span className="text-[#F0FDF4] text-sm font-semibold font-['Poppins'] leading-[16.80px]">HUBUNGI VIA WHATSAPP</span>
                    </button>
                    <button className="w-full h-[46px] px-[18px] py-3 bg-[#2563EB] shadow-[0px_1px_2px_rgba(105,81,255,0.05)] rounded-md flex justify-center items-center gap-2 hover:bg-blue-700 transition">
                        <Heart className="w-4 h-4 text-[#F0FDF4]" />
                        <span className="text-[#F0FDF4] text-sm font-semibold font-['Poppins'] leading-[16.80px]">TAMBAH KE WISHLIST</span>
                    </button>
                </div>

                {/* Disclaimer */}
                <div className="w-full p-4 bg-[#E2E2E2] border border-[#C6C6C6] flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-[#5E5E5E] shrink-0 mt-0.5" />
                    <div className="text-[#5E5E5E] text-xs font-normal font-['Poppins'] leading-[14.40px]">
                      System strictly prohibits transactions outside the platform framework.<br/>
                      Meet in designated safe zones on campus.
                    </div>
                </div>

            </div>

        </div>

      </div>

      {/* Similar Recommendations Section */}
      <div className="w-full max-w-[1440px] px-6 md:px-10 pb-20 pt-10 flex flex-col gap-8 bg-[#F8FAFC]">
        <div className="flex items-end justify-between border-b border-[#C6C6C6] pb-4">
          <div>
            <h2 className="text-[#303334] text-2xl font-bold mb-1">Rekomendasi Serupa</h2>
            <p className="text-[#5C6060] text-sm">Mungkin kamu juga membutuhkan ini untuk kuliah.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {DUMMY_RECOMMENDATIONS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
}

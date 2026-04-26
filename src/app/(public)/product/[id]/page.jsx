import React from "react";
import Link from "next/link";
import { ChevronRight, Leaf, Heart, MessageCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
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
  description: "Dijual santai Laptop Asus Vivobook S14 kesayangan. Kondisi fisik 98% mulus, sangat terawat karena selalu pakai laptop skin dan keyboard protector. Unit ini sangat andal digunakan untuk kebutuhan perkuliahan, terutama bagi mahasiswa yang butuh mobilitas tinggi.",
  specs: [
    "Intel Core i5 11th Gen",
    "RAM 8GB DDR4 / SSD 512GB NVMe",
    "Layar 14 Inch Full HD NanoEdge Display",
    "Backlit Keyboard & Fingerprint Sensor"
  ],
  reasonForSelling: "Sudah lulus sidang dan berencana upgrade untuk kebutuhan kerja. Laptop ini sangat berjasa menemani pengerjaan skripsi di LSI dan Perpustakaan IPB. Baterai masih awet 4-5 jam untuk pemakaian normal.",
  seller: {
    name: "Andi (Mahasiswa IPB)",
    verified: true,
    rating: 4.9,
    productsCount: 12,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
  }
};

const DUMMY_RECOMMENDATIONS = [
  { id: "101", title: "iPad Air 4 64GB Silver", price: 5100000, condition: "LIKE NEW", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=500&auto=format&fit=crop", location: "BABAKAN", timePosted: "3 HARI LALU" },
  { id: "102", title: "Sony WH-1000XM4 Mulus", price: 2450000, condition: "BAIK", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=500&auto=format&fit=crop", location: "DRAMAGA", timePosted: "5 JALAM LALU" },
  { id: "103", title: "Backpack Tigernu Waterproof", price: 250000, condition: "CUKUP", category: "FASHION", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop", location: "CILIBENDE", timePosted: "1 MINGGU LALU" },
  { id: "104", title: "Logitech MX Master 2S", price: 650000, condition: "LIKE NEW", category: "ELECTRONICS", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=500&auto=format&fit=crop", location: "DRAMAGA", timePosted: "1 HARI LALU" },
];

export default function ProductDetailPage() {
  return (
    <div className="bg-[#FBF9F9] min-h-screen pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#5C6060] font-medium mb-8">
          <Link href="/" className="hover:text-[#303334] transition">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/catalog" className="hover:text-[#303334] transition">Katalog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#303334] font-bold">{DUMMY_PRODUCT.title}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (Images & Info) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="w-full aspect-[4/3] bg-[#F4F3F3] rounded-2xl overflow-hidden relative border border-gray-100">
                <img 
                  src={DUMMY_PRODUCT.images[0]} 
                  alt={DUMMY_PRODUCT.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-4 py-2 bg-[#3C6A35] rounded-full flex items-center gap-2 shadow-sm">
                  <Leaf className="w-4 h-4 text-[#EBFFE0]" />
                  <span className="text-[#EBFFE0] text-xs font-bold tracking-wide uppercase">GREEN CAMPUS INITIATIVE</span>
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {DUMMY_PRODUCT.images.slice(0, 4).map((img, idx) => (
                  <button key={idx} className={`aspect-square rounded-xl overflow-hidden border-2 ${idx === 0 ? 'border-[#5F5E5E]' : 'border-transparent hover:border-gray-300'} transition`}>
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col gap-8">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-[#303334] text-2xl font-bold">Detail Produk</h2>
              </div>
              
              <div className="flex flex-col gap-6 text-[#5C6060] text-base leading-relaxed">
                <p>{DUMMY_PRODUCT.description}</p>
                
                <div>
                  <p className="font-bold mb-1">Spesifikasi Singkat:</p>
                  <ul className="list-disc pl-5">
                    {DUMMY_PRODUCT.specs.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </div>
                
                <p>
                  <span className="font-bold">Alasan Jual:</span> {DUMMY_PRODUCT.reasonForSelling}
                </p>
              </div>

              {/* Eco-Impact Banner */}
              <div className="bg-[#F4F3F3] p-6 rounded-xl border-l-4 border-[#3C6A35] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#3C6A35]" />
                  <span className="text-[#303334] font-bold text-base">Eco-Impact</span>
                </div>
                <p className="text-[#303334] text-sm leading-relaxed">
                  Dengan membeli produk PreLoved ini, Anda telah berkontribusi mengurangi emisi karbon sebesar ~250kg CO2e yang dihasilkan dari produksi laptop baru.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (Action Card & Seller) */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24 self-start">
            
            {/* Price & Actions Card */}
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(48,51,52,0.04)] border border-gray-100 p-8 flex flex-col gap-6">
              
              <div className="flex items-center justify-between">
                <h2 className="text-[#303334] text-3xl font-extrabold tracking-tight">
                  Rp {DUMMY_PRODUCT.price.toLocaleString('id-ID')}
                </h2>
                <div className="px-3 py-1 bg-[#E5E2E1] rounded-full text-[#525151] text-xs font-bold uppercase tracking-wider">
                  {DUMMY_PRODUCT.category}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 bg-[#EEEEEE] rounded-full text-[#5C6060] text-xs font-semibold">
                  {DUMMY_PRODUCT.condition}
                </span>
                <span className="px-3 py-1.5 bg-[#EEEEEE] rounded-full text-[#5C6060] text-xs font-semibold">
                  {DUMMY_PRODUCT.location}
                </span>
                <span className="px-3 py-1.5 bg-[#EEEEEE] rounded-full text-[#5C6060] text-xs font-semibold">
                  {DUMMY_PRODUCT.timePosted}
                </span>
              </div>

              {/* Admin Verified */}
              <div className="bg-[#B9EEAB]/30 p-4 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#3C6A35] flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[#2D5A27] font-bold text-sm">Admin Verified</span>
                  <span className="text-[#2D5A27]/80 text-xs">Produk ini telah diperiksa kesesuaian deskripsinya.</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button className="w-full h-12 bg-gradient-to-r from-[#5F5E5E] to-[#535252] text-[#FAF7F6] font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition">
                  <MessageCircle className="w-5 h-5 text-white" />
                  Hubungi via WhatsApp
                </button>
                <button className="w-full h-12 border border-gray-300 text-[#303334] font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                  <Heart className="w-5 h-5 text-[#303334]" />
                  Tambah ke Wishlist
                </button>
              </div>

              <p className="text-[#5C6060] text-xs text-center italic mt-2">
                Catatan: Transaksi dilakukan di luar sistem melalui WhatsApp. Harap berhati-hati dan lakukan COD di area kampus yang ramai.
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-[#F4F3F3] border border-gray-100 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                <img src={DUMMY_PRODUCT.seller.avatar} alt={DUMMY_PRODUCT.seller.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-[#303334] font-bold text-base">{DUMMY_PRODUCT.seller.name}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5C6060]" />
                  <span className="text-[#5C6060] text-xs">Akun Terverifikasi Mahasiswa</span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex flex-col">
                    <span className="text-[#5C6060] text-[10px] font-bold uppercase tracking-wider">Produk</span>
                    <span className="text-[#303334] text-sm font-bold">{DUMMY_PRODUCT.seller.productsCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#5C6060] text-[10px] font-bold uppercase tracking-wider">Rating</span>
                    <span className="text-[#303334] text-sm font-bold">{DUMMY_PRODUCT.seller.rating}/5</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#5C6060] flex-shrink-0" />
            </div>

          </div>
        </div>

        {/* Similar Recommendations Section */}
        <div className="mt-20 flex flex-col gap-8">
          <div className="flex items-end justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-[#303334] text-2xl font-bold mb-1">Rekomendasi Serupa</h2>
              <p className="text-[#5C6060] text-sm">Mungkin kamu juga membutuhkan ini untuk kuliah.</p>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center gap-1 text-[#5F5E5E] font-bold hover:text-black transition">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DUMMY_RECOMMENDATIONS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

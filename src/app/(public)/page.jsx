import React from "react";
import Link from "next/link";
import { Search, ChevronDown, Check, Heart, MessageCircle, Tag, ShieldCheck, Leaf, ArrowRight, User } from "lucide-react";
import ProductCard from "@/modules/catalog/components/ProductCard";

// Fallback kalau DB belum siap, kita pakai MOCK DATA
const DUMMY_PRODUCTS = [
  { id: "1", title: "Kalkulator Casio FX-991EX", price: 250000, condition: "LIKE NEW", category: { name: "Elektronik" }, image: "https://images.unsplash.com/photo-1574607383476-f517f220d398?q=80&w=500&auto=format&fit=crop", seller: { name: "Budi Santoso" } },
  { id: "2", title: "Biology Campbell 11th Ed", price: 450000, condition: "GOOD", category: { name: "Buku" }, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop", seller: { name: "Siti Aminah" } },
  { id: "3", title: "Ransel Kanvas Durable", price: 120000, condition: "USED", category: { name: "Fashion" }, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop", seller: { name: "Andi Wijaya" } },
  { id: "4", title: "Laptop Stand Aluminium", price: 85000, condition: "LIKE NEW", category: { name: "Aksesori" }, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=500&auto=format&fit=crop", seller: { name: "Rina Maria" } }
];

export default async function LandingPage() {
  // Dalam realita, uncomment bagian ini buat manggil DB:
  // const { getFeaturedProducts } = await import("@/modules/catalog/services");
  // const featuredResponse = await getFeaturedProducts(4);
  // const featuredProducts = featuredResponse.success && featuredResponse.data.length > 0 ? featuredResponse.data : DUMMY_PRODUCTS;
  
  const featuredProducts = DUMMY_PRODUCTS;

  return (
    <div className="flex flex-col bg-[#FBF9F9] w-full min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="w-full bg-[#F4F3F3] pt-16 pb-24 md:pt-24 md:pb-32 relative overflow-hidden flex justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none"></div>
        {/* Dekorasi Logo Eco Samar */}
        <div className="absolute right-0 top-10 md:top-20 opacity-5 transform rotate-12 pointer-events-none select-none">
           <span className="text-[200px] md:text-[300px] font-bold text-[#3C6A35] leading-none">eco</span>
        </div>

        <div className="max-w-7xl w-full px-6 md:px-8 lg:px-12 flex flex-col items-center xl:items-start xl:flex-row gap-12 z-10 relative">
          
          {/* Kiri: Teks & Form */}
          <div className="flex-1 flex flex-col gap-10 items-start">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-[#303334] leading-[1.1] tracking-tight">
                Pre-loved item <br/>
                berkualitas, harga <br/>
                <span className="text-[#3C6A35]">anak kampus.</span>
              </h1>
              <p className="text-[#5C6060] text-lg md:text-xl max-w-lg leading-relaxed">
                Khusus civitas IPB—cari barang layak pakai, simpan wishlist, lalu hubungi penjual via WhatsApp.
              </p>
            </div>

            <div className="w-full max-w-xl space-y-4">
              {/* Fake Search Bar UI */}
              <div className="bg-white p-2 rounded-2xl shadow-sm flex items-center border border-gray-100">
                <div className="pl-4 pr-3 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Cari buku, laptop, atau kursi kos..." 
                  className="flex-1 bg-transparent py-3 focus:outline-none text-[#303334] placeholder-gray-400"
                />
                <Link href="/catalog" className="px-6 py-3 bg-[#5F5E5E] hover:bg-[#4a4a4a] text-[#FAF7F6] font-bold rounded-xl transition">
                  Cari Barang
                </Link>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                {['Kategori', 'Harga', 'Kondisi'].map((tag, i) => (
                  <Link href="/catalog" key={i} className="px-4 py-2 bg-[#E1E3E3] hover:bg-[#d0d3d3] rounded-full flex items-center gap-2 text-sm font-medium text-[#303334] transition">
                    <span className="w-2 h-2 rounded-full bg-[#303334]"></span> {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Login Button */}
            <Link href="/login" className="px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center gap-3 hover:bg-gray-50 transition active:scale-95">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
              <span className="font-semibold text-[#303334]">Masuk dengan Google (IPB)</span>
            </Link>
          </div>

          {/* Kanan: Gambar Hero */}
          <div className="flex-1 w-full max-w-md xl:max-w-none relative rounded-[48px] overflow-hidden shadow-2xl shadow-gray-300 bg-gray-200 aspect-[4/5] xl:aspect-[3/4]">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop" 
              alt="Mahasiswa di Kampus" 
              className="w-full h-full object-cover"
            />
            {/* Green Campus Badge */}
            <div className="absolute bottom-8 left-8 bg-[#3C6A35]/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 border border-white/20">
              <Leaf className="w-5 h-5 text-[#EBFFE0]" />
              <span className="text-[#EBFFE0] font-bold text-sm tracking-wider uppercase">Green Campus Initiative</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUK TERBARU */}
      <section className="w-full py-20 md:py-24 flex justify-center bg-[#FBF9F9]">
        <div className="max-w-7xl w-full px-6 md:px-8 lg:px-12 flex flex-col gap-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-[#303334]">Produk Terbaru</h2>
              <p className="text-[#5C6060]">Update terkini dari sesama civitas IPB.</p>
            </div>
            <Link href="/catalog" className="text-[#5F5E5E] font-bold flex items-center gap-2 hover:underline">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid Produk */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 3. KATEGORI POPULER */}
      <section className="w-full py-20 md:py-24 bg-[#F4F3F3] flex justify-center">
        <div className="max-w-7xl w-full px-6 md:px-8 lg:px-12 flex flex-col gap-12">
          
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#303334]">Kategori Populer</h2>
            <p className="text-[#5C6060]">Temukan apa yang kamu butuhkan dengan cepat.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Elektronik", icon: "💻" },
              { name: "Fashion", icon: "👕" },
              { name: "Buku", icon: "📚" },
              { name: "Kos", icon: "🛏️" },
              { name: "Sehat", icon: "💊" },
              { name: "Aksesori", icon: "⌚" }
            ].map((cat, i) => (
              <Link href={`/catalog?category=${cat.name}`} key={i} className="bg-white py-10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:shadow-lg transition group">
                <span className="text-3xl grayscale opacity-80 group-hover:grayscale-0 transition">{cat.icon}</span>
                <span className="font-bold text-[#303334] text-xs tracking-widest uppercase">{cat.name}</span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 4. CARA KERJA / FITUR */}
      <section className="w-full py-20 md:py-24 bg-[#FBF9F9] flex justify-center">
        <div className="max-w-7xl w-full px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Heart, title: "Simpan Wishlist", desc: "Belum mau beli sekarang? Simpan dulu barang impianmu ke dalam wishlist." },
              { icon: MessageCircle, title: "Hubungi via WhatsApp", desc: "Tanya-tanya detail produk dan janjian COD langsung via chat WhatsApp." },
              { icon: Tag, title: "Jual Barang", desc: "Kos kepenuhan? Upload barangmu dalam hitungan menit dan temukan pembeli." },
              { icon: ShieldCheck, title: "Diverifikasi Admin", desc: "Setiap iklan akan direview oleh admin untuk menjaga kualitas komunitas." }
            ].map((ft, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-[#F4F3F3] rounded-2xl flex items-center justify-center mb-2">
                  <ft.icon className="w-8 h-8 text-[#5F5E5E]" />
                </div>
                <h3 className="text-lg font-bold text-[#303334]">{ft.title}</h3>
                <p className="text-sm text-[#5C6060] leading-relaxed max-w-xs">{ft.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MENGAPA IPB PRE LOVED */}
      <section className="w-full py-20 md:py-24 bg-[#303334] flex justify-center overflow-hidden">
        <div className="max-w-7xl w-full px-6 md:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-10">
            <h2 className="text-4xl font-bold text-[#FAF7F6]">Mengapa IPB Pre Loved?</h2>
            <div className="space-y-8">
              {[
                { title: "Khusus Civitas IPB", desc: "Lingkungan terpercaya karena pembeli dan penjual adalah rekan satu kampus." },
                { title: "Lebih Hemat", desc: "Dapatkan barang berkualitas dengan harga yang jauh lebih terjangkau." },
                { title: "Dukung Green Campus", desc: "Memperpanjang usia pakai barang membantu mengurangi limbah di kampus kita." },
                { title: "Tanpa Ribet Checkout", desc: "Cukup hubungi penjual, sepakati harga, dan ketemuan di lokasi kampus." }
              ].map((reason, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="mt-1">
                    <Check className="w-6 h-6 text-[#B9EEAB]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#FAF7F6] mb-2">{reason.title}</h3>
                    <p className="text-[#FAF7F6]/70 leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-md lg:max-w-none">
            <div className="absolute inset-0 bg-[#535252] rounded-full blur-[80px] opacity-30 transform -translate-y-10 translate-x-10"></div>
            <div className="relative rounded-[40px] overflow-hidden border-4 border-white/10 aspect-[4/5] bg-gray-800">
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop" 
                alt="Kampus IPB" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 6. CTA AYO MULAI SEKARANG */}
      <section className="w-full py-24 bg-[#FBF9F9] flex justify-center text-center">
        <div className="max-w-3xl px-6 flex flex-col items-center gap-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#303334]">Ayo Mulai Sekarang</h2>
          <p className="text-xl text-[#5C6060] leading-relaxed">
            Bergabunglah dengan ribuan mahasiswa IPB lainnya dalam menciptakan ekosistem kampus yang lebih berkelanjutan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link href="/login" className="px-10 py-4 bg-[#5F5E5E] text-[#FAF7F6] font-bold rounded-xl hover:bg-[#4a4a4a] transition shadow-lg shadow-gray-300">
              Masuk Sekarang
            </Link>
            <Link href="/catalog" className="px-10 py-4 bg-white border border-[#B0B2B3] text-[#303334] font-bold rounded-xl hover:bg-gray-50 transition">
              Jelajahi Produk
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

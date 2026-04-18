import { Search } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-[#f8fbf9] pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Pre-loved item <br />
            berkualitas, harga <br />
            <span className="text-green-700">anak kampus.</span>
          </h1>
          
          <p className="text-gray-600 max-w-md text-lg">
            Khusus civitas IPB—cari barang layak pakai, simpan wishlist, lalu hubungi penjual via WhatsApp.
          </p>

          {/* Setup Search */}
          <div className="bg-white p-2 rounded-full shadow-sm border flex items-center max-w-lg">
            <div className="pl-4 text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Cari barang (buku, alat praktikum, dsb)..." 
              className="flex-1 bg-transparent px-4 py-2 focus:outline-none"
            />
            <button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-full font-medium transition">
              Cari Sekarang
            </button>
          </div>

          {/* Quick Chips */}
          <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">Buku Tulis</span>
            <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">Kemeja</span>
            <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">Kalkulator</span>
          </div>

          <div className="pt-4">
             <button className="flex items-center gap-2 border px-6 py-3 rounded-lg hover:bg-gray-50 transition bg-white font-medium text-sm text-gray-700 shadow-sm">
                <div className="w-5 h-5 flex items-center justify-center bg-blue-500 rounded text-white text-xs font-bold">G</div>
                Masuk dengan Google (IPB)
             </button>
          </div>
        </div>

        {/* Right Image Container */}
        <div className="flex-1 bg-gradient-to-br from-[#528d6c] to-[#3f6d53] rounded-[2rem] overflow-hidden relative shadow-2xl h-[500px] w-full flex items-center justify-center">
            {/* Using a placeholder text for missing image */}
            <div className="text-white/80 font-medium text-lg">Laptop & Bag Image Placeholder</div>
            
            {/* Floating Badge */}
            <div className="absolute bottom-6 left-6 bg-green-800/80 backdrop-blur text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20">
              🌱 GREEN CAMPUS INITIATIVE
            </div>
        </div>
      </div>
    </section>
  );
}

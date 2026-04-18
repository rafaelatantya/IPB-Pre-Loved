import { CheckCircle } from 'lucide-react';

export default function WhyUsSection() {
  return (
    <section className="bg-[#2a302c] text-white py-24">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="flex-1 space-y-10">
          <h2 className="text-3xl font-bold">Mengapa IPB Pre Loved?</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="text-green-400 mt-1"><CheckCircle size={24} /></div>
              <div>
                <h4 className="font-bold text-lg">Khusus Civitas IPB</h4>
                <p className="text-gray-400 text-sm mt-1">Lingkungan terpercaya sesama pembeli dan penjual berstatus civitas kampus.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-green-400 mt-1"><CheckCircle size={24} /></div>
              <div>
                <h4 className="font-bold text-lg">Lebih Hemat</h4>
                <p className="text-gray-400 text-sm mt-1">Dapatkan barang bekas kualitas bagus dengan harga yang jauh dari harga baru.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-green-400 mt-1"><CheckCircle size={24} /></div>
              <div>
                <h4 className="font-bold text-lg">Dukung Green Campus</h4>
                <p className="text-gray-400 text-sm mt-1">Sirkulasi barang memperpanjang usia pakai dan mendukung pengolahan limbah.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-green-400 mt-1"><CheckCircle size={24} /></div>
              <div>
                <h4 className="font-bold text-lg">Tanpa Ribet Checkout</h4>
                <p className="text-gray-400 text-sm mt-1">Chat penjual langsung WhatsApp, tawar harga, janjian, lalu beres.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <div className="w-full aspect-square md:aspect-[4/3] bg-gray-800 rounded-3xl overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-xl">
               Image: Students Having Fun
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}

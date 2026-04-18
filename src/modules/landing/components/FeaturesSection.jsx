import { Bookmark, MessageCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-600">
              <Bookmark size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Simpan Wishlist</h3>
            <p className="text-xs text-gray-500">Belum mau beli sekarang? Simpan dulu barang impianmu ke dalam wishlist.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-600">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Hubungi via WhatsApp</h3>
            <p className="text-xs text-gray-500">Tanya-tanya soal kondisi, dan janjian COD! Langsung via WhatsApp.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-600">
              <RefreshCw size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Jual Barang</h3>
            <p className="text-xs text-gray-500">Gak butuh usus? Jual aja barang tak terpakaimu ke sesama member IPB.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-600">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Diverifikasi Admin</h3>
            <p className="text-xs text-gray-500">Setiap iklan akan direview oleh admin untuk menjaga kualitas komunitas.</p>
          </div>

        </div>
      </div>
    </section>
  );
}

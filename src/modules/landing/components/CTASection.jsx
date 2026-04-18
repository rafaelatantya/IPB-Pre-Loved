import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-[#f8fbf9] py-32 text-center flex flex-col items-center justify-center">
      <div className="max-w-2xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ayo Mulai Sekarang</h2>
        <p className="text-gray-600 mb-10 text-lg">
          Bergabunglah dengan ribuan mahasiswa IPB lainnya dalam menciptakan ekosistem kampus yang lebih berkelanjutan.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition">
            Masuk Sekarang
          </button>
          
          <Link href="/catalog">
            <button className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium transition w-full sm:w-auto">
              Jelajahi Produk
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailPage({ params }) {
  const { id } = params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
        <h2 className="text-2xl font-bold mb-4">Halaman Detail Produk</h2>
        <p className="text-gray-600 mb-6">Menampilkan detail untuk produk dengan ID: <span className="font-mono bg-gray-100 p-1 text-green-700">{id}</span></p>
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">
          Hubungi Penjual
        </button>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Daftar Keinginan (Wishlist)</h2>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
        <div className="text-4xl mb-4">💖</div>
        <p className="text-gray-500">Belum ada barang di wishlist kamu.</p>
        <p className="text-sm mt-2 text-gray-400">Silakan login dan cari barang yang kamu suka.</p>
      </div>
    </div>
  );
}

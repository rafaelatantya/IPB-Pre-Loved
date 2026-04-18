export default function FilterSidebar() {
  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">Filter</h3>
      
      {/* Kategori Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-sm text-gray-600">Kategori</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="rounded" /> Elektronik
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="rounded" /> Buku Cetak
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="rounded" /> Perlengkapan Lab
          </label>
        </div>
      </div>

      {/* Rentang Harga Filter */}
      <div>
        <h4 className="font-medium mb-3 text-sm text-gray-600">Harga</h4>
        <div className="space-y-3">
          <input 
            type="number" 
            placeholder="Min Harga" 
            className="w-full p-2 text-sm border rounded"
          />
          <input 
            type="number" 
            placeholder="Max Harga" 
            className="w-full p-2 text-sm border rounded"
          />
          <button className="w-full bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200">
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}

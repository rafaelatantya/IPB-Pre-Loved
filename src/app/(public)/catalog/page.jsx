import FilterSidebar from '@/modules/catalog/components/FilterSidebar';
import SearchBar from '@/modules/catalog/components/SearchBar';
import ProductCard from '@/modules/catalog/components/ProductCard';

// Using dummy products from previous setup
const dummyProducts = [
  { id: 1, title: 'Laptop MacBook', price: 15000000, condition: 'BEKAS' },
  { id: 2, title: 'Kalkulator Casio FX-991EX', price: 250000, condition: 'SEPERTI BARU' },
  { id: 3, title: 'Buku Campbell Biologi', price: 150000, condition: 'BEKAS' },
  { id: 4, title: 'Jas Laboratorium', price: 75000, condition: 'BEKAS' },
];

export default function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        <div className="flex-grow">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Semua Produk</h2>
            <div className="w-72">
              <SearchBar />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {dummyProducts.length > 0 ? (
              dummyProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>Maaf, barang ini ndak nemu...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

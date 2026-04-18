import ProductCard from '@/modules/catalog/components/ProductCard';
import Link from 'next/link';

// Dummy implementation matching the catalog's dummy
const dummyProducts = [
  { id: 1, title: 'Kalkulator Casio FX-991EX', price: 250000, condition: 'Baru' },
  { id: 2, title: 'Biologi Campbell Edisi 12', price: 450000, condition: 'Bekas' },
  { id: 3, title: 'Ransel Kanvas Cokelat', price: 120000, condition: 'Bekas' },
  { id: 4, title: 'Laptop Stand Aluminium', price: 85000, condition: 'Baru' },
];

export default function LatestProducts() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Produk Terbaru</h2>
            <p className="text-gray-500 text-sm">Update harian dari sesama civitas IPB</p>
          </div>
          <Link href="/catalog" className="text-green-700 text-sm font-semibold hover:underline">
            Lihat Semua &gt;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {dummyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

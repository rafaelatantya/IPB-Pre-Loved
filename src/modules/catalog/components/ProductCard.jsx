import Link from 'next/link';

export default function ProductCard({ product }) {
  // Convert price to IDR format
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <Link href={`/product/${product.id}`} className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Wishlist Button Overlay */}
      <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-400 hover:text-red-500 z-10 transition-colors">
        💖
      </button>

      {/* Product Image Placeholder */}
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Image {product.id}</span>
      </div>

      {/* Product Information */}
      <div className="p-4">
        <p className="text-xs font-semibold text-green-600 mb-1">{product.condition}</p>
        <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
        <p className="font-bold text-lg text-gray-900 mt-2">{formattedPrice}</p>
      </div>
    </Link>
  );
}

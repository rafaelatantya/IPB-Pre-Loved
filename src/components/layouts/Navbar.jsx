import Link from 'next/link';
import { Search, Heart, User } from 'lucide-react'; // Placeholder icons until installed

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Brand Name / Logo */}
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            IPB Pre-Loved
          </h1>
        </Link>
        
        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-green-700 text-gray-900 font-semibold border-b-2 border-gray-900 pb-1">Beranda</Link>
          <Link href="/catalog" className="hover:text-green-700">Catalog</Link>
          <Link href="/wishlist" className="hover:text-green-700">Wishlist</Link>
          <Link href="/panduan" className="hover:text-green-700">Panduan</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
           <button className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition">
            Masuk
           </button>
        </div>
      </div>
    </nav>
  );
}

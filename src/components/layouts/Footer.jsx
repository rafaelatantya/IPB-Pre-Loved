import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 pt-16 pb-8 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Info */}
        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-4">IPB Pre-Loved</h2>
          <p className="text-sm text-gray-500 mb-4 max-w-md">
            Marketplace khusus civitas IPB. Solusi cerdas untuk urusan 
            jual-beli barang, peralatan, dan kos dengan harga terbaik!
          </p>
          <p className="text-xs text-gray-400">© 2026 IPB Pre-Loved. Mendukung Ekosistem Kampus.</p>
        </div>
        
        {/* Navigasi Links */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Navigasi</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-green-600">Terbaru</Link></li>
            <li><Link href="/catalog" className="hover:text-green-600">Katalog</Link></li>
            <li><Link href="/panduan" className="hover:text-green-600">Panduan Beli</Link></li>
          </ul>
        </div>
        
        {/* Hubungi Kami Links */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Hubungi Kami</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-green-600">Saran</a></li>
            <li><a href="#" className="hover:text-green-600">Bantuan Laporkan</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

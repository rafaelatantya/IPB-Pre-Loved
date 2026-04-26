import React from "react";
import Link from "next/link";
import { Github, Mail, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm italic">IP</span>
              </div>
              <span className="text-lg font-black text-indigo-950 tracking-tighter">Pre-Loved</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Platform jual-beli barang bekas terpercaya khusus untuk civitas akademika IPB University. Aman, mudah, dan berkelanjutan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-indigo-950 mb-4">Navigasi</h4>
            <ul className="space-y-2">
              <li><Link href="/catalog" className="text-sm text-gray-500 hover:text-indigo-600 transition">Katalog Barang</Link></li>
              <li><Link href="/wishlist" className="text-sm text-gray-500 hover:text-indigo-600 transition">Wishlist</Link></li>
              <li><Link href="/login" className="text-sm text-gray-500 hover:text-indigo-600 transition">Daftar / Masuk</Link></li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="font-bold text-indigo-950 mb-4">Panduan</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-indigo-600 transition">Syarat & Ketentuan</Link></li>
              <li><Link href="/safety" className="text-sm text-gray-500 hover:text-indigo-600 transition">Tips Keamanan</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-indigo-600 transition">Tanya Jawab</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-bold text-indigo-950 mb-4">Hubungi Kami</h4>
            <div className="flex gap-4">
              {/* Sementara kita matiin icon yang bikin error */}
              <div className="text-xs text-gray-400 italic">Social media links coming soon</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
            &copy; 2026 KELOMPOK 5 R3 • DEPARTEMEN ILMU KOMPUTER IPB
          </p>
          <p className="text-[10px] text-gray-300 font-medium">
            Built with Next.js & Cloudflare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

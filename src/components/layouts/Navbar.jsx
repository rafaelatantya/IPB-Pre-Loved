import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full px-6 md:px-10 py-6 bg-white border-b border-[#C6C6C6] flex justify-between items-center fixed top-0 z-50">
        <Link href="/" className="flex flex-col justify-start items-start">
            <div className="justify-center flex flex-col text-black text-xl font-bold font-sans uppercase leading-7 break-words">IPB PRE LOVED</div>
        </Link>
        <div className="hidden md:flex justify-start items-start gap-8">
            <Link href="/" className="pb-1 border-b-2 border-black flex flex-col justify-start items-start">
                <div className="justify-center flex flex-col text-black text-xs font-medium font-sans uppercase leading-[18px] tracking-wide break-words">BERANDA</div>
            </Link>
            <Link href="/catalog" className="flex flex-col justify-start items-start">
                <div className="justify-center flex flex-col text-[#777777] text-xs font-medium font-sans uppercase leading-[18px] tracking-wide break-words hover:text-black transition-colors">KATEGORI</div>
            </Link>
            <Link href="/wishlist" className="flex flex-col justify-start items-start">
                <div className="justify-center flex flex-col text-[#777777] text-xs font-medium font-sans uppercase leading-[18px] tracking-wide break-words hover:text-black transition-colors">WISHLIST</div>
            </Link>
            <Link href="#" className="flex flex-col justify-start items-start">
                <div className="justify-center flex flex-col text-[#777777] text-xs font-medium font-sans uppercase leading-[18px] tracking-wide break-words hover:text-black transition-colors">PANDUAN</div>
            </Link>
        </div>
        <Link href="/login" className="px-6 py-2 bg-black flex flex-col justify-center items-center hover:bg-gray-800 transition-colors">
            <div className="text-center justify-center flex flex-col text-white text-xs font-bold font-sans uppercase leading-[18px] tracking-wider break-words">LOGIN</div>
        </Link>
    </div>
  );
}

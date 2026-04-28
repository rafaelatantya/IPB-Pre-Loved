"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return (
    <nav className="w-full px-6 md:px-10 py-4 md:py-6 bg-white border-b border-[#C6C6C6] flex justify-between items-center fixed top-0 z-50">
        <Link href="/" className="flex flex-col justify-start items-start">
            <div className="text-black text-xl font-bold font-sans uppercase leading-7 tracking-tight">IPB PRE LOVED</div>
        </Link>

        <div className="hidden md:flex justify-start items-start gap-8">
            <Link href="/" className="text-black text-xs font-medium font-sans uppercase tracking-wide hover:opacity-70 transition-opacity">BERANDA</Link>
            <Link href="/catalog" className="text-[#777777] text-xs font-medium font-sans uppercase tracking-wide hover:text-black transition-colors">KATEGORI</Link>
            <Link href="/wishlist" className="text-[#777777] text-xs font-medium font-sans uppercase tracking-wide hover:text-black transition-colors">WISHLIST</Link>
            <Link href="#" className="text-[#777777] text-xs font-medium font-sans uppercase tracking-wide hover:text-black transition-colors">PANDUAN</Link>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"></div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Dashboard Link */}
              <Link 
                href="/dashboard" 
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#2563EB] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                DASHBOARD
              </Link>

              {/* Profile Avatar */}
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center border border-gray-300 overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || "Profile"} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                {/* Dropdown Logout (Hover) */}
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-white border border-gray-200 shadow-xl rounded-xl p-2 min-w-[160px]">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Logged in as</p>
                      <p className="text-xs font-semibold text-gray-800 truncate">{session?.user?.name || "User"}</p>
                    </div>
                    <button 
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-600 text-xs font-bold hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      LOGOUT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="px-6 py-2.5 bg-black text-white text-xs font-bold font-sans uppercase tracking-wider hover:bg-gray-800 transition-colors">
              LOGIN
            </Link>
          )}
        </div>
    </nav>
  );
}

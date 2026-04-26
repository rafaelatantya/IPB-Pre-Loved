"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, User, LogIn, Menu, X, ChevronDown, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/auth/LogoutButton";

const Navbar = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 flex flex-col justify-center ${
        isScrolled
          ? "bg-[#FBF9F9]/90 backdrop-blur-md shadow-sm"
          : "bg-[#FBF9F9]/80 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex flex-col justify-start items-start">
          <span className="text-[#303334] text-xl font-bold font-sans">IPB Pre Loved</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center">
          <Link href="/" className="pb-1 border-b-2 border-[#5F5E5E]">
            <span className="text-[#303334] text-base font-bold font-sans">Beranda</span>
          </Link>
          <Link href="/catalog" className="ml-8 pb-1 border-b-2 border-transparent hover:border-gray-300 transition">
            <span className="text-[#5C6060] text-base font-bold font-sans hover:text-[#303334] transition">Katalog</span>
          </Link>
          <Link href="/wishlist" className="ml-8 pb-1 border-b-2 border-transparent hover:border-gray-300 transition">
            <span className="text-[#5C6060] text-base font-bold font-sans hover:text-[#303334] transition">Wishlist</span>
          </Link>
          <Link href="/panduan" className="ml-8 pb-1 border-b-2 border-transparent hover:border-gray-300 transition">
            <span className="text-[#5C6060] text-base font-bold font-sans hover:text-[#303334] transition">Panduan</span>
          </Link>
        </div>

        {/* Right Side (Auth / Profile) */}
        <div className="hidden md:flex items-center">
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pl-3 bg-white border border-gray-200 rounded-full hover:shadow-sm transition"
              >
                <div className="flex flex-col items-end -space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{session.user.role}</span>
                  <span className="text-xs font-bold text-[#303334]">{session.user.name.split(' ')[0]}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F4F3F3] flex items-center justify-center text-[#5C6060]">
                  <User className="w-4 h-4" />
                </div>
                <ChevronDown className={`w-3 h-3 text-[#5C6060] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Profile */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-xs font-bold text-gray-400 uppercase">Akun Saya</p>
                    <p className="text-sm font-bold text-[#303334] truncate">{session.user.email}</p>
                  </div>
                  <Link 
                    href="/admin-test" 
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#5C6060] hover:bg-[#F4F3F3] hover:text-[#303334] rounded-xl transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <div className="pt-1 mt-1 border-t border-gray-50">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-6 py-2 bg-[#5F5E5E] text-[#FAF7F6] text-base font-semibold rounded-xl hover:bg-[#4a4a4a] transition"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-[#303334]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="px-4 py-2 text-[#303334] font-bold">Beranda</Link>
            <Link href="/catalog" className="px-4 py-2 text-[#5C6060] font-bold">Katalog</Link>
            <Link href="/wishlist" className="px-4 py-2 text-[#5C6060] font-bold">Wishlist</Link>
            <Link href="/panduan" className="px-4 py-2 text-[#5C6060] font-bold">Panduan</Link>
            <div className="border-t border-gray-100 my-2"></div>
            {session ? (
               <div className="space-y-2">
                 <Link href="/admin-test" className="flex items-center gap-3 px-4 py-3 text-[#5C6060] hover:bg-[#F4F3F3] rounded-xl">
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                 </Link>
                 <div className="px-4">
                    <LogoutButton />
                 </div>
               </div>
            ) : (
              <Link href="/login" className="w-full py-3 bg-[#5F5E5E] text-white text-center font-bold rounded-xl">
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

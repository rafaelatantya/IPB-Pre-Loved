"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import { signIn } from "next-auth/react";
import { AlertTriangle, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="w-full h-screen bg-white flex flex-col md:flex-row font-sans overflow-hidden">
        
        {/* LEFT COLUMN - Image */}
        <div className="relative hidden md:flex md:w-1/2 lg:w-[40%] border-r border-[#C6C6C6] h-full overflow-hidden">
          {/* Background Image (Using user's 3D asset) */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/login_page/3D_Login_Page.png)' }}
          ></div>
          {/* Blue Overlay Effect */}
          <div className="absolute inset-0 bg-[#2563EB] mix-blend-multiply opacity-20 pointer-events-none"></div>
        </div>

        {/* RIGHT COLUMN - Content */}
        <div className="flex-1 md:w-1/2 lg:w-[60%] p-8 md:p-16 lg:p-24 bg-white flex flex-col h-full overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center items-center md:items-start w-full">
            <div className="w-full max-w-[448px] flex flex-col gap-4">
              
              {/* Logo */}
              <img 
                className="w-16 h-16 object-contain mb-4" 
                src="/common/Logo_IPB.png?v=2" 
                alt="IPB Logo"
              />

              {/* Heading */}
              <div className="pt-8">
                <h1 className="text-[40px] md:text-[48px] font-semibold text-black leading-tight tracking-tight">
                  Masuk ke IPB<br />Pre Loved
                </h1>
              </div>

              {/* Subheading */}
              <div className="pl-4 border-l-2 border-[#C6C6C6] my-4">
                <p className="text-[#5E5E5E] text-sm font-normal leading-relaxed">
                  Gunakan akun Google IPB Anda
                </p>
              </div>

              {/* Actions */}
              <div className="pt-8 pb-10 flex flex-col gap-2 w-full">
                <button
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-full h-14 bg-[#2563EB] border border-[#1E40AF] flex justify-center items-center gap-3 hover:bg-[#1d4ed8] transition-colors shadow-sm"
                >
                  <LogIn className="w-5 h-5 text-[#E2E2E2]" />
                  <span className="text-[#E2E2E2] text-base font-normal uppercase tracking-wide">
                    Masuk dengan @apps.ipb.ac.id
                  </span>
                </button>


                <div className="w-full flex justify-end pt-2">
                  <a href="#" className="text-[#0F172A] text-sm font-normal hover:underline">
                    Jual product?
                  </a>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="w-full p-4 bg-[#EF4444] border border-[#777777] flex items-start gap-3 shadow-md">
                  <AlertTriangle className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-xs font-semibold uppercase tracking-wider">
                      STATUS: UNAUTHORIZED
                    </h3>
                    <p className="text-white text-sm font-normal leading-snug">
                      {error === "AccessDenied"
                        ? "Akses ditolak. Email tidak dikenali dalam database kami."
                        : "Akses ditolak. Terjadi kesalahan saat login."}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Footer Area */}
          <div className="w-full mt-12 md:mt-auto pt-8 flex justify-between items-center border-t border-black">
            <span className="text-black text-xs font-normal">V.1.0.0</span>
            <span className="text-black text-xs font-normal tracking-widest uppercase">SECURE_AUTH</span>
          </div>
          
        </div>
      </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">Memuat...</div>}>
      <LoginContent />
    </Suspense>
  );
}

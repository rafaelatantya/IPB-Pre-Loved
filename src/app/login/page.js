"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import { signIn } from "next-auth/react";
import { AlertTriangle, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "AccessDenied") {
      alert("Silakan kontak admin, akun anda di-banned.\n\nProduk anda tidak dihapus namun di-archive.");
    }
  }, [error]);

  return (
    <div className="w-full h-screen bg-[#FAFAFA] md:bg-white flex flex-col md:flex-row font-poppins md:font-sans overflow-hidden">
        
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
        <div className="flex-1 md:w-1/2 lg:w-[60%] px-6 py-28 md:p-16 lg:p-24 bg-[#FAFAFA] md:bg-white flex flex-col h-full overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center items-start w-full">
            <div className="w-full max-w-[448px] flex flex-col gap-12 md:gap-4 mx-auto md:mx-0">
              
              {/* Logo */}
              <div className="w-20 h-20 md:w-16 md:h-16 relative overflow-hidden rounded-sm flex justify-center items-center">
                <img 
                  className="w-full h-full object-contain md:mb-4" 
                  src="/common/Logo_IPB.png?v=2" 
                  alt="IPB Logo"
                />
              </div>

              {/* Heading Section */}
              <div className="flex flex-col gap-4 w-full">
                {/* Heading */}
                <div className="w-full pt-0 md:pt-8">
                  <h1 className="text-[48px] md:text-[48px] font-semibold text-[#18181B] md:text-black leading-[57.6px] md:leading-tight tracking-normal md:tracking-tight uppercase md:normal-case font-poppins md:font-sans">
                    MASUK KE IPB<br />PRE LOVED
                  </h1>
                </div>

                {/* Subheading */}
                <div className="w-full pl-0 md:pl-4 border-l-0 md:border-l-2 border-transparent md:border-[#C6C6C6] my-0 md:my-4">
                  <p className="text-[#52525B] md:text-[#5E5E5E] text-[14px] font-normal leading-[16px] md:leading-relaxed font-poppins md:font-sans">
                    Platform khusus untuk civitas IPB. Pakai akun resmi IPB kamu untuk mulai berbelanja
                  </p>
                </div>
              </div>

              {/* Actions Section */}
              <div className="w-full flex flex-col justify-start items-start gap-6 pt-0 md:pt-8 md:pb-10">
                <div className="w-full flex flex-col justify-start items-start gap-2">
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="w-full px-6 py-5 md:h-14 bg-[#2563EB] md:border border-transparent md:border-[#1E40AF] rounded-sm md:rounded-none flex justify-center items-center gap-3 hover:bg-[#1d4ed8] transition-colors shadow-sm"
                  >
                    <LogIn className="w-5 h-5 text-[#E5E5E5] md:text-[#E2E2E2]" />
                    <span className="text-[#E5E5E5] md:text-[#E2E2E2] text-[16px] font-normal md:font-normal uppercase tracking-normal md:tracking-wide font-poppins md:font-sans">
                      MASUK DENGAN @apps.ipb.ac.id
                    </span>
                  </button>

                  <div className="w-full flex justify-end pt-0 md:pt-2">
                    <a href="#" className="text-[#020617] md:text-[#0F172A] text-[14px] font-normal hover:underline font-poppins md:font-sans text-center md:text-right">
                      Jual product?
                    </a>
                  </div>
                </div>

                {/* Error State */}
                {error && (
                  <div className="w-full p-4 bg-[#F4F4F5] md:bg-[#EF4444] border-l-4 border-[#B91C1C] md:border-l-0 md:border md:border-[#777777] rounded-sm md:rounded-none flex justify-start items-start gap-3 shadow-none md:shadow-md">
                    <AlertTriangle className="w-5 h-5 text-[#B91C1C] md:text-white shrink-0 mt-0" />
                    <div className="flex flex-col gap-1 items-start w-full">
                      <h3 className="text-[#020617] md:text-white text-[12px] font-semibold uppercase font-poppins md:font-sans leading-[16px] md:leading-normal md:tracking-wider">
                        STATUS: UNAUTHORIZED
                      </h3>
                      <p className="text-[#020617] md:text-white text-[14px] font-normal leading-[16px] md:leading-snug font-poppins md:font-sans">
                        {error === "AccessDenied"
                          ? "Email tidak dikenali dalam database kami."
                          : "Terjadi kesalahan saat login."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Footer Area */}
          <div className="hidden md:flex w-full mt-12 md:mt-auto pt-8 justify-between items-center border-t border-black">
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

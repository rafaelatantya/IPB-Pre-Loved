"use client";

import { signIn } from "next-auth/react";
import { AlertCircle, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-[#FBF9F9] flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDE: Image & Branding (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#1C1917] overflow-hidden flex-col justify-between p-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756ebafe1?q=80&w=1200&auto=format&fit=crop" 
            alt="IPB Campus"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/20 to-transparent"></div>
        </div>

        {/* Content Top */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight">
            IPB Pre Loved
          </h2>
          <p className="text-lg lg:text-xl text-white/90 font-light max-w-md leading-relaxed">
            Menghubungkan Civitas IPB untuk keberlanjutan ekonomi kampus yang lebih cerdas dan hijau.
          </p>
        </div>

        {/* Content Bottom: Badge */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-black text-[#B9EEAB] uppercase tracking-[0.2em] mb-1">
              GREEN CAMPUS INITIATIVE
            </p>
            <p className="text-sm text-white/70 italic leading-snug">
              Mendorong ekonomi sirkular di lingkungan kampus.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden">
        {/* Decorative Background for Mobile */}
        <div className="md:hidden absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F4F3F3] rounded-full opacity-40"></div>
          <div className="absolute top-[40%] -right-24 w-[400px] h-[600px] bg-[#F4F3F3] rounded-[120px] opacity-30 rotate-12"></div>
        </div>

        <div className="w-full max-w-[440px] relative z-10 flex flex-col gap-10">
          
          {/* Small Logo */}
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#5F5E5E] rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <span className="text-[#FBF9F9] font-black italic text-lg leading-none">IP</span>
            </div>
            <span className="text-xl font-bold text-[#303334] tracking-tight">IPB Pre Loved</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-[30px] font-black text-[#303334] leading-tight tracking-tight">
              Masuk ke IPB Pre Loved
            </h1>
            <p className="text-[16px] text-[#5C6060] leading-[1.6]">
              Gunakan akun Google IPB (<span className="text-[#303334] font-bold">@apps.ipb.ac.id</span>) untuk melanjutkan akses ke marketplace kampus.
            </p>
          </div>

          {/* Error Message Section (Alert Style from Design) */}
          {error && (
            <div className="bg-[#9E422C]/10 border-l-4 border-[#9E422C] p-4 rounded-r-lg flex gap-4 animate-in fade-in slide-in-from-left-2 duration-500">
              <div className="mt-1">
                <AlertCircle className="w-5 h-5 text-[#9E422C]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#742410]">Domain Verification Failed</h4>
                <p className="text-[12px] text-[#742410]/80 leading-relaxed">
                  {error === "AccessDenied" 
                    ? "Hanya akun dengan domain @apps.ipb.ac.id yang diizinkan untuk masuk. Mohon periksa kembali akun Google Anda."
                    : "Terjadi kesalahan saat masuk. Silakan coba lagi nanti."}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="group relative h-14 bg-[#5F5E5E] text-[#FAF7F6] font-bold rounded-xl flex items-center justify-center gap-4 shadow-xl hover:bg-[#4a4949] transition-all active:scale-[0.98]"
            >
              <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center group-hover:bg-white/20 transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <span className="text-[16px]">Masuk dengan Google (IPB)</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#3C6A35] rounded-full flex items-center justify-center">
                 <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
              <p className="text-[12px] text-[#5C6060] font-medium tracking-tight">
                Hanya untuk civitas IPB (@apps.ipb.ac.id)
              </p>
            </div>
          </div>

          {/* Onboarding Help */}
          <div className="pt-8 border-t border-[#B0B2B3]/30 flex flex-col gap-3">
            <p className="text-sm text-[#5C6060]">Belum punya akun IPB?</p>
            <button className="flex items-center gap-2 text-[#5F5E5E] font-bold hover:underline transition">
              Hubungi pihak kampus <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Footer Links */}
          <div className="mt-12 hidden md:flex flex-col gap-4">
            <div className="flex gap-8">
              <button className="text-[10px] font-bold text-[#5C6060]/60 uppercase tracking-[0.2em] hover:text-[#303334] transition">PRIVACY POLICY</button>
              <button className="text-[10px] font-bold text-[#5C6060]/60 uppercase tracking-[0.2em] hover:text-[#303334] transition">TERMS OF SERVICE</button>
            </div>
            <p className="text-[10px] text-[#5C6060]/60 uppercase tracking-[0.2em] font-bold">
              SECURITY ARCHITECTURE
            </p>
          </div>

          {/* Mobile Copyright */}
          <p className="md:hidden mt-8 text-[10px] text-[#B0B2B3] font-medium uppercase tracking-widest text-center">
            © 2024 ACADEMIC CURATOR IPB.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF9F9] flex items-center justify-center text-[#5C6060]">Memuat...</div>}>
      <LoginContent />
    </Suspense>
  );
}

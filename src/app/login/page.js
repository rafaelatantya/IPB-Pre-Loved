"use client";

import { signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 p-6">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="glass-card w-full max-w-md p-8 rounded-3xl flex flex-col items-center relative z-10">
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
          <LogIn className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 text-center">IPB Pre-Loved</h1>
        <p className="text-indigo-200 mb-6 text-center font-medium">Masuk untuk mulai jual beli barang antar mahasiswa IPB</p>

        {error && (
            <div className="w-full mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-200 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-red-100 font-bold text-sm">Login Gagal</h4>
                    <p className="text-red-200 text-xs mt-1">
                        {error === "AccessDenied" ? "Pastikan kamu menggunakan akun @apps.ipb.ac.id" : 
                         error === "Configuration" ? "Kesalahan konfigurasi server (Secret missing)" : 
                         "Terjadi kesalahan saat mencoba login."}
                    </p>
                </div>
            </div>
        )}

        <div className="w-full space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/admin-test" })}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-indigo-50 text-indigo-900 font-bold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-xl"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Lanjutkan dengan Akun Apps IPB
          </button>
        </div>

        <div className="mt-8 text-center">
            <p className="text-indigo-300 text-sm mb-4">
                Khusus untuk seluruh Civitas Akademika IPB University
            </p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-700/50 text-sm font-medium rounded-2xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Bersihkan Sesi / Keluar
          </button>
        </div>
      </div>

      <p className="mt-8 text-indigo-400/60 text-xs italic font-light tracking-widest uppercase">
        Platform Jual Beli Barang Bekas • Kelompok 5 R3
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}


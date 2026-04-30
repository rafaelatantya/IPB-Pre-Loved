"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Store, ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";
import { completeOnboarding } from "@/modules/auth/actions";

export const runtime = "edge";

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    role: "",
    whatsappNumber: "",
  });

  // Proteksi & Edge Case Check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    
    // Jika user sudah punya role (bukan ONBOARDING), jangan boleh di sini
    if (session?.user?.role && session.user.role !== "ONBOARDING") {
      if (session.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/catalog");
      }
    }
  }, [session, status, router]);

  const handleSelectRole = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await completeOnboarding(formData);
      
      if (result.success) {
        // Update session client-side agar role berubah tanpa relogin
        await update({
          ...session,
          user: {
            ...session?.user,
            role: formData.role
          }
        });
        
        // Redirect ke dashboard masing-masing
        if (formData.role === "SELLER") {
          router.push("/dashboard"); // Dashboard Seller
        } else {
          router.push("/catalog"); // Katalog Buyer
        }
      } else {
        setError(result.error || "Gagal menyimpan data.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-100 flex">
          <div className={`h-full bg-blue-600 transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
        </div>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Halo, {session?.user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500">
              Bantu kami menyesuaikan pengalaman Anda di IPB Pre-Loved.
            </p>
          </div>

          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Pembeli */}
              <button 
                onClick={() => handleSelectRole("BUYER")}
                className="group relative p-8 bg-white border-2 border-gray-100 rounded-2xl text-left hover:border-blue-600 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Saya Pembeli</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Ingin mencari barang bekas berkualitas untuk kebutuhan kuliah.
                </p>
                <div className="mt-6 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Pilih <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </button>

              {/* Card Penjual */}
              <button 
                onClick={() => handleSelectRole("SELLER")}
                className="group relative p-8 bg-white border-2 border-gray-100 rounded-2xl text-left hover:border-green-600 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Store className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Saya Penjual</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Ingin menjual barang yang sudah tidak terpakai ke sesama mahasiswa.
                </p>
                <div className="mt-6 flex items-center text-green-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Pilih <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-start gap-4">
                <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-blue-900 font-bold mb-1">Verifikasi WhatsApp</h4>
                  <p className="text-blue-700 text-sm">
                    Nomor ini akan digunakan pembeli/penjual untuk menghubungi Anda lewat chat.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nomor WhatsApp</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">+62</span>
                    <input 
                      type="text"
                      required
                      placeholder="81234567890"
                      className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/[^0-123456789]/g, '') })}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Gunakan nomor aktif yang terhubung dengan WhatsApp.</p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    Kembali
                  </button>
                  <button 
                    type="submit"
                    disabled={loading || formData.whatsappNumber.length < 9}
                    className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>Selesaikan <CheckCircle2 className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-sm">
        Dengan melanjutkan, Anda setuju dengan Syarat & Ketentuan IPB Pre-Loved.
      </p>
    </div>
  );
}

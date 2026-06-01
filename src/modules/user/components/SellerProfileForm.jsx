"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";
import { updateSellerProfile } from "@/modules/user/actions";

export default function SellerProfileForm({ initialData }) {
    const router = useRouter();
    const [name, setName] = useState(initialData?.name || "");
    const [whatsappNumber, setWhatsappNumber] = useState(initialData?.whatsappNumber || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Autocorrect WhatsApp number to international format
        let clean = whatsappNumber.replace(/[^0-9+]/g, "");
        let corrected = clean;
        if (clean.startsWith("0")) {
            corrected = "+62" + clean.substring(1);
        } else if (clean.startsWith("62")) {
            corrected = "+" + clean;
        } else if (clean.startsWith("+62")) {
            corrected = clean;
        } else if (clean.length > 0) {
            corrected = "+62" + clean;
        }

        // 2. Show confirmation window.confirm matching other onboarding flows
        const confirmBox = window.confirm(`Autocorrect: nomor yang akan tercatat: ${corrected}\n\nKlik OK untuk setuju, atau Cancel untuk ketik ulang.`);
        if (!confirmBox) return; // User membatalkan

        setIsSubmitting(true);
        setMessage("");
        setError("");

        try {
            // 3. Save corrected number to DB
            const res = await updateSellerProfile({ whatsappNumber: corrected });
            if (res.success) {
                setWhatsappNumber(corrected);
                setMessage("Perubahan Tersimpan. Informasi Anda telah berhasil diperbarui.");
                router.refresh();
            } else {
                setError(res.error || "Gagal menyimpan perubahan.");
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Manage your seller identity and crucial contact information. Ensure your WhatsApp number is accurate for buyer inquiries.
                </p>
            </div>

            {message && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-green-800">Perubahan Tersimpan</p>
                        <p className="text-xs text-green-700 mt-1">{message.split('. ')[1] || message}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-red-800">Gagal Disimpan</p>
                        <p className="text-xs text-red-700 mt-1">{error}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Side: Avatar */}
                <div className="md:w-64 flex-shrink-0 flex flex-col items-center">
                    <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden mb-4 border border-gray-200">
                        {initialData?.image ? (
                            <img src={initialData.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </div>
                    <h3 className="font-bold text-gray-900">Seller Identity</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Public Display</p>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Informasi Dasar</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-900 mb-1.5">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    readOnly // Readonly karena updateSellerProfile di actions belum ada fungsi update name
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-900 mb-1.5">Email Terdaftar</label>
                                <input
                                    type="email"
                                    value={initialData?.email || ""}
                                    readOnly
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">Kontak Aktif</h3>
                        <p className="text-xs text-gray-500 mb-4 border-b border-gray-100 pb-4">
                            Nomor ini akan dihubungi oleh pembeli melalui tombol WhatsApp pada halaman produk Anda.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-900 mb-1.5">Nomor Whatsapp</label>
                                <input
                                    type="text"
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value)}
                                    placeholder="08xxx"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <p className="text-[10px] text-gray-500 mt-2 font-medium">Gunakan format 08xxx</p>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                            Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

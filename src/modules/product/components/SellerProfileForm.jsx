"use client";

import React, { useState } from "react";
import { CheckCircle2, User, Save, XCircle } from "lucide-react";

export default function SellerProfileForm() {
    const [isSuccess, setIsSuccess] = useState(false); // Set default ke false agar alert muncul saat disave saja
    const [formData, setFormData] = useState({
        fullName: "Nama Kamu",
        email: "user@apps.ipb.ac.id",
        whatsapp: "08xxx",
    });

    // Fungsi untuk menangani perubahan ketikan di setiap input field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Fungsi untuk menangani ketika tombol Simpan ditekan
    const handleSubmit = (e) => {
        e.preventDefault(); // Mencegah reload halaman
        setIsSuccess(true);

        // Menghilangkan alert otomatis setelah 3 detik
        setTimeout(() => {
            setIsSuccess(false);
        }, 3000);
    };

    return (
        <div className="flex-1 min-h-screen bg-[#F9F9F9] p-6 md:p-12 flex flex-col gap-10" style={{ fontFamily: "Poppins, sans-serif" }}>

            {/* Header Title */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-[40px] font-semibold leading-[48px] text-black">Settings</h1>
                <p className="text-base font-medium text-[#474747] max-w-2xl leading-relaxed">
                    Manage your seller identity and crucial contact information. Ensure your WhatsApp number is accurate for buyer inquiries.
                </p>
            </div>

            {/* Success Alert Status */}
            {isSuccess && (
                <div className="w-full max-w-4xl p-4 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] rounded-lg border-l-4 border-[#16A34A] flex items-start gap-4 transition-all">
                    <CheckCircle2 className="w-6 h-6 text-[#16A34A] mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                        <span className="text-base font-medium text-[#16A34A]">Perubahan Tersimpan</span>
                        <span className="text-sm text-[#474747]">Informasi Anda telah berhasil diperbarui</span>
                    </div>
                </div>
            )}

            {/* Main Content Layout */}
            <div className="flex flex-col md:flex-row gap-16 items-start w-full max-w-4xl">

                {/* Public Display Identity Pic */}
                <div className="flex flex-col items-center gap-4 flex-shrink-0 w-full md:w-48">
                    <div className="w-48 h-48 bg-[#E8E8E8] shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-xl flex items-center justify-center border-8 border-white">
                        <User className="w-12 h-12 text-[#777777]" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-[#1A1C1C]">Seller Identity</h3>
                        <p className="text-xs font-medium text-[#777777] tracking-wider uppercase mt-1">Public Display</p>
                    </div>
                </div>

                <form className="flex-1 flex flex-col gap-8 w-full" onSubmit={handleSubmit}>

                    <div className="bg-white p-6 md:p-10 shadow-[0_4px_8px_rgba(0,0,0,0.12)] rounded-md flex flex-col gap-6 w-full">
                        <h2 className="text-xl font-semibold text-black pb-4 border-b border-[#E8E8E8]">Informasi Dasar</h2>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-sm font-semibold text-black">Nama Lengkap</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 bg-white border border-[#CBD5E1] rounded-lg text-base text-[#1A1C1C] focus:outline-none focus:border-[#2563EB] transition-colors"
                            />
                        </div>

                        {/* INPUT EMAIL TERDAFTAR (Hapus atribut 'disabled' jika ingin bisa diedit) */}
                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-sm font-semibold text-black">Email Terdaftar</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled // Kembalikan menjadi tanpa 'disabled' jika ingin bisa ditulis
                                className="w-full px-4 py-3.5 bg-gray-50 border border-[#CBD5E1] rounded-lg text-base text-[#64748B] cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Card 2: Kontak Aktif */}
                    <div className="bg-white p-6 md:p-10 shadow-[0_4px_8px_rgba(0,0,0,0.12)] rounded-md flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-semibold text-black">Kontak Aktif</h2>
                            <p className="text-sm font-medium text-[#474747] leading-relaxed">
                                Nomor ini akan dihubungi oleh pembeli melalui tombol WhatsApp pada halaman...
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 w-full pt-2">
                            <label className="text-sm font-semibold text-black">Nomor Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                placeholder="08xxx"
                                className="w-full px-4 py-3.5 bg-white border border-[#CBD5E1] rounded-lg text-base text-[#1A1C1C] focus:outline-none focus:border-[#2563EB] transition-colors"
                            />
                            <span className="text-xs text-[#64748B]">Gunakan format 08xxx</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-[#E8E8E8] mt-4">
                            <button
                                type="button"
                                className="h-11 px-[18px] border border-[#2563EB] text-[#2563EB] text-sm font-semibold rounded-md hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <XCircle className="w-4 h-4" />
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="h-11 px-[18px] bg-[#2563EB] text-white text-sm font-semibold rounded-md hover:bg-[#1d4ed8] transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Save className="w-4 h-4 text-[#F0FDF4]" />
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="h-12" />
        </div>
    );
}
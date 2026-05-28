"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, ImagePlus, ChevronDown, Save } from "lucide-react";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();

    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "Buku Kalkulus Purcel Edisi 9",
        category: "Buku Kuliah",
        condition: "Sangat Baik",
        price: "75000",
        description: "Buku peninggalan PPKU, masih mulus jarang dicoret-coret. Minus sedikit tertekuk di pojok kanan bawah. Alasan dijual karena sudah lulus matkul Kalkulus.",
    });

    const handleSave = (e) => {
        e.preventDefault();
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            router.push("/product");
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] p-6 md:p-12" style={{ fontFamily: "Poppins, sans-serif" }}>
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                {/* BREADCRUMB & TOMBOL KEMBALI */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="cursor-pointer hover:underline" onClick={() => router.push("/dashboard")}></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-800" />
                        </button>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Edit Product</h1>
                    </div>
                </div>

                {/* ALERT HATI-HATI (SUCCESS STATE) */}
                {isSuccess && (
                    <div className="w-full p-4 bg-white shadow-sm rounded-lg border-l-4 border-emerald-600 flex items-start gap-3 transition-all">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-emerald-600">Perubahan Tersimpan</span>
                            <span className="text-xs text-gray-600">Informasi Produk telah berhasil diperbarui untuk ID: {params.id}</span>
                        </div>
                    </div>
                )}

                {/* MAIN FORM CARD */}
                <form onSubmit={handleSave} className="w-full bg-white p-6 md:p-10 shadow-md rounded-md flex flex-col md:flex-row gap-10">

                    {/* SISI KIRI: MEDIA VISUAL */}
                    <div className="w-full md:w-1/4 flex flex-col gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Media Visual</h2>
                            <p className="text-xs text-gray-500">Unggah foto produk yang jelas.</p>
                        </div>

                        {/* Box Foto Utama */}
                        <div className="w-full aspect-square bg-gray-50 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                            <img src="https://placehold.co/300x300" alt="Preview" className="w-full h-full object-cover" />
                        </div>

                        {/* Thumbnail Baris Bawah */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="aspect-square bg-gray-200 rounded"></div>
                            <div className="aspect-square bg-gray-200 rounded"></div>
                            <button type="button" className="aspect-square bg-gray-50 rounded border border-dashed border-gray-400 flex flex-col items-center justify-center gap-1 hover:bg-gray-100 transition-colors">
                                <ImagePlus className="w-4 h-4 text-gray-600" />
                                <span className="text-[9px] font-bold text-gray-600 tracking-wide">TAMBAH</span>
                            </button>
                        </div>
                    </div>

                    {/* SISI KANAN: INPUT FIELD */}
                    <div className="flex-1 flex flex-col gap-6">

                        {/* Nama Produk */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-900">Nama Produk</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                                placeholder="Tuliskan Nama Produk"
                                required
                            />
                        </div>

                        {/* Kategori & Kondisi */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-900">Kategori</label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-gray-300 text-sm appearance-none focus:outline-none focus:border-blue-600"
                                    >
                                        <option value="Buku Kuliah">Buku Kuliah</option>
                                        <option value="Elektronik">Elektronik</option>
                                        <option value="Fashion">Fashion / Atribut IPB</option>
                                        <option value="Kost">Perlengkapan Kost</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-900">Kondisi</label>
                                <div className="relative">
                                    <select
                                        value={formData.condition}
                                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-gray-300 text-sm appearance-none focus:outline-none focus:border-blue-600"
                                    >
                                        <option value="Sangat Baik">Sangat Baik (Like New)</option>
                                        <option value="Baik">Baik (Layak Pakai)</option>
                                        <option value="Butuh Perbaikan">Butuh Perbaikan</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Harga */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-900">Harga (Rp)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-600"
                                placeholder="0"
                                required
                            />
                        </div>

                        {/* Deskripsi */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-900">Deskripsi Lengkap</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-600 resize-none"
                                placeholder="Jelaskan spesifikasi produk..."
                                required
                            />
                            <p className="text-xs text-gray-500">Pastikan deskripsi mencakup detail kerusakan jika ada untuk transparansi pembeli.</p>
                        </div>

                        {/* TOMBOL AKSI */}
                        <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="h-10 px-4 bg-white rounded-md border border-blue-600 text-blue-600 font-semibold text-xs hover:bg-blue-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="h-10 px-4 bg-blue-600 text-white rounded-md font-semibold text-xs hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                            >
                                <Save className="w-3.5 h-3.5" />
                                Simpan & Ajukan Validasi
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}
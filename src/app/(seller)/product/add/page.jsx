"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Plus, Send, Info } from "lucide-react";

const KATEGORI_OPTIONS = [
  "Buku Kuliah",
  "Pakaian",
  "Peralatan",
  "Elektronik",
  "Furnitur",
  "Alat Tulis",
  "Lainnya",
];

const KONDISI_OPTIONS = [
  "Baru",
  "Seperti Baru",
  "Baik",
  "Cukup",
  "Perlu Perbaikan",
];

export default function TambahProdukPage() {
  const router = useRouter();
  const mainImageRef = useRef(null);
  const extraImageRefs = [useRef(null), useRef(null), useRef(null)];

  const [form, setForm] = useState({
    namaBarang: "",
    kategori: "",
    kondisi: "",
    harga: "",
    deskripsi: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [extraImages, setExtraImages] = useState([null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleMainImage(e) {
    const file = e.target.files?.[0];
    if (file) setMainImage(URL.createObjectURL(file));
  }

  function handleExtraImage(index, e) {
    const file = e.target.files?.[0];
    if (file) {
      setExtraImages((prev) => {
        const updated = [...prev];
        updated[index] = URL.createObjectURL(file);
        return updated;
      });
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.namaBarang.trim()) newErrors.namaBarang = "Nama barang wajib diisi.";
    if (!form.kategori) newErrors.kategori = "Pilih kategori.";
    if (!form.kondisi) newErrors.kondisi = "Pilih kondisi.";
    if (!form.harga || Number(form.harga) <= 0) newErrors.harga = "Masukkan harga yang valid.";
    if (!form.deskripsi.trim()) newErrors.deskripsi = "Deskripsi wajib diisi.";
    return newErrors;
  }

  async function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    // TODO: kirim data ke API
    await new Promise((r) => setTimeout(r, 1000)); // simulasi loading
    setIsSubmitting(false);
    alert("Produk berhasil diajukan untuk validasi!");
    router.push("/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Formulir Produk</h1>
        <p className="text-sm text-gray-400 mt-1">
          Lengkapi detail barang pre-loved Anda untuk diajukan.
        </p>
      </div>

      {/* Card Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="flex gap-10">
          {/* ===== Kiri: Media Visual ===== */}
          <div className="w-[240px] flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Media Visual
            </h2>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Unggah foto produk yang jelas. Foto pertama akan menjadi sampul
              utama.
            </p>

            {/* Main Image */}
            <div
              onClick={() => mainImageRef.current?.click()}
              className="w-full h-[200px] border border-gray-200 rounded-lg bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mb-3 overflow-hidden"
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Foto utama"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <Upload className="w-7 h-7 text-gray-300 mb-2" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-300">
                    Foto Utama
                  </span>
                </>
              )}
            </div>
            <input
              ref={mainImageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleMainImage}
            />

            {/* Extra Images */}
            <div className="flex gap-2">
              {extraImageRefs.map((ref, i) => (
                <div
                  key={i}
                  onClick={() => ref.current?.click()}
                  className="flex-1 aspect-square border border-gray-200 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
                >
                  {extraImages[i] ? (
                    <img
                      src={extraImages[i]}
                      alt={`Foto ${i + 2}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              ))}
              {extraImageRefs.map((ref, i) => (
                <input
                  key={i}
                  ref={ref}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleExtraImage(i, e)}
                />
              ))}
            </div>
          </div>

          {/* Divider vertikal */}
          <div className="w-px bg-gray-100 self-stretch" />

          {/* ===== Kanan: Detail Informasi ===== */}
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Detail Informasi
            </h2>
            <div className="border-t border-gray-100 pt-5 flex flex-col gap-5">

              {/* Nama Barang */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Nama Barang
                </label>
                <input
                  type="text"
                  name="namaBarang"
                  value={form.namaBarang}
                  onChange={handleChange}
                  placeholder="Contoh: Buku Kalkulus Edisi 8"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-900 transition ${errors.namaBarang ? "border-red-300" : "border-gray-200"
                    }`}
                />
                {errors.namaBarang && (
                  <p className="text-xs text-red-500 mt-1">{errors.namaBarang}</p>
                )}
              </div>

              {/* Kategori + Kondisi */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Kategori
                  </label>
                  <select
                    name="kategori"
                    value={form.kategori}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-gray-900 transition appearance-none ${errors.kategori ? "border-red-300" : "border-gray-200"
                      } ${!form.kategori ? "text-gray-400" : ""}`}
                  >
                    <option value="" disabled>Pilih Kategori</option>
                    {KATEGORI_OPTIONS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                  {errors.kategori && (
                    <p className="text-xs text-red-500 mt-1">{errors.kategori}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Kondisi
                  </label>
                  <select
                    name="kondisi"
                    value={form.kondisi}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-gray-900 transition appearance-none ${errors.kondisi ? "border-red-300" : "border-gray-200"
                      } ${!form.kondisi ? "text-gray-400" : ""}`}
                  >
                    <option value="" disabled>Pilih Kondisi</option>
                    {KONDISI_OPTIONS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                  {errors.kondisi && (
                    <p className="text-xs text-red-500 mt-1">{errors.kondisi}</p>
                  )}
                </div>
              </div>

              {/* Harga */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  name="harga"
                  value={form.harga}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-900 transition ${errors.harga ? "border-red-300" : "border-gray-200"
                    }`}
                />
                {errors.harga && (
                  <p className="text-xs text-red-500 mt-1">{errors.harga}</p>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Deskripsi Lengkap
                </label>
                <textarea
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  placeholder="Jelaskan spesifikasi, tahun pembelian, dan alasan dijual..."
                  rows={5}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-900 transition resize-none ${errors.deskripsi ? "border-red-300" : "border-gray-200"
                    }`}
                />
                {errors.deskripsi && (
                  <p className="text-xs text-red-500 mt-1">{errors.deskripsi}</p>
                )}
                <p className="flex items-start gap-1.5 text-xs text-gray-400 mt-1.5">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  Pastikan deskripsi mencakup detail kerusakan jika ada untuk
                  transparansi pembeli.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-100 mt-8 pt-6 flex justify-end gap-3">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Mengirim..." : "Simpan & Ajukan Validasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
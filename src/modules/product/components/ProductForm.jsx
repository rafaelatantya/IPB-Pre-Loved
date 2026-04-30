"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/modules/category/actions";
import { createProduct } from "@/modules/product/actions";
import ImageUploader from "./ImageUploader";
import { Package, Tag, Wallet, MapPin, AlertCircle, Loader2 } from "lucide-react";

export default function ProductForm() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    categoryId: "",
    condition: "GOOD",
    description: "",
    location: "IPB Dramaga"
  });

  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories();
      if (result.success) setCategories(result.data);
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validasi dasar client-side untuk media (syarat di validation.js)
    if (imageUrls.length < 1) {
      setError("Minimal unggah 1 foto produk!");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await createProduct({
        formData,
        imageUrls
      });

      if (res.success) {
        router.push("/dashboard?message=Produk berhasil ditambahkan");
      } else {
        setError(res.error || "Gagal menyimpan produk.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Media Upload Section */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-500" />
          Foto Produk
        </h3>
        <ImageUploader onImagesChange={setImageUrls} maxImages={5} />
      </section>

      {/* Details Section */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-500" />
          Informasi Barang
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Nama Barang</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Jaket IPB Ukuran L"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
            <select 
              required
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none appearance-none"
            >
              <option value="">Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
              <Wallet className="w-3 h-3" /> Harga (Rp)
            </label>
            <input 
              required
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="150000"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Kondisi</label>
            <div className="grid grid-cols-2 gap-2">
              {["NEW", "LIKE_NEW", "GOOD", "FAIR"].map(cond => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, condition: cond }))}
                  className={`py-2 text-[10px] font-black uppercase tracking-tighter rounded-lg border transition-all ${
                    formData.condition === cond 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {cond.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Barang</label>
          <textarea 
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Jelaskan kondisi detail, alasan jual, atau minus barang..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Lokasi COD
          </label>
          <input 
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Contoh: Kantin Stevia / Asrama Putra"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
          />
        </div>
      </section>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 md:left-[260px] right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-30">
        <div className="max-w-6xl mx-auto flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-10 py-4 bg-black text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sedang Menyimpan...
              </>
            ) : (
              "Posting Barang Sekarang"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

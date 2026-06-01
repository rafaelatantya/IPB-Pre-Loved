"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Plus, Send, Info, X, Video } from "lucide-react";
import { createProduct } from "@/modules/product/actions";
import { productSchema } from "@/lib/validation";

const KONDISI_OPTIONS = [
  { label: "Baru", value: "NEW" },
  { label: "Seperti Baru", value: "LIKE_NEW" },
  { label: "Baik", value: "GOOD" },
  { label: "Cukup", value: "FAIR" },
];

export default function ProductAddForm({ categories = [] }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    condition: "",
    price: "",
    description: "",
    location: "IPB Dramaga",
  });

  const [images, setImages] = useState([]); // Array of File objects
  const [video, setVideo] = useState(null); // File object
  const [videoDuration, setVideoDuration] = useState(0);
  const [previews, setPreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert("Maksimal 5 foto.");
      return;
    }

    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    if (errors.media) setErrors(prev => ({ ...prev, media: "" }));
  }

  function handleVideoChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit for MVP
        alert("Video maksimal 20MB.");
        return;
      }
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));

      // Get duration
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => {
        setVideoDuration(Math.floor(vid.duration));
      };
      vid.src = URL.createObjectURL(file);
      if (errors.media) setErrors(prev => ({ ...prev, media: "" }));
    }
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }

  function removeVideo() {
    setVideo(null);
    setVideoPreview(null);
    setVideoDuration(0);
  }

  function validate() {
    const result = productSchema.safeParse({
      title: form.title,
      description: form.description,
      price: form.price,
      categoryId: form.categoryId,
      condition: form.condition,
      location: form.location,
      imageCount: images.length,
      hasVideo: !!video,
      videoDuration: videoDuration,
    });

    if (result.success) return {};

    const newErrors = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path[0];
      if (path === "imageCount") {
        newErrors.media = issue.message;
      } else {
        newErrors[path] = issue.message;
      }
    });

    return newErrors;
  }

  async function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.media) alert(newErrors.media);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload Images (One by one as required by API)
      const uploadedImageUrls = [];
      for (const img of images) {
        const imgFormData = new FormData();
        imgFormData.append("file", img);
        imgFormData.append("type", "image");

        const imgRes = await fetch("/api/upload", {
          method: "POST",
          body: imgFormData
        });
        const imgData = await imgRes.json();
        if (!imgData.success) throw new Error(imgData.error || "Gagal upload gambar");
        uploadedImageUrls.push(imgData.url);
      }

      // 2. Upload Video (if any)
      let uploadedVideoUrl = "";
      if (video) {
        const vidFormData = new FormData();
        vidFormData.append("file", video);
        vidFormData.append("type", "video");

        const vidRes = await fetch("/api/upload", {
          method: "POST",
          body: vidFormData
        });
        const vidData = await vidRes.json();
        if (!vidData.success) throw new Error(vidData.error || "Gagal upload video");
        uploadedVideoUrl = vidData.url;
      }

      // 3. Create Product in DB
      const res = await createProduct({
        formData: form,
        imageUrls: uploadedImageUrls,
        videoUrl: uploadedVideoUrl,
        videoDuration: videoDuration
      });

      if (res.success) {
        alert("Berhasil! Barang Anda sedang menunggu validasi Admin.");
        router.push("/dashboard");
      } else {
        if (res.errors) {
          setErrors(prev => ({ ...prev, ...res.errors }));
        }
        throw new Error(res.error || "Gagal menyimpan produk");
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Formulir Produk</h1>
        <p className="text-sm text-gray-500 mt-2">
          Lengkapi detail barang pre-loved Anda untuk diajukan.
        </p>
      </div>

      {/* Card Form */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ===== Kiri: Media Visual ===== */}
          <div className="lg:w-[300px] flex-shrink-0">
            <h2 className="text-sm font-bold text-gray-900 mb-2">
              Media Visual
            </h2>
            <p className="text-xs text-gray-500 mb-6">Unggah foto produk yang jelas.</p>

            {/* Main Image Box / FOTO UTAMA */}
            <div className="w-full aspect-square rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex flex-col items-center justify-center mb-4 relative">
              {previews[0] ? (
                <div className="relative w-full h-full group">
                  <img src={previews[0]} className="w-full h-full object-cover" alt="Foto Utama" />
                  <button
                    onClick={() => removeImage(0)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 text-white text-[10px] font-bold uppercase rounded-lg tracking-wider">
                    Foto Utama
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <svg className="w-12 h-12 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Foto Utama</span>
                </div>
              )}
            </div>

            {/* Thumbnail Previews Row + Add Button */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Other previews starting from index 1 */}
              {previews.slice(1).map((src, idx) => {
                const actualIndex = idx + 1;
                return (
                  <div key={actualIndex} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={src} className="w-full h-full object-cover" alt="preview" />
                    <button
                      onClick={() => removeImage(actualIndex)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {/* Pad remaining slots with placeholders up to 2 items if previews is short */}
              {Array.from({ length: Math.max(0, 2 - previews.slice(1).length) }).map((_, i) => (
                <div key={`placeholder-${i}`} className="aspect-square bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-gray-300">
                  <Plus className="w-4 h-4" />
                </div>
              ))}

              {/* Add image button */}
              {images.length < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 transition-all text-gray-400 hover:text-blue-500 hover:border-blue-200 bg-white"
                >
                  <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-[8px] font-bold uppercase tracking-wider">Tambah</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />

            {/* Video Upload Area */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 mb-3">Video Produk (Opsional)</h3>
              {videoPreview ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-black group">
                  <video src={videoPreview} className="w-full h-full object-contain" />
                  <button
                    onClick={removeVideo}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] font-bold rounded">
                    {videoDuration}s
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 transition-all text-gray-400 hover:text-blue-500 hover:border-blue-200 bg-white"
                >
                  <Video className="w-6 h-6 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Tambah Video</span>
                </button>
              )}
              <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
            </div>
            {errors.media && <p className="text-xs text-red-500 font-medium mt-2">{errors.media}</p>}
          </div>

          {/* ===== Kanan: Detail Informasi ===== */}
          <div className="flex-1">
            <div className="flex flex-col gap-5">
              {/* Nama Barang */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-900">Nama Produk</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Tuliskan Namanya"
                  className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.title ? "border-red-300" : ""}`}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
              </div>

              {/* Kategori + Kondisi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-900">Kategori</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none ${errors.categoryId ? "border-red-300" : ""}`}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-900">Kondisi</label>
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none ${errors.condition ? "border-red-300" : ""}`}
                  >
                    <option value="">Pilih Kondisi</option>
                    {KONDISI_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Harga */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-900">Harga (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">Rp</span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.price ? "border-red-300" : ""}`}
                  />
                </div>
                {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
              </div>

              {/* Lokasi COD */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-900">Lokasi Pengambilan / COD</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Contoh: GWW, Kantin Sapta, atau Parkiran Green"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Deskripsi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-900">Deskripsi Lengkap</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Jelaskan spesifikasi, tahun pembelian, dan alasan dijual..."
                  rows={4}
                  className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${errors.description ? "border-red-300" : ""}`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pastikan deskripsi mencakup detail kerusakan jika ada untuk transparansi pembeli.
                </p>
                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                Simpan & Ajukan Validasi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

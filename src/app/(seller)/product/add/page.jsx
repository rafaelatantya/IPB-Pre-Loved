"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Plus, Send, Info, X, Video } from "lucide-react";
import { getCategories } from "@/modules/category/actions";
import { createProduct } from "@/modules/product/actions";

const KONDISI_OPTIONS = [
  { label: "Baru", value: "NEW" },
  { label: "Seperti Baru", value: "LIKE_NEW" },
  { label: "Baik", value: "GOOD" },
  { label: "Cukup", value: "FAIR" },
];

export default function TambahProdukPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
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

  useEffect(() => {
    async function loadCategories() {
      const res = await getCategories();
      if (res.success) setCategories(res.data);
    }
    loadCategories();
  }, []);

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
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Nama barang wajib diisi.";
    if (!form.categoryId) newErrors.categoryId = "Pilih kategori.";
    if (!form.condition) newErrors.condition = "Pilih kondisi.";
    if (!form.price || Number(form.price) < 500) newErrors.price = "Minimal Rp 500.";
    if (!form.description.trim()) newErrors.description = "Deskripsi wajib diisi.";
    
    // Check constraints: 3 images OR (1 image + 1 video >= 5s)
    const hasEnoughImages = images.length >= 3;
    const hasEnoughMedia = images.length >= 1 && video && videoDuration >= 5;
    
    if (!hasEnoughImages && !hasEnoughMedia) {
      newErrors.media = "Syarat media tidak terpenuhi: Minimal 3 Foto ATAU 1 Foto + 1 Video (min 5 detik)";
    }
    
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
      // 1. Upload Images
      const imgFormData = new FormData();
      images.forEach(img => imgFormData.append("files", img));
      
      const imgRes = await fetch("/api/media/upload", {
        method: "POST",
        body: imgFormData
      });
      const imgData = await imgRes.json();
      if (!imgData.success) throw new Error(imgData.error);

      // 2. Upload Video (if any)
      let uploadedVideoUrl = "";
      if (video) {
        const vidFormData = new FormData();
        vidFormData.append("files", video);
        const vidRes = await fetch("/api/media/upload", {
          method: "POST",
          body: vidFormData
        });
        const vidData = await vidRes.json();
        if (!vidData.success) throw new Error(vidData.error);
        uploadedVideoUrl = vidData.urls[0];
      }

      // 3. Create Product in DB
      const res = await createProduct({
        formData: form,
        imageUrls: imgData.urls,
        videoUrl: uploadedVideoUrl,
        videoDuration: videoDuration
      });

      if (res.success) {
        alert("Berhasil! Barang Anda sedang menunggu validasi Admin.");
        router.push("/dashboard");
      } else {
        throw new Error(res.error || "Gagal menyimpan produk");
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 uppercase italic tracking-tight">Pasang Iklan</h1>
        <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest font-semibold italic">
          Upload barang pre-loved kamu untuk civitas IPB.
        </p>
      </div>

      {/* Card Form */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* ===== Kiri: Media Visual ===== */}
          <div className="lg:w-[300px] flex-shrink-0">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">
              Media Visual
            </h2>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-6">
              <p className="text-[10px] text-blue-600 font-bold uppercase leading-relaxed">
                Syarat: Minimal 3 Foto <br/> atau 1 Foto + 1 Video (min 5s)
              </p>
            </div>

            {/* Photo Upload Area */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={src} className="w-full h-full object-cover" alt="preview" />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all text-gray-300 hover:text-blue-500 hover:border-blue-200"
                >
                  <Plus className="w-6 h-6" />
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />

            {/* Video Upload Area */}
            <div className="mt-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Video Produk (Opsional)</h3>
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
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 transition-all text-gray-300 hover:text-blue-500 hover:border-blue-200"
                >
                  <Video className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Tambah Video</span>
                </button>
              )}
              <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
            </div>
            {errors.media && <p className="text-[10px] text-red-500 font-bold uppercase mt-2">{errors.media}</p>}
          </div>

          {/* ===== Kanan: Detail Informasi ===== */}
          <div className="flex-1">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
              Informasi Barang
            </h2>
            
            <div className="flex flex-col gap-6">
              {/* Nama Barang */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Judul Iklan</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Contoh: Sepeda Polygon Stratos S3"
                  className={`w-full bg-[#F8FAFC] border-2 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-blue-600 transition-all ${errors.title ? "border-red-300" : "border-transparent"}`}
                />
                {errors.title && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.title}</p>}
              </div>

              {/* Kategori + Kondisi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Kategori</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className={`w-full bg-[#F8FAFC] border-2 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-blue-600 appearance-none transition-all ${errors.categoryId ? "border-red-300" : "border-transparent"}`}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Kondisi</label>
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    className={`w-full bg-[#F8FAFC] border-2 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-blue-600 appearance-none transition-all ${errors.condition ? "border-red-300" : "border-transparent"}`}
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Harga (Rp)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full bg-[#F8FAFC] border-2 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold outline-none focus:border-blue-600 transition-all ${errors.price ? "border-red-300" : "border-transparent"}`}
                  />
                </div>
                {errors.price && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.price}</p>}
              </div>

              {/* Lokasi COD */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Lokasi Pengambilan / COD</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Contoh: GWW, Kantin Sapta, atau Parkiran Green"
                  className="w-full bg-[#F8FAFC] border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                />
              </div>

              {/* Deskripsi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Deskripsi Barang</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Ceritakan detail barang, minusnya, atau alasan dijual..."
                  rows={5}
                  className={`w-full bg-[#F8FAFC] border-2 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-blue-600 transition-all resize-none ${errors.description ? "border-red-300" : "border-transparent"}`}
                />
                <div className="flex items-start gap-2 mt-1 px-1 text-blue-500">
                  <Info className="w-3 h-3 mt-0.5" />
                  <p className="text-[9px] font-bold uppercase leading-tight italic">
                    Tips: Deskripsi yang jujur bikin barang cepet laku!
                  </p>
                </div>
                {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.description}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-[2px] text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:scale-95 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sedang Memproses...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Pasang Iklan Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
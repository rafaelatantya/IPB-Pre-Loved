"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, Info, X, Video, Check, AlertCircle } from "lucide-react";
import { updateProduct } from "@/modules/product/actions";

const KONDISI_OPTIONS = [
  { label: "Baru", value: "NEW" },
  { label: "Seperti Baru", value: "LIKE_NEW" },
  { label: "Baik", value: "GOOD" },
  { label: "Cukup", value: "FAIR" },
];

export default function ProductEditForm({ product, categories = [] }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [form, setForm] = useState({
    title: product.title || "",
    categoryId: product.categoryId || "",
    condition: product.condition || "GOOD",
    price: product.price || "",
    description: product.description || "",
    location: product.location || "IPB Dramaga",
    status: product.status || "PENDING",
  });

  // existingImages: url strings dari backend
  const [existingImages, setExistingImages] = useState(
      (product.images || []).map(img => img.url).filter(Boolean)
  );
  const [newImages, setNewImages] = useState([]); // File objects
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // Video state
  const [existingVideo, setExistingVideo] = useState(product.videoUrl || null);
  const [newVideo, setNewVideo] = useState(null); // File object
  const [videoPreview, setVideoPreview] = useState(product.videoUrl || null);
  const [videoDuration, setVideoDuration] = useState(product.videoDuration || 0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    if (existingImages.length + newImages.length + files.length > 5) {
      alert("Maksimal 5 foto.");
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
    if (errors.media) setErrors(prev => ({ ...prev, media: "" }));
  }

  function handleVideoChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("Video maksimal 20MB.");
        return;
      }
      setNewVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => {
        setVideoDuration(Math.floor(vid.duration));
      };
      vid.src = URL.createObjectURL(file);
      if (errors.media) setErrors(prev => ({ ...prev, media: "" }));
    }
  }

  function removeExistingImage(index) {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  }

  function removeNewImage(index) {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  function removeVideo() {
    setExistingVideo(""); // Set to empty string to signal deletion to backend
    setNewVideo(null);
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
    else if (form.description.trim().length < 10) newErrors.description = "Deskripsi minimal 10 karakter.";
    
    const totalImages = existingImages.length + newImages.length;
    const hasEnoughImages = totalImages >= 3;
    const hasVideo = !!videoPreview;
    const hasEnoughMedia = totalImages >= 1 && hasVideo && videoDuration >= 5;
    
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
    setMessage("");
    try {
      // 1. Upload new images if any
      const uploadedImageUrls = [];
      for (const img of newImages) {
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

      // Combine existing images with newly uploaded ones
      const finalImageUrls = [...existingImages, ...uploadedImageUrls];

      // 2. Upload new video if any
      let finalVideoUrl = existingVideo;
      if (newVideo) {
        const vidFormData = new FormData();
        vidFormData.append("file", newVideo);
        vidFormData.append("type", "video");

        const vidRes = await fetch("/api/upload", {
          method: "POST",
          body: vidFormData
        });
        const vidData = await vidRes.json();
        if (!vidData.success) throw new Error(vidData.error || "Gagal upload video");
        finalVideoUrl = vidData.url;
      }

      // 3. Update Product in DB
      const res = await updateProduct(product.id, {
        formData: form,
        imageUrls: finalImageUrls,
        videoUrl: finalVideoUrl,
        videoDuration: videoDuration
      });

      if (res.success) {
        setMessage("Informasi Produk telah berhasil diperbarui");
        // Update states to clear new files since they are now existing
        setExistingImages(finalImageUrls);
        setNewImages([]);
        setNewImagePreviews([]);
        if (newVideo) {
          setExistingVideo(finalVideoUrl);
          setNewVideo(null);
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (res.errors) {
          setErrors(prev => ({ ...prev, ...res.errors }));
        }
        throw new Error(res.error || "Gagal memperbarui produk");
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
            <button onClick={() => router.push('/dashboard')} className="hover:text-gray-900 transition-colors">Dashboard</button>
            <span>›</span>
            <span className="text-gray-900">Edit Product</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
      </div>

      {message && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
            <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
                <p className="text-sm font-bold text-green-800">Perubahan Tersimpan</p>
                <p className="text-xs text-green-700 mt-1">{message}</p>
            </div>
        </div>
      )}

      {/* Card Form */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* ===== Kiri: Media Visual ===== */}
          <div className="lg:w-[300px] flex-shrink-0">
            <h2 className="text-sm font-bold text-gray-900 mb-2">
              Media Visual
            </h2>
            <p className="text-xs text-gray-500 mb-6">Unggah foto produk yang jelas.</p>

            {/* Photo Upload Area */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Existing Images */}
              {existingImages.map((src, i) => (
                <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={src} className="w-full h-full object-cover" alt="preview" />
                  <button 
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {/* New Images */}
              {newImagePreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={src} className="w-full h-full object-cover" alt="preview" />
                  <button 
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {/* Add Button */}
              {existingImages.length + newImages.length < 5 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 transition-all text-gray-400 hover:text-blue-500 hover:border-blue-200 bg-gray-50/50"
                >
                  <span className="text-2xl font-light mb-1">+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Tambah</span>
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
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 transition-all text-gray-400 hover:text-blue-500 hover:border-blue-200 bg-gray-50/50"
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

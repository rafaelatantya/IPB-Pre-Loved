"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { uploadWithProgress } from "@/lib/upload";

export default function ImageUploader({ onImagesChange, maxImages = 5 }) {
  const [files, setFiles] = useState([]); // { file, preview, progress, url, status: 'idle' | 'uploading' | 'success' | 'error' }
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    // Filter only images
    const validImages = selectedFiles.filter(file => file.type.startsWith("image/"));
    
    const newFiles = validImages.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      url: "",
      status: "idle"
    })).slice(0, maxImages - files.length);

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    
    // Auto start upload for each new file
    newFiles.forEach(fileObj => uploadFile(fileObj, updatedFiles));
  };

  const uploadFile = async (fileObj, currentFiles) => {
    setFiles(prev => prev.map(f => f.preview === fileObj.preview ? { ...f, status: "uploading" } : f));

    try {
      const result = await uploadWithProgress(fileObj.file, "image", (percent) => {
        setFiles(prev => prev.map(f => f.preview === fileObj.preview ? { ...f, progress: percent } : f));
      });

      setFiles(prev => {
        const next = prev.map(f => f.preview === fileObj.preview ? { ...f, status: "success", url: result.url } : f);
        onImagesChange(next.filter(f => f.status === "success").map(f => f.url));
        return next;
      });
    } catch (error) {
      console.error("Upload error:", error);
      setFiles(prev => prev.map(f => f.preview === fileObj.preview ? { ...f, status: "error" } : f));
    }
  };

  const removeFile = (preview) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.preview !== preview);
      onImagesChange(filtered.filter(f => f.status === "success").map(f => f.url));
      return filtered;
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {files.map((file, index) => (
          <div key={index} className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden group bg-gray-50">
            <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
            
            {/* Overlay for uploading */}
            {file.status === "uploading" && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <span className="text-[10px] font-bold">{file.progress}%</span>
              </div>
            )}

            {/* Success checkmark */}
            {file.status === "success" && (
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-0.5 shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Error indicator */}
            {file.status === "error" && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                <span className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Gagal</span>
              </div>
            )}

            {/* Remove button */}
            <button 
              onClick={() => removeFile(file.preview)}
              className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-gray-500 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {files.length < maxImages && (
          <button 
            onClick={() => fileInputRef.current.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-black hover:text-black hover:bg-gray-50 transition-all"
          >
            <div className="p-2 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                <Upload className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Tambah Foto</span>
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        multiple 
        accept="image/*" 
        className="hidden" 
      />

      <div className="flex items-center gap-2 text-[10px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <ImageIcon className="w-4 h-4 text-blue-500" />
        <p>Gunakan foto yang jelas dengan pencahayaan cukup. Maksimal {maxImages} foto.</p>
      </div>
    </div>
  );
}

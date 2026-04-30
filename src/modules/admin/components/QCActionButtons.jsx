"use client";

import React, { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";

export default function QCActionButtons({ productId, onAction }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleQC = async (action) => {
    setIsLoading(true);
    // Simulasi loading sebentar biar kerasa ada proses
    setTimeout(() => {
      setIsLoading(false);
      onAction(productId, action);
    }, 800);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Tombol Tolak */}
      <button 
        onClick={() => handleQC("REJECTED")}
        disabled={isLoading}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all active:scale-90 disabled:opacity-50 border border-red-100"
        title="Tolak Produk"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-5 h-5" />}
      </button>

      {/* Tombol Terima */}
      <button 
        onClick={() => handleQC("APPROVED")}
        disabled={isLoading}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all active:scale-90 disabled:opacity-50 border border-green-100"
        title="Setujui Produk"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
      </button>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Phone, X } from "lucide-react";

export default function PhoneSettingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Autocorrect Prompt
    let rawPhone = phone;
    let clean = rawPhone.replace(/[^0-9+]/g, "");
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

    // Selalu konfirmasi karena di UI modal ini tidak ada label statis "+62" di sebelah kiri input
    const needsPrompt = clean.startsWith("0") || clean.startsWith("62") || clean.startsWith("+62") || (!clean.startsWith("+62") && clean.length > 0);
    if (needsPrompt) {
      const confirmBox = window.confirm(`Autocorrect: nomor yang akan tercatat: ${corrected}\n\nKlik OK untuk setuju, atau Cancel untuk ketik ulang.`);
      if (!confirmBox) return; // User membatalkan
    }

    setPhone(corrected);
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappNumber: corrected })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage("Nomor WhatsApp berhasil disimpan!");
        setTimeout(() => setIsOpen(false), 1500);
      } else {
        setError(data.error || "Gagal menyimpan nomor.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors w-full text-left mt-auto"
      >
        <Phone className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider">Set WA Number</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Set WhatsApp</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nomor WhatsApp Baru
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Otomatis dikonversi ke format +62
                </p>
              </div>

              {message && <div className="p-2 bg-green-50 text-green-700 text-xs rounded-md">{message}</div>}
              {error && <div className="p-2 bg-red-50 text-red-700 text-xs rounded-md">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:opacity-70"
              >
                {loading ? "Menyimpan..." : "Simpan Nomor"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

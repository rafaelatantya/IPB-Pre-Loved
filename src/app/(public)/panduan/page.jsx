"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, LogIn, Search, Heart, MessageSquare, Store, ShieldCheck } from "lucide-react";

export default function PanduanPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "Siapa saja yang bisa menggunakan IPB Pre Loved?",
      answer: "Platform ini eksklusif hanya untuk civitas akademika IPB. Anda memerlukan akun Google dengan domain @apps.ipb.ac.id untuk dapat login dan melakukan transaksi jual-beli."
    },
    {
      question: "Apakah ada biaya transaksi di platform ini?",
      answer: "Tidak ada. IPB Pre Loved 100% gratis. Kami tidak menyediakan payment gateway internal. Semua proses pembayaran dan pengiriman disepakati langsung antara penjual dan pembeli (biasanya via metode COD)."
    },
    {
      question: "Berapa lama waktu yang dibutuhkan agar barang saya tayang?",
      answer: "Setelah Anda mengunggah barang, statusnya akan menjadi PENDING. Tim Admin kami akan melakukan Quality Control (QC) maksimal dalam 1x24 jam untuk memastikan barang sesuai pedoman sebelum ditayangkan ke publik."
    },
    {
      question: "Bagaimana jika ada sengketa atau penipuan?",
      answer: "Kami sangat menyarankan transaksi dilakukan secara Cash on Delivery (COD) di area aman dalam kampus. IPB Pre Loved hanya bertindak sebagai katalog dan tidak bertanggung jawab atas kerugian finansial yang terjadi di luar platform."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] md:bg-[#F8FAFC] font-poppins md:font-sans pb-32 md:pb-20">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden w-full px-6 py-4 bg-white shadow-[0px_4px_20px_0px_rgba(26,28,28,0.03)] flex justify-between items-center sticky top-0 z-50">
          <div className="flex-1 flex justify-between items-center overflow-hidden">
              <div className="justify-center text-zinc-900 text-lg font-semibold font-poppins leading-5 uppercase">IPB PRE LOVED</div>
              <div className="w-9 px-4 py-2 bg-blue-300 rounded-[36px] shadow-[0px_1px_2px_0px_rgba(105,81,255,0.05)] flex justify-center items-center gap-1.5 overflow-hidden">
                  <div className="size-5 relative overflow-hidden flex items-center justify-center">
                      <div className="size-4 bg-blue-600 rounded-full"></div>
                  </div>
              </div>
          </div>
      </div>

      {/* MOBILE HERO SECTION */}
      <div className="md:hidden w-full px-6 pt-8 pb-12 bg-indigo-50 flex flex-col justify-start items-start">
          <h1 className="self-stretch justify-center text-black text-5xl font-semibold font-poppins leading-[57.60px]">Panduan</h1>
      </div>

      {/* DESKTOP HEADER SECTION */}
      <div className="hidden md:flex flex-col items-center gap-6 max-w-[672px] text-center mx-auto py-16 px-6">
        <h1 className="text-black text-[48px] font-poppins font-semibold leading-[57.6px] uppercase tracking-tight">
          PANDUAN
        </h1>
        <p className="text-[#5E5E5E] text-[16px] font-poppins font-medium leading-[24px]">
          Panduan lengkap menggunakan platform marketplace ini. Temukan jawaban
          untuk transaksi, penjualan, dan pengelolaan akun Anda.
        </p>
      </div>

      {/* GUIDES GRID */}
      <div className="w-full max-w-7xl mx-auto md:px-10 lg:px-[40px]">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-[#C6C6C6] md:border-[#C6C6C6]">
          {/* Guide Item 1 */}
          <div className="p-8 bg-white border-r border-b border-[#C6C6C6] flex flex-col items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
            <LogIn className="w-7 h-7 text-black group-hover:text-blue-600 transition-colors" />
            <h3 className="text-black text-base md:text-[18px] font-poppins font-semibold md:font-semibold leading-6 md:leading-[21.6px] uppercase">LOGIN & AKUN</h3>
            <p className="text-zinc-600 md:text-[#5E5E5E] text-xs md:text-[16px] font-poppins font-normal md:font-medium leading-4 md:leading-[24px]">
              Cara mendaftar, mengatur profil, dan menyelesaikan masalah terkait akses akun Anda.
            </p>
          </div>
          {/* Guide Item 2 */}
          <div className="p-8 bg-white border-r border-b border-[#C6C6C6] flex flex-col items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
            <Search className="w-7 h-7 text-black group-hover:text-blue-600 transition-colors" />
            <h3 className="text-black text-base md:text-[18px] font-poppins font-semibold md:font-semibold leading-6 md:leading-[21.6px] uppercase">CARI BARANG</h3>
            <p className="text-zinc-600 md:text-[#5E5E5E] text-xs md:text-[16px] font-poppins font-normal md:font-medium leading-4 md:leading-[24px]">
              Panduan menggunakan filter, pencarian spesifik, dan menavigasi kategori produk.
            </p>
          </div>
          {/* Guide Item 3 */}
          <div className="p-8 bg-white border-r border-b border-[#C6C6C6] flex flex-col items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
            <Store className="w-7 h-7 text-black group-hover:text-blue-600 transition-colors" />
            <h3 className="text-black text-base md:text-[18px] font-poppins font-semibold md:font-semibold leading-6 md:leading-[21.6px] uppercase">Mulai Menjual</h3>
            <p className="text-zinc-600 md:text-[#5E5E5E] text-xs md:text-[16px] font-poppins font-normal md:font-medium leading-4 md:leading-[24px]">
              Persyaratan listing, mengunggah foto, dan menentukan harga barang bekas Anda.
            </p>
          </div>
          {/* Guide Item 4 */}
          <div className="p-8 bg-white border-r border-b border-[#C6C6C6] flex flex-col items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
            <Heart className="w-7 h-7 text-black group-hover:text-blue-600 transition-colors" />
            <h3 className="text-black text-base md:text-[18px] font-poppins font-semibold md:font-semibold leading-6 md:leading-[21.6px] uppercase">WISHLIST</h3>
            <p className="text-zinc-600 md:text-[#5E5E5E] text-xs md:text-[16px] font-poppins font-normal md:font-medium leading-4 md:leading-[24px]">
              Cara menyimpan barang yang diminati dan memantau ketersediaannya.
            </p>
          </div>
          {/* Guide Item 5 */}
          <div className="p-8 bg-white border-r border-b border-[#C6C6C6] flex flex-col items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
            <MessageSquare className="w-7 h-7 text-black group-hover:text-blue-600 transition-colors" />
            <h3 className="text-black text-base md:text-[18px] font-poppins font-semibold md:font-semibold leading-6 md:leading-[21.6px] uppercase">Hubungi Penjual</h3>
            <p className="text-zinc-600 md:text-[#5E5E5E] text-xs md:text-[16px] font-poppins font-normal md:font-medium leading-4 md:leading-[24px]">
              Etika komunikasi, negosiasi harga, dan cara aman bertransaksi melalui pesan.
            </p>
          </div>
          {/* Guide Item 6 */}
          <div className="p-8 bg-white border-r border-b border-[#C6C6C6] flex flex-col items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
            <ShieldCheck className="w-7 h-7 text-black group-hover:text-blue-600 transition-colors" />
            <h3 className="text-black text-base md:text-[18px] font-poppins font-semibold md:font-semibold leading-6 md:leading-[21.6px] uppercase">Review Admin</h3>
            <p className="text-zinc-600 md:text-[#5E5E5E] text-xs md:text-[16px] font-poppins font-normal md:font-medium leading-4 md:leading-[24px]">
              Proses verifikasi listing, kebijakan penolakan, dan standar kualitas marketplace.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-[112px] flex flex-col mt-12 md:mt-16">
        <div className="w-full max-w-[896px] mx-auto flex flex-col gap-8">
          <div className="w-full pb-4 border-b-2 border-black inline-flex justify-start items-center">
            <h2 className="text-black text-2xl md:text-[32px] font-poppins font-semibold leading-7 md:leading-[38.4px] uppercase tracking-tight">
              Frequently Asked Question
            </h2>
          </div>
          
          <div className="flex flex-col gap-1.5 md:gap-0">
            {faqs.map((faq, idx) => (
              <div key={idx} className="w-full border-b border-black md:border-[#020617] md:opacity-100 flex flex-col">
                <div 
                  className="w-full py-4 md:py-6 flex justify-between items-center cursor-pointer group"
                  onClick={() => toggleFaq(idx)}
                >
                  <span className="text-black text-xs md:text-[18px] font-poppins font-normal md:font-semibold leading-4 md:leading-[21.6px] group-hover:text-blue-600 transition-colors uppercase">
                    {faq.question}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="size-5 md:w-6 md:h-6 text-black" />
                  ) : (
                    <ChevronDown className="size-5 md:w-6 md:h-6 text-black" />
                  )}
                </div>
                
                {openFaq === idx && (
                  <div className="w-full pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                    <p className="text-[#5E5E5E] text-xs md:text-[16px] font-poppins leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}


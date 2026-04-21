"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center">
      <h1 className="text-5xl font-extrabold text-indigo-900 mb-2">IPB Pre-Loved</h1>
      <p className="text-xl text-indigo-700 mb-8 font-medium">Beli barang bekas mahasiswa IPB makin gampang dan aman.</p>
      
      {session?.user && (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-indigo-100 inline-block text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Sesi Aktif Terdeteksi</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium w-12">Email</span>
                <span className="text-sm font-semibold text-gray-900">{session.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium w-12">Role</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-black uppercase tracking-tighter">
                    {session.user.role || 'GUEST'}
                </span>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="mt-6 text-[10px] text-red-400 hover:text-red-500 font-bold uppercase tracking-widest transition"
          >
            Bersihkan Sesi / Logout
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        <Link 
          href="/admin-test" 
          className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition transform hover:scale-[1.02] active:scale-95"
        >
          Buka Backend Test Panel
        </Link>
        {!session && (
          <Link 
            href="/login" 
            className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl border border-indigo-100 shadow-sm hover:bg-indigo-50 transition transform hover:scale-[1.02] active:scale-95"
          >
            Login Sekarang
          </Link>
        )}
      </div>

      <footer className="mt-20 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
        IPB Pre-Loved • Kelompok 5 R3
      </footer>
    </div>
  );
}

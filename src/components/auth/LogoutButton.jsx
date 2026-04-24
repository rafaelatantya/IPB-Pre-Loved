"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut()}
      className="mt-8 w-full flex items-center justify-center gap-2 py-3 text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-widest transition-all hover:bg-red-50 rounded-xl"
    >
      <LogOut className="w-4 h-4" /> Keluar Sesi
    </button>
  );
}

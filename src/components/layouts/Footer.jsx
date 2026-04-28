import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full px-6 md:px-10 py-12 bg-white border-t border-[#C6C6C6] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col justify-start items-start">
            <div className="justify-center flex flex-col text-black text-sm font-bold font-sans uppercase leading-5 tracking-widest break-words text-center md:text-left">
                © 2026 IPB PRE LOVED ARCHITECTURAL WIREFRAME
            </div>
        </div>
        <div className="flex justify-start items-start gap-6">
            <Link href="#" className="flex flex-col justify-start items-start">
                <div className="justify-center flex flex-col text-[#777777] text-xs font-normal font-sans uppercase leading-[18px] tracking-widest break-words hover:text-black transition-colors">BANTUAN</div>
            </Link>
            <Link href="#" className="flex flex-col justify-start items-start">
                <div className="justify-center flex flex-col text-[#777777] text-xs font-normal font-sans uppercase leading-[18px] tracking-widest break-words hover:text-black transition-colors">KETENTUAN</div>
            </Link>
            <Link href="#" className="flex flex-col justify-start items-start">
                <div className="justify-center flex flex-col text-[#777777] text-xs font-normal font-sans uppercase leading-[18px] tracking-widest break-words hover:text-black transition-colors">KONTAK</div>
            </Link>
        </div>
    </div>
  );
}

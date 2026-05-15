"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, HelpCircle } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "HOME", href: "/", icon: Home },
    { label: "CATALOG", href: "/catalog", icon: LayoutGrid },
    { label: "WISHLIST", href: "/wishlist", icon: Heart },
    { label: "PANDUAN", href: "/panduan", icon: HelpCircle },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 px-3.5 py-3 bg-neutral-50 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex-1 px-4 py-2 flex flex-col justify-center items-center rounded-sm transition-colors ${
              isActive ? "bg-blue-600" : "bg-transparent"
            }`}
          >
            <div className="pb-1 flex flex-col justify-start items-start">
              <div className="flex flex-col justify-start items-center">
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-zinc-400"}`}
                  strokeWidth={2}
                />
              </div>
            </div>
            <div className="flex flex-col justify-start items-center">
              <div
                className={`text-center text-[10px] font-normal font-sans uppercase leading-4 tracking-wide ${
                  isActive ? "text-neutral-50" : "text-zinc-400"
                }`}
              >
                {item.label}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

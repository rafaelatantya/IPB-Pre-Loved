"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlusSquare, FileText } from "lucide-react";

const sellerLinks = [
    { name: "Daftar Produk Saya", href: "/dashboard", icon: LayoutGrid },
    { name: "Tambah Produk", href: "/product/add", icon: PlusSquare },
    { name: "Profil/Kontak", href: "/profile", icon: FileText },
];

const adminLinks = [
    { name: "Dashboard QC", href: "/admin/dashboard", icon: LayoutGrid },
    { name: "Antrean Produk", href: "/admin/queue", icon: FileText },
];

export default function Sidebar({ role = "seller" }) {
    const pathname = usePathname();
    const links = role === "admin" ? adminLinks : sellerLinks;

    return (
        <aside className="hidden md:flex flex-col w-[240px] fixed top-0 left-0 h-screen bg-white border-r border-gray-200 py-6 px-4">
            {/* Brand */}
            <div className="flex flex-col gap-1 px-3 pb-6 mb-4 border-b border-gray-100">
                <div className="w-11 h-11 border border-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#888"
                        strokeWidth="1.5"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">IPB Pre Loved</span>
                <span className="text-xs text-gray-400">
                    {role === "admin" ? "Admin Panel" : "Seller Management"}
                </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-0.5">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        pathname === link.href || pathname.startsWith(link.href + "/");

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                ? "bg-gray-100 text-gray-900 font-medium border border-gray-200"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                }`}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
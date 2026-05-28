"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlusSquare, FileText, User } from "lucide-react";
import PhoneSettingModal from "@/components/profile/PhoneSettingModal";

const sellerLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Tambah Produk", href: "/product/add", icon: PlusSquare },
    { name: "Profil/Kontak", href: "/profile", icon: User },
];

const adminLinks = [
    { name: "Dashboard QC", href: "/admin/dashboard", icon: LayoutGrid },
    { name: "Antrean Produk", href: "/admin/queue", icon: FileText },
];

export default function Sidebar({ role = "seller" }) {
    const pathname = usePathname();
    const links = role === "admin" ? adminLinks : sellerLinks;

    return (
        <aside className="hidden md:flex flex-col w-[240px] fixed top-0 left-0 h-screen bg-white border-r border-gray-200 py-8 px-6">
            {/* Brand */}
            <div className="flex flex-col gap-1 px-2 pb-6 mb-6 border-b border-gray-100">
                <div className="w-12 h-12 relative mb-3">
                    <img
                        src="/common/Logo_IPB.png"
                        alt="IPB Logo"
                        className="w-12 h-12 object-contain"
                    />
                </div>
                <span className="text-lg font-bold text-gray-900 tracking-tight">IPB Pre Loved</span>
                <span className="text-xs font-medium text-gray-400">
                    {role === "admin" ? "Admin Panel" : "Seller Management"}
                </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1.5 mb-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        pathname === link.href || pathname.startsWith(link.href + "/");

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all ${isActive
                                ? "bg-gray-50 text-gray-900 font-semibold"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-gray-900" : "text-gray-400"}`} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-4 border-t border-gray-100">
                <PhoneSettingModal />
            </div>
        </aside>
    );
}
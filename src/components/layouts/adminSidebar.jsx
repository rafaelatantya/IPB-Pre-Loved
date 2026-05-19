"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutGrid, ClipboardList, Archive, Users, History, FileText, LogOut, PlusSquare } from "lucide-react";
import PhoneSettingModal from "@/components/profile/PhoneSettingModal";

const topLinks = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutGrid },
    { name: "Pending Reviews", href: "/admin/queue", icon: ClipboardList },
    { name: "Inventory", href: "/admin/inventory", icon: Archive },
    { name: "User Accounts", href: "/admin/users", icon: Users },
    { name: "Activity Logs", href: "/admin/logs", icon: History },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="hidden md:flex flex-col w-[240px] fixed top-0 left-0 h-screen bg-[#F9F9F9] border-r border-gray-200 px-4 py-8 select-none">

            {/* Brand - ADMIN PORTAL */}
            <div className="px-3 mb-8">
                <span className="text-[12px] font-black text-gray-900 uppercase tracking-widest font-sans">
                    Admin Portal
                </span>
            </div>

            {/* Top Nav */}
            <nav className="flex flex-col gap-1.5 flex-1">
                {topLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        pathname === link.href || pathname.startsWith(link.href + "/");

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-3.5 py-3 rounded transition-all ${isActive
                                ? "bg-white text-gray-900 border border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-semibold"
                                : "text-gray-400 hover:text-gray-800 hover:bg-gray-100/50"
                                }`}
                        >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-gray-900" : "text-gray-400"}`} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="flex flex-col gap-1 mt-auto pt-6 border-t border-gray-200/60">
                {/* Generate Report Button */}
                <button 
                    onClick={() => alert("Report generation started...")}
                    className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white text-[10px] font-extrabold uppercase tracking-widest rounded transition-colors mb-3 shadow-sm active:scale-[0.98]"
                >
                    Generate Report
                </button>

                <PhoneSettingModal />

                {/* Documentation Link */}
                <Link
                    href="/panduan"
                    className="flex items-center gap-3 px-3 py-2.5 rounded text-gray-400 hover:bg-gray-100/50 hover:text-gray-800 transition-colors"
                >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                        Documentation
                    </span>
                </Link>

                {/* Logout Button */}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-3 px-3 py-2.5 rounded text-red-400 hover:bg-red-50/50 hover:text-red-600 transition-colors mt-0.5"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}
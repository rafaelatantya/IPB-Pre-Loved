"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutGrid, ClipboardList, Archive, Users, History, FileText, LogOut } from "lucide-react";

const topLinks = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutGrid },
    { name: "Pending Reviews", href: "/admin/queue", icon: ClipboardList },
    { name: "Inventory", href: "/admin/inventory", icon: Archive },
    { name: "User Accounts", href: "/admin/users", icon: Users },
    { name: "Activity Logs", href: "/admin/logs", icon: History },
];

const bottomLinks = [
    // { name: "Documentation", href: "/admin/docs", icon: FileText },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="hidden md:flex flex-col w-[240px] fixed top-0 left-0 h-screen bg-white border-r border-gray-200 px-4 py-6">

            {/* Brand - hanya teks bold */}
            <div className="px-3 mb-6">
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
                    Admin Portal
                </span>
            </div>

            {/* Top Nav - flex-1 supaya dorong bagian bawah ke bottom */}
            <nav className="flex flex-col gap-0.5 flex-1">
                {topLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        pathname === link.href || pathname.startsWith(link.href + "/");

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                ? "bg-white text-gray-900 border border-gray-200 shadow-sm"
                                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                }`}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section - Documentation & Logout */}
            <div className="flex flex-col gap-1">
                {bottomLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {link.name}
                            </span>
                        </Link>
                    );
                })}

                {/* Logout Button (Fungsional) */}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors mt-1"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}
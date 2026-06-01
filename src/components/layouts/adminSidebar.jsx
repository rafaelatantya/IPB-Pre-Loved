"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutGrid,
    ClipboardList,
    Archive,
    Users,
    History,
    FileText,
    LogOut
} from "lucide-react";
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

    return (
        <aside className="hidden md:flex flex-col w-[288px] fixed top-0 left-0 h-screen bg-[#F3F3F3] border-r border-gray-200/60 px-6 py-8 select-none font-sans z-50">

            <div className="px-3 mb-8 pb-2">
                <span className="text-[14px] font-black text-[#1A1C1C] uppercase tracking-[1.12px]">
                    Admin Portal
                </span>
            </div>

            <nav className="flex flex-col gap-2 flex-1 w-full">
                {topLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        pathname === link.href || pathname.startsWith(link.href + "/");

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-4 p-3 rounded-[2px] transition-all w-full ${isActive
                                ? "bg-white text-[#1A1C1C] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                                : "text-[#777777] hover:bg-gray-200/60 hover:text-[#1A1C1C]"
                                }`}
                        >
                            <div className="flex items-center justify-center flex-shrink-0">
                                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-[#1A1C1C]" : "text-[#777777]"}`} strokeWidth={2} />
                            </div>
                            <span className="text-[11.2px] font-bold uppercase tracking-[1.12px] text-left">
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-gray-200/60 w-full">

                <button
                    onClick={() => alert("Report generation started...")}
                    className="w-full py-3 bg-black hover:bg-zinc-900 text-[#E5E2E1] text-[11.2px] font-bold uppercase tracking-[1.12px] rounded-[4px] shadow-sm active:scale-[0.98] transition-colors mb-2 text-center"
                >
                    Generate Report
                </button>

                <div className="w-full">
                    <PhoneSettingModal />
                </div>

                <Link
                    href="/panduan"
                    className="flex items-center gap-4 p-3 rounded-[2px] text-[#777777] hover:bg-gray-200/60 hover:text-[#1A1C1C] transition-all w-full"
                >
                    <div className="flex items-center justify-center flex-shrink-0">
                        <FileText className="w-[18px] h-[18px]" strokeWidth={2} />
                    </div>
                    <span className="text-[11.2px] font-bold uppercase tracking-[1.12px]">
                        Documentation
                    </span>
                </Link>

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-4 p-3 rounded-[2px] text-[#777777] hover:bg-red-50 hover:text-red-600 transition-all w-full mt-0.5"
                >
                    <div className="flex items-center justify-center flex-shrink-0">
                        <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
                    </div>
                    <span className="text-[11.2px] font-bold uppercase tracking-[1.12px]">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}
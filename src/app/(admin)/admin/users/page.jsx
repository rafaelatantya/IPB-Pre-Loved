"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Search, Loader2 } from "lucide-react";
import {
    getAdminUsers,
    toggleBlockUser,
    deleteUser,
    getUserProductsInfo,
} from "@/modules/admin/actions";

function RoleBadge({ role }) {
    return (
        <span
            className="inline-flex items-center px-3 py-1 rounded-[4px] bg-[#EFEFEF] text-[#1A1C1C]"
            style={{
                fontSize: "10.4px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.52px",
                lineHeight: "20px",
            }}
        >
            {role}
        </span>
    );
}

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAdminUsers(search);
            if (res.success) setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBlock = async (userId, currentBlocked) => {
        if (
            !confirm(
                `Apakah Anda yakin ingin ${currentBlocked ? "melepaskan ban" : "memblokir"} user ini?`
            )
        )
            return;
        const res = await toggleBlockUser(userId, !currentBlocked);
        if (res.success) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? { ...u, isBlocked: !currentBlocked } : u
                )
            );
        }
    };

    const handleDelete = async (userId) => {
        setLoading(true);
        try {
            const infoRes = await getUserProductsInfo(userId);
            if (!infoRes.success) {
                alert(infoRes.error || "Gagal mengambil info produk user.");
                return;
            }
            const userProducts = infoRes.data || [];
            const confirmMsg =
                userProducts.length > 0
                    ? `User ini memiliki ${userProducts.length} produk:\n\n${userProducts
                        .map((p) => `• ${p.title}`)
                        .join("\n")}\n\nSeluruh produk akan ikut TERHAPUS. Yakin?`
                    : "User ini tidak memiliki produk.\n\nHapus akun secara permanen? Tidak bisa dibatalkan.";
            if (!confirm(confirmMsg)) return;
            const res = await deleteUser(userId);
            if (res.success) {
                setUsers((prev) => prev.filter((u) => u.id !== userId));
            } else {
                alert(res.error || "Gagal menghapus user.");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan sistem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ── Header ── */}
            <div className="flex items-end justify-between mb-12">
                <div className="flex flex-col gap-2">
                    <h1
                        className="text-[#1A1C1C] leading-[44px]"
                        style={{ fontSize: 44, fontWeight: 900 }}
                    >
                        User Accounts
                    </h1>
                    <p
                        className="text-[#777777]"
                        style={{ fontSize: 14, fontWeight: 400, letterSpacing: "0.35px", lineHeight: "20px" }}
                    >
                        Manage platform participants and enforce community standards.
                    </p>
                </div>

                {/* Search Form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        fetchUsers();
                    }}
                    className="flex items-center gap-2"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-[rgba(119,119,119,0.30)] rounded-[4px] text-[14px] text-[#777777] outline-none focus:ring-1 focus:ring-black transition-all w-72"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2.5 bg-black hover:bg-zinc-900 text-white rounded-[4px] text-[14px] font-medium transition-all active:scale-[0.98]"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-[4px] overflow-hidden">
                {/* Filter bar */}
                <div className="px-8 py-4 bg-[#F3F3F3] border-b border-[rgba(198,198,198,0.20)]">
                    <span
                        className="text-[#777777]"
                        style={{
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "1.2px",
                            lineHeight: "16px",
                        }}
                    >
                        Filter
                    </span>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-200" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-16 text-center text-[#777777] text-sm italic font-medium">
                        Tidak ada user ditemukan.
                    </div>
                ) : (
                    <table className="w-full border-collapse text-left table-fixed">
                        <colgroup>
                            <col />
                            <col className="w-[220px]" />
                            <col className="w-[140px]" />
                            <col className="w-[120px]" />
                        </colgroup>

                        <thead>
                            <tr className="border-b border-[rgba(198,198,198,0.20)]">
                                {["User", "Email Address", "Role"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-8 py-4 text-[#777777] text-left"
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 500,
                                            textTransform: "uppercase",
                                            letterSpacing: "1.2px",
                                            lineHeight: "16px",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                                <th
                                    className="px-8 py-4 text-[#777777] text-right"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                        letterSpacing: "1.2px",
                                        lineHeight: "16px",
                                    }}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u) => (
                                <tr
                                    key={u.id}
                                    className={`border-b border-[rgba(198,198,198,0.20)] last:border-0 transition-colors hover:bg-gray-50/50 ${u.isBlocked ? "opacity-50" : ""
                                        }`}
                                >
                                    {/* User */}
                                    <td className="px-8 py-6">
                                        <p
                                            className="text-[#1A1C1C]"
                                            style={{ fontSize: 14, fontWeight: 700, lineHeight: "20px" }}
                                        >
                                            {u.name}
                                        </p>
                                        <p
                                            className="text-[#777777] mt-0.5"
                                            style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px" }}
                                        >
                                            Joined{" "}
                                            {u.createdAt
                                                ? new Date(u.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "—"}
                                        </p>
                                    </td>

                                    <td className="px-8 py-6">
                                        <span
                                            className="text-[#474747] truncate block"
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 400,
                                                lineHeight: "16px",
                                                fontFamily: "Poppins, sans-serif",
                                            }}
                                        >
                                            {u.email ?? "—"}
                                        </span>
                                    </td>

                                    {/* Role */}
                                    <td className="px-8 py-6">
                                        <RoleBadge role={u.userType ?? u.role ?? "STUDENT"} />
                                    </td>

                                    {/* Actions */}
                                    <td className="px-8 py-6 text-right">
                                        {u.id !== session?.user?.id ? (
                                            <button
                                                onClick={() => handleToggleBlock(u.id, u.isBlocked)}
                                                className="inline-flex items-center justify-center px-5 py-2 rounded-[4px] border border-[rgba(119,119,119,0.40)] bg-transparent hover:bg-gray-50 active:scale-[0.98] transition-all text-[#1A1C1C]"
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "1.2px",
                                                    lineHeight: "16px",
                                                }}
                                            >
                                                {u.isBlocked ? "Unblock" : "Block"}
                                            </button>
                                        ) : (
                                            <span
                                                className="text-[#777777] italic"
                                                style={{ fontSize: 11, fontWeight: 600 }}
                                            >
                                                You
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
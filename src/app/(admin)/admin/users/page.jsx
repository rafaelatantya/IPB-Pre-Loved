"use client";

export const runtime = "edge";
export const forceDynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Search, ShieldAlert, Trash2, UserCheck, Loader2 } from "lucide-react";
import { getAdminUsers, toggleBlockUser, deleteUser } from "@/modules/admin/actions";

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
        const timer = setTimeout(fetchUsers, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleToggleBlock = async (userId, currentBlocked) => {
        if (!confirm(`Apakah Anda yakin ingin ${currentBlocked ? 'melepaskan ban' : 'memblokir'} user ini?`)) return;
        const res = await toggleBlockUser(userId, !currentBlocked);
        if (res.success) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: !currentBlocked } : u));
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm("Hapus akun secara permanen? Tindakan ini tidak bisa dibatalkan.")) return;
        const res = await deleteUser(userId);
        if (res.success) setUsers(prev => prev.filter(u => u.id !== userId));
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Accounts</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage permissions and safety protocols for all users</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or NIM..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all w-72"
                    />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 px-6 py-4">User Details</th>
                            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-4">Role</th>
                            <th className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-4">Status</th>
                            <th className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-4">Joined At</th>
                            <th className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((u) => (
                            <tr key={u.id} className={`hover:bg-gray-50/50 transition-colors group ${u.isBlocked ? "bg-red-50/30" : ""}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs ${u.role === "ADMIN" ? "bg-blue-100 text-blue-600 border border-blue-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                                            {u.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{u.name}</p>
                                            <p className="text-[10px] text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${u.role === "ADMIN" ? "text-blue-600" : "text-gray-400"}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex justify-center">
                                        {u.isBlocked ? (
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-600 border border-red-200">BANNED</span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-green-100 text-green-600 border border-green-200">ACTIVE</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center text-[10px] font-bold text-gray-400 uppercase">
                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-1">
                                        {u.id !== session?.user?.id ? (
                                            <>
                                                <button 
                                                    onClick={() => handleToggleBlock(u.id, u.isBlocked)}
                                                    className={`p-2 rounded-lg transition-all ${u.isBlocked ? "text-green-600 hover:bg-green-50" : "text-orange-500 hover:bg-orange-50"}`}
                                                    title={u.isBlocked ? "Unban" : "Ban User"}
                                                >
                                                    {u.isBlocked ? <UserCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(u.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Account"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase italic">YOU (ACTIVE)</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-200" />
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAdminInventory, adminUpdateProductStatus } from "@/modules/admin/actions";

export default function AdminInventoryPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("ALL");
    const router = useRouter();

    const fetchInventory = async (p = 1, tab = activeTab) => {
        setLoading(true);
        try {
            const res = await getAdminInventory({ 
                page: p, 
                limit: 20, 
                status: tab === "ALL" ? null : tab 
            });
            if (res.success) {
                if (p === 1) setProducts(res.data);
                else setProducts(prev => [...prev, ...res.data]);
                if (res.data.length < 20) setHasMore(false);
                else setHasMore(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory(1, "ALL");
    }, []);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setPage(1);
        fetchInventory(1, tabId);
    };

    const handleUpdateStatus = async (id, status) => {
        const confirmMsg = status === "APPROVED" 
          ? "Setujui produk ini agar tayang ke publik?" 
          : "Turunkan/tolak produk ini?";
        if (!confirm(confirmMsg)) return;

        try {
            const res = await adminUpdateProductStatus({
                productId: id,
                status,
                note: status === "APPROVED" ? "Approved from global inventory list" : "Taken down from global inventory list"
            });
            if (res.success) {
                setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
            } else {
                alert(res.error || "Gagal memperbarui status");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan.");
        }
    };

    const filteredProducts = products.filter(p => 
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.seller?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.seller?.email?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const TABS = [
        { id: "ALL", label: "All" },
        { id: "PENDING", label: "Pending" },
        { id: "APPROVED", label: "Approved" },
        { id: "REJECTED", label: "Rejected" }
    ];

    return (
        <div className="max-w-6xl mx-auto -mt-8 -mx-8">
            {/* Top Search Navbar */}
            <div className="flex items-center justify-between border-b border-gray-200/80 bg-white px-8 py-4 mb-8 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search inventory..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-100/70 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-gray-200 transition-all w-full font-medium"
                    />
                </div>
                <div className="flex items-center gap-4 text-gray-500">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    </button>
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Title Block */}
            <div className="px-8 mb-6">
                <h1 className="text-[32px] font-black text-gray-900 tracking-tight leading-tight font-sans">
                    Inventory Moderation
                </h1>
                <p className="text-sm text-gray-400 font-medium mt-1">
                    Review and manage all user-submitted products across the marketplace.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="mx-8 bg-gray-100/50 border border-gray-200/80 rounded-xl p-2.5 flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === tab.id
                                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/40"
                                    : "text-gray-400 hover:text-gray-600 hover:bg-white/30"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all active:scale-[0.98]">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                    <span>More Filters</span>
                </button>
            </div>

            {/* Table Container */}
            <div className="mx-8 bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-8">
                {filteredProducts.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 font-bold italic text-sm">
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                        ) : (
                            "Tidak ada produk dalam daftar ini."
                        )}
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse text-left">
                        <thead>
                            <tr className="border-b border-gray-200 bg-[#FAFAFA]">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">
                                    Product
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#71717A] w-[140px]">
                                    Seller ID
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#71717A] w-[140px]">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#71717A] w-[130px] text-center">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#71717A] w-[150px] text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/40 transition-colors group text-gray-700">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {p.images?.[0]?.url ? (
                                                    <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="1.2">
                                                        <rect x="3" y="3" width="18" height="18" rx="1.5" />
                                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                                        <path d="M21 15l-5-5L5 21" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[14px] text-gray-900 tracking-tight leading-snug">{p.title}</p>
                                                <p className="text-[10px] text-gray-400 mt-1 font-semibold">
                                                    Listed: {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                            USR-{p.sellerId?.slice(0, 4).toUpperCase() || "NULL"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-semibold text-gray-600">{p.category?.name || "UMUM"}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-extrabold uppercase border ${
                                            p.status === 'APPROVED' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : p.status === 'PENDING'
                                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                : 'bg-red-50 text-red-500 border-red-100'
                                        }`}>
                                            {p.status === 'APPROVED' ? 'Approved' : p.status === 'PENDING' ? 'Pending' : 'Rejected'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center min-h-[32px]">
                                            {p.status === "APPROVED" && (
                                                <button
                                                    onClick={() => handleUpdateStatus(p.id, "REJECTED")}
                                                    className="border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold text-gray-700 px-4 py-2 rounded shadow-sm transition-all"
                                                >
                                                    Take Down
                                                </button>
                                            )}
                                            {p.status === "PENDING" && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(p.id, "APPROVED")}
                                                        className="bg-black hover:bg-zinc-800 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded shadow-sm transition-all"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(p.id, "REJECTED")}
                                                        className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded shadow-sm transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {p.status === "REJECTED" && (
                                                <button
                                                    onClick={() => router.push(`/admin/queue/${p.id}`)}
                                                    className="border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 px-5 py-2 rounded shadow-sm transition-all"
                                                >
                                                    Review
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination Stats block */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-400 font-semibold">
                        <span>Showing 1 to {filteredProducts.length} of {products.length} entries</span>
                        {hasMore && (
                            <button 
                                onClick={() => { setPage(p => p + 1); fetchInventory(page + 1); }}
                                className="text-xs font-bold text-gray-900 hover:underline"
                            >
                                Load More Data
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

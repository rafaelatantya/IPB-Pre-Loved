"use client";

export const runtime = "edge";
export const forceDynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { Search, Loader2, ExternalLink, Trash2 } from "lucide-react";
import { getAdminInventory } from "@/modules/admin/actions";
import { deleteProduct } from "@/modules/product/actions";

export default function AdminInventoryPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");

    const fetchInventory = async (p = 1) => {
        try {
            const res = await getAdminInventory({ page: p, limit: 20 });
            if (res.success) {
                if (p === 1) setProducts(res.data);
                else setProducts(prev => [...prev, ...res.data]);
                if (res.data.length < 20) setHasMore(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory(1);
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Hapus produk ini secara paksa?")) return;
        const res = await deleteProduct(id);
        if (res.success) {
            setProducts(prev => prev.filter(p => p.id !== id));
        } else {
            alert(res.error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Global Inventory</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage all listings from all campus users</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64"
                    />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Product</th>
                            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-4">Seller</th>
                            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-4">Category</th>
                            <th className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-4">Status</th>
                            <th className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-4">Price</th>
                            <th className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group text-gray-600">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-gray-900">{p.title}</p>
                                    <p className="text-[10px] text-gray-400">ID: {p.id}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-xs font-medium text-gray-700">{p.seller?.name || "Unknown"}</p>
                                    <p className="text-[10px] text-gray-400">{p.seller?.email}</p>
                                </td>
                                <td className="px-4 py-4 text-xs">
                                    {p.category?.name || "UMUM"}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex justify-center">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${p.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center font-semibold text-gray-900">
                                    Rp {p.price?.toLocaleString("id-ID")}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => window.open(`/product/${p.id}`, '_blank')}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(p.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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

                {!loading && hasMore && (
                    <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                        <button 
                            onClick={() => { setPage(p => p + 1); fetchInventory(page + 1); }}
                            className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            Load More Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

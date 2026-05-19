"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { getPendingProducts } from "@/modules/admin/actions";

function getTimeAgo(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hr" : "hrs"} ago`;
  if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  return date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' });
}

export default function AdminDashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPendingProducts();
        if (res.success) {
          setItems(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-black text-gray-900 tracking-tight leading-tight font-sans">
          Pending Validation Queue
        </h1>
        <p className="text-sm text-gray-400 font-medium mt-1">
          Review and approve new listings.
        </p>
      </div>

      {/* Stat Card - Needs QC Today */}
      <div className="bg-white border border-gray-200/80 rounded-xl px-8 py-6 flex items-center justify-between mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-sans">
            Needs QC Today
          </p>
          <p className="text-5xl font-black text-gray-900 tracking-tight leading-none font-sans">{items.length}</p>
        </div>
        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg text-gray-900">
          <SlidersHorizontal className="w-5 h-5 stroke-[1.8]" />
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {items.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-bold italic text-sm">
            Semua produk telah diproses. Antrean QC kosong! 🎉
          </div>
        ) : (
          <table className="w-full text-sm border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-[#FAFAFA]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#71717A] w-[90px]">
                  Item
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">
                  Details
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#71717A] w-[180px]">
                  Seller
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#71717A] w-[130px]">
                  Uploaded
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#71717A] w-[110px] text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/40 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.images?.[0]?.url ? (
                        <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="1.2">
                          <rect x="3" y="3" width="18" height="18" rx="1.5" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-[14px] text-gray-900 tracking-tight leading-snug">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                      Category: {item.category?.name || "UMUM"}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold text-gray-700 truncate block max-w-[160px]">
                      {item.seller?.name || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-semibold text-gray-400">
                      {getTimeAgo(item.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center whitespace-nowrap">
                    <button
                      onClick={() => router.push(`/admin/queue/${item.id}`)}
                      className="bg-black hover:bg-zinc-800 text-white text-[10px] font-extrabold uppercase tracking-widest px-6 py-2.5 rounded shadow-sm active:scale-[0.98] transition-all"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
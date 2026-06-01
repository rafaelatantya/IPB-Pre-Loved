"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Loader2,
  Search,
  Users,
  PackageCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { getPendingProducts, getAdminDashboardStats } from "@/modules/admin/actions";

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
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function StatCard({ label, value, icon: Icon, subtitle }) {
  return (
    <div className="bg-white rounded-[4px] p-6 flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#777777]">
          {label}
        </p>
        <p className="text-[36px] font-black leading-none text-[#1A1C1C]">
          {value ?? "—"}
        </p>
        {subtitle && (
          <p className="text-[12px] font-medium text-[#777777]">{subtitle}</p>
        )}
      </div>
      <div className="w-12 h-12 bg-[#E8E8E8] rounded-[2px] flex items-center justify-center flex-shrink-0 mt-1">
        <Icon className="w-5 h-5 stroke-2 text-[#1A1C1C]" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [queueRes, statsRes] = await Promise.all([
          getPendingProducts(),
          getAdminDashboardStats(),
        ]);
        if (queueRes.success) setItems(queueRes.data);
        if (statsRes.success) setStats(statsRes.data);
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-[44px] font-bold leading-[55px] text-[#1A1C1C] tracking-tight">
          Overview
        </h1>
        <p className="text-[14px] font-medium text-[#474747] tracking-[0.35px]">
          Platform health snapshot & pending validation queue.
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Needs QC"
          value={items.length}
          icon={ClipboardList}
          subtitle="Items pending review"
        />
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? "—"}
          icon={Users}
          subtitle="Registered accounts"
        />
        <StatCard
          label="Live Listings"
          value={stats?.approvedProducts ?? "—"}
          icon={PackageCheck}
          subtitle="Approved & public"
        />
        <StatCard
          label="WA Leads"
          value={stats?.totalLeads ?? "—"}
          icon={TrendingUp}
          subtitle="Total WhatsApp clicks"
        />
      </div>

      {/* ── New Today banner ── */}
      {stats?.newToday > 0 && (
        <div className="mb-8 flex items-center gap-3 bg-white rounded-[4px] px-6 py-4">
          <Zap className="w-4 h-4 text-[#1A1C1C]" />
          <p className="text-[14px] font-semibold text-[#1A1C1C]">
            <span className="font-black">{stats.newToday}</span> listing baru masuk dalam 24 jam terakhir.
          </p>
        </div>
      )}

      {/* ── Section title ── */}
      <div className="mb-5">
        <h2 className="text-[20px] font-bold text-[#1A1C1C] tracking-tight">
          Pending Validation Queue
        </h2>
        <p className="text-[13px] text-[#777777] mt-1">
          Review and approve new listings before they go public.
        </p>
      </div>

      {/* ── Queue table ── */}
      <div className="bg-white rounded-[4px] overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-bold italic text-sm">
            Semua produk telah diproses. Antrean QC kosong!
          </div>
        ) : (
          <table className="w-full border-collapse text-left table-fixed">
            <colgroup>
              <col className="w-[88px]" />
              <col />
              <col className="w-[180px]" />
              <col className="w-[140px]" />
              <col className="w-[120px]" />
            </colgroup>

            <thead>
              <tr className="bg-[#F3F3F3] border-b border-[rgba(198,198,198,0.20)]">
                {["Item", "Details", "Seller", "Uploaded"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-4 text-[12px] font-bold uppercase tracking-[1.2px] text-[#474747]"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-4 py-4 text-[12px] font-bold uppercase tracking-[1.2px] text-[#474747] text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[rgba(198,198,198,0.20)] last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-6">
                    <div className="w-16 h-16 bg-[#E2E2E2] border border-[rgba(119,119,119,0.20)] rounded-[2px] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.images?.[0]?.url ? (
                        <img
                          src={item.images[0].url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="1.5" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      )}
                    </div>
                  </td>

                  {/* Details */}
                  <td className="px-4 py-6">
                    <p className="text-[16px] font-bold text-[#1A1C1C] leading-6 truncate">
                      {item.title}
                    </p>
                    <p className="text-[12px] font-medium text-[#474747] mt-1 tracking-[0.3px]">
                      Category: {item.category?.name ?? "UMUM"}
                    </p>
                  </td>

                  {/* Seller */}
                  <td className="px-4 py-6">
                    <span className="text-[14px] font-medium text-[#1A1C1C] truncate block">
                      {item.seller?.name ?? "—"}
                    </span>
                  </td>

                  {/* Uploaded */}
                  <td className="px-4 py-6">
                    <span className="text-[14px] font-normal text-[#474747]">
                      {getTimeAgo(item.createdAt)}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-6 text-right">
                    <button
                      onClick={() => router.push(`/admin/queue`)}
                      className="inline-flex items-center gap-1.5 bg-black hover:bg-zinc-900 active:scale-[0.98] text-[#E5E2E1] text-[12px] font-bold uppercase tracking-[0.6px] px-6 py-2 rounded-[2px] transition-all whitespace-nowrap"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Review
                    </button>
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
"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { Search, Loader2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAdminInventory, adminUpdateProductStatus } from "@/modules/admin/actions";

const TABS = [
    { id: "ALL", label: "All" },
    { id: "PENDING", label: "Pending" },
    { id: "APPROVED", label: "Approved" },
    { id: "REJECTED", label: "Rejected" },
];

const PAGE_SIZE = 20;

function StatusBadge({ status }) {
    if (status === "APPROVED") {
        return (
            <span
                className="inline-flex items-center px-2 py-1 rounded-[2px] text-[#474747]"
                style={{
                    fontSize: 12, fontWeight: 500, lineHeight: "16px",
                    outline: "1px rgba(198,198,198,0.50) solid",
                }}
            >
                Approved
            </span>
        );
    }
    if (status === "PENDING") {
        return (
            <span
                className="inline-flex items-center px-2 py-1 rounded-[2px] bg-[#E2E2E2] text-[#474747]"
                style={{
                    fontSize: 12, fontWeight: 500, lineHeight: "16px",
                    outline: "1px rgba(198,198,198,0.50) solid",
                }}
            >
                Pending
            </span>
        );
    }
    // REJECTED
    return (
        <span
            className="inline-flex items-center px-2 py-1 rounded-[2px] text-[#BA1A1A]"
            style={{
                fontSize: 12, fontWeight: 500, lineHeight: "16px",
                outline: "1px rgba(186,26,26,0.50) solid",
            }}
        >
            Rejected
        </span>
    );
}

export default function AdminInventoryPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("ALL");

    const fetchInventory = async (p = 1, tab = activeTab) => {
        setLoading(true);
        try {
            const res = await getAdminInventory({
                page: p,
                limit: PAGE_SIZE,
                status: tab === "ALL" ? null : tab,
            });
            if (res.success) {
                if (p === 1) setProducts(res.data);
                else setProducts((prev) => [...prev, ...res.data]);
                setTotalEntries(res.total ?? res.data.length);
                setHasMore(res.data.length >= PAGE_SIZE);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInventory(1, "ALL"); }, []);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setPage(1);
        fetchInventory(1, tabId);
    };

    const handleUpdateStatus = async (id, status) => {
        const confirmMsg =
            status === "APPROVED"
                ? "Setujui produk ini agar tayang ke publik?"
                : "Turunkan/tolak produk ini?";
        if (!confirm(confirmMsg)) return;
        try {
            const res = await adminUpdateProductStatus({
                productId: id,
                status,
                note:
                    status === "APPROVED"
                        ? "Approved from inventory list"
                        : "Taken down from inventory list",
            });
            if (res.success) {
                setProducts((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, status } : p))
                );
            } else {
                alert(res.error || "Gagal memperbarui status");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan.");
        }
    };

    const filteredProducts = products.filter(
        (p) =>
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.seller?.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.seller?.email?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination (client-side slice for display)
    const ITEMS_PER_PAGE = PAGE_SIZE;
    const totalPages = Math.ceil(totalEntries / ITEMS_PER_PAGE);
    const displayPage = page;

    return (
        <>
            <div
                className="flex items-center justify-between px-8 py-4 -mx-16 -mt-16 mb-12"
                style={{ background: "#F3F3F3" }}
            >
                {/* Search */}
                <div
                    className="flex items-center gap-2 px-4 py-2 w-96"
                    style={{ background: "#E8E8E8", borderRadius: 12 }}
                >
                    <Search className="w-[18px] h-[18px] text-[#474747] flex-shrink-0" strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="Search inventory..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-[14px] text-[#474747] font-normal outline-none placeholder-[#474747]"
                    />
                </div>

                {/* Right icons */}
                <div className="flex items-center gap-6">
                    <div
                        className="w-8 h-8 overflow-hidden flex-shrink-0"
                        style={{ borderRadius: 12, border: "1px rgba(198,198,198,0.20) solid" }}
                    >
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#E2E2E2] flex items-center justify-center text-[10px] font-bold text-[#777]">
                                {session?.user?.name?.charAt(0) ?? "A"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Header ── */}
            <div className="mb-12 flex flex-col gap-2">
                <h1
                    className="text-[#1A1C1C] leading-[55px]"
                    style={{ fontSize: 44, fontWeight: 700 }}
                >
                    Inventory Moderation
                </h1>
                <p
                    className="text-[#474747]"
                    style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px" }}
                >
                    Review and manage all user-submitted products across the marketplace.
                </p>
            </div>

            {/* ── Filter tab bar ── */}
            <div
                className="flex items-center justify-between p-2 rounded-[4px] mb-12"
                style={{ background: "#F3F3F3" }}
            >
                {/* Tabs */}
                <div className="flex items-center gap-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className="px-4 py-2 rounded-[2px] transition-all"
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                lineHeight: "20px",
                                background: activeTab === tab.id ? "white" : "transparent",
                                color: activeTab === tab.id ? "#1A1C1C" : "#474747",
                                boxShadow:
                                    activeTab === tab.id
                                        ? "0px 1px 2px rgba(0,0,0,0.05)"
                                        : "none",
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-[4px] overflow-hidden">
                {loading && filteredProducts.length === 0 ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-200" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="py-20 text-center text-[#777777] text-sm italic font-medium">
                        Tidak ada produk dalam daftar ini.
                    </div>
                ) : (
                    <table className="w-full border-collapse text-left table-fixed">
                        <colgroup>
                            <col />                          {/* Product — auto */}
                            <col className="w-[115px]" />    {/* Seller ID */}
                            <col className="w-[122px]" />    {/* Category */}
                            <col className="w-[120px]" />    {/* Status */}
                            <col className="w-[198px]" />    {/* Actions */}
                        </colgroup>

                        <thead>
                            <tr className="bg-[#F3F3F3]">
                                {["Product", "Seller ID", "Category", "Status"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-4 text-[#474747] text-left"
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            letterSpacing: "1.2px",
                                            lineHeight: "16px",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                                <th
                                    className="px-4 py-4 text-[#474747] text-right"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 600,
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
                            {filteredProducts.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-t border-[#E8E8E8] hover:bg-gray-50/40 transition-colors"
                                >
                                    {/* Product */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 bg-[#E2E2E2] flex items-center justify-center flex-shrink-0 overflow-hidden rounded-[2px]"
                                                style={{ outline: "1px rgba(119,119,119,0.20) solid" }}
                                            >
                                                {p.images?.[0]?.url ? (
                                                    <img
                                                        src={p.images[0].url}
                                                        alt={p.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(119,119,119,0.50)" strokeWidth="1.5">
                                                        <rect x="3" y="3" width="18" height="18" rx="1.5" />
                                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                                        <path d="M21 15l-5-5L5 21" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p
                                                    className="text-[#1A1C1C]"
                                                    style={{ fontSize: 14, fontWeight: 700, lineHeight: "20px" }}
                                                >
                                                    {p.title}
                                                </p>
                                                <p
                                                    className="text-[#474747] mt-0.5"
                                                    style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px" }}
                                                >
                                                    Listed:{" "}
                                                    {p.createdAt
                                                        ? new Date(p.createdAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Seller ID */}
                                    <td className="px-4 py-4">
                                        <span
                                            className="text-[#474747]"
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 400,
                                                lineHeight: "16px",
                                                fontFamily: "Poppins, sans-serif",
                                            }}
                                        >
                                            USR-{p.sellerId?.slice(0, 4).toUpperCase() ?? "NULL"}
                                        </span>
                                    </td>

                                    {/* Category */}
                                    <td className="px-4 py-4">
                                        <span
                                            className="text-[#474747]"
                                            style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px" }}
                                        >
                                            {p.category?.name ?? "UMUM"}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-4">
                                        <StatusBadge status={p.status} />
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* View Product Link (Eye Icon Button) */}
                                            <button
                                                onClick={() => {
                                                    const url = p.status === "APPROVED" || p.status === "SOLD"
                                                        ? `/product/${p.id}`
                                                        : `/product/detail/${p.id}`;
                                                    router.push(url);
                                                }}
                                                className="p-1.5 rounded-[2px] hover:bg-gray-100 transition-all text-[#474747] border border-[rgba(119,119,119,0.30)] flex items-center justify-center active:scale-[0.98]"
                                                title="View Product"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            {/* Edit button for admin's own products */}
                                            {p.seller?.email && session?.user?.email && p.seller.email === session.user.email && (
                                                <button
                                                    onClick={() => router.push(`/product/edit/${p.id}`)}
                                                    className="px-3 py-1.5 rounded-[2px] bg-white transition-all hover:bg-gray-50 active:scale-[0.98]"
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: 500,
                                                        color: "#1A1C1C",
                                                        outline: "1px rgba(119,119,119,0.40) solid",
                                                    }}
                                                >
                                                    {p.status === "REJECTED" ? "Edit & Post" : "Edit"}
                                                </button>
                                            )}

                                            {p.status === "APPROVED" && (
                                                <button
                                                    onClick={() => handleUpdateStatus(p.id, "REJECTED")}
                                                    className="px-3 py-1.5 rounded-[2px] transition-all hover:bg-gray-50 active:scale-[0.98]"
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: 500,
                                                        color: "#1A1C1C",
                                                        outline: "1px rgba(119,119,119,0.40) solid",
                                                    }}
                                                >
                                                    Take Down
                                                </button>
                                            )}

                                            {p.status === "PENDING" && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(p.id, "APPROVED")}
                                                        className="px-3 py-1.5 rounded-[2px] bg-black hover:bg-zinc-900 active:scale-[0.98] transition-all"
                                                        style={{
                                                            fontSize: 12,
                                                            fontWeight: 500,
                                                            color: "#E5E2E1",
                                                            lineHeight: "16px",
                                                        }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(p.id, "REJECTED")}
                                                        className="px-3 py-1.5 rounded-[2px] transition-all hover:bg-gray-50 active:scale-[0.98]"
                                                        style={{
                                                            fontSize: 12,
                                                            fontWeight: 500,
                                                            color: "#1A1C1C",
                                                            outline: "1px rgba(119,119,119,0.40) solid",
                                                        }}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {p.status === "REJECTED" && (!p.seller?.email || !session?.user?.email || p.seller.email !== session.user.email) && (
                                                <button
                                                    onClick={() => router.push("/admin/queue")}
                                                    className="px-3 py-1.5 rounded-[2px] transition-all hover:bg-gray-50 active:scale-[0.98]"
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: 500,
                                                        color: "#1A1C1C",
                                                        outline: "1px rgba(119,119,119,0.40) solid",
                                                    }}
                                                >
                                                    View Queue
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* ── Pagination ── */}
                {!loading && filteredProducts.length > 0 && (
                    <div
                        className="flex items-center justify-between px-4 py-4 border-t border-[#E8E8E8]"
                        style={{ background: "#F3F3F3" }}
                    >
                        <span
                            className="text-[#474747]"
                            style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px" }}
                        >
                            Showing 1 to {filteredProducts.length} of {totalEntries} entries
                        </span>

                        <div className="flex items-center gap-1">
                            {/* Prev */}
                            <button
                                onClick={() => { if (displayPage > 1) { setPage(displayPage - 1); fetchInventory(displayPage - 1); } }}
                                disabled={displayPage <= 1}
                                className="p-2 rounded-[2px] disabled:opacity-40 transition-all hover:bg-gray-200/60"
                                style={{ outline: "1px rgba(198,198,198,0.40) solid" }}
                            >
                                <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
                                    <path d="M4 1L1 4L4 7" stroke="#474747" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: Math.min(totalPages || 1, 3) }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    onClick={() => { setPage(n); fetchInventory(n); }}
                                    className="px-3 py-2 rounded-[2px] transition-all"
                                    style={{
                                        fontSize: 14,
                                        fontWeight: n === displayPage ? 500 : 400,
                                        lineHeight: "20px",
                                        color: n === displayPage ? "#1A1C1C" : "#474747",
                                        background: n === displayPage ? "#E2E2E2" : "transparent",
                                    }}
                                >
                                    {n}
                                </button>
                            ))}

                            {/* Next */}
                            <button
                                onClick={() => { if (hasMore) { const next = displayPage + 1; setPage(next); fetchInventory(next); } }}
                                disabled={!hasMore}
                                className="p-2 rounded-[2px] disabled:opacity-40 transition-all hover:bg-gray-200/60"
                                style={{ outline: "1px rgba(198,198,198,0.40) solid" }}
                            >
                                <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
                                    <path d="M1 1L4 4L1 7" stroke="#474747" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
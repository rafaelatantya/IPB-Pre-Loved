import React from "react";
import { getAdminLogs } from "@/modules/admin/actions";
import {
    Clock,
    ShieldCheck,
    UserMinus,
    UserPlus,
    Tag,
    Trash2,
    Eye,
    AlertTriangle,
    ShieldAlert
} from "lucide-react";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const actionIcons = {
    "REVIEW_PRODUCT": { icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
    "BLOCK_USER": { icon: UserMinus, color: "text-red-600", bg: "bg-red-50" },
    "UNBLOCK_USER": { icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
    "FLAG_USER": { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
    "UNFLAG_USER": { icon: Eye, color: "text-neutral-600", bg: "bg-neutral-50" },
    "CHANGE_USER_ROLE": { icon: ShieldAlert, color: "text-purple-600", bg: "bg-purple-50" },
    "DELETE_USER": { icon: Trash2, color: "text-red-600", bg: "bg-red-50" },
};

export default async function AdminLogsPage() {
    const { success, data: logs, error } = await getAdminLogs();

    if (!success) {
        return (
            <div className="p-8 text-center text-red-500 font-poppins text-sm">
                Gagal memuat log: {error}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-neutral-100 pb-5">
                <h1 className="font-poppins text-2xl font-bold text-[#1c1c1c] tracking-tight">
                    Activity Logs
                </h1>
                <p className="font-poppins text-sm text-[#737373]">
                    Riwayat aktivitas administratif sistem (Audit Trail).
                </p>
            </div>

            {/* Logs Table Wrapper */}
            <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead className="bg-neutral-50/75 border-b border-neutral-200">
                            <tr>
                                <th className="w-[18%] px-6 py-3.5 font-poppins text-xs font-semibold text-[#474747] tracking-tight">Waktu</th>
                                <th className="w-[22%] px-6 py-3.5 font-poppins text-xs font-semibold text-[#474747] tracking-tight">Admin</th>
                                <th className="w-[18%] px-6 py-3.5 font-poppins text-xs font-semibold text-[#474747] tracking-tight">Aksi</th>
                                <th className="w-[14%] px-6 py-3.5 font-poppins text-xs font-semibold text-[#474747] tracking-tight">Target ID</th>
                                <th className="w-[28%] px-6 py-3.5 font-poppins text-xs font-semibold text-[#474747] tracking-tight">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-neutral-400 font-poppins text-sm">
                                        Belum ada aktivitas yang tercatat.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => {
                                    const actionInfo = actionIcons[log.action] || {
                                        icon: Tag,
                                        color: "text-neutral-500",
                                        bg: "bg-neutral-50"
                                    };
                                    const Icon = actionInfo.icon;

                                    return (
                                        <tr key={log.id} className="hover:bg-neutral-50/40 transition-colors">
                                            {/* Waktu */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-[#474747] font-poppins text-xs font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                                                    <span>
                                                        {new Date(log.createdAt).toLocaleString("id-ID", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Admin */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-poppins text-xs font-semibold text-[#1c1c1c] truncate">
                                                        {log.admin?.name || "Unknown Admin"}
                                                    </span>
                                                    <span className="font-poppins text-[11px] text-[#737373] truncate">
                                                        {log.admin?.email || "-"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${actionInfo.bg} ${actionInfo.color}`}>
                                                    <Icon className="w-3 h-3 flex-shrink-0" />
                                                    <span className="font-poppins text-[11px] font-semibold tracking-tight">
                                                        {log.action ? log.action.replace(/_/g, " ") : ""}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Target ID */}
                                            <td className="px-6 py-4">
                                                {log.targetId ? (
                                                    <code className="font-mono text-[11px] text-[#737373] bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-200/60">
                                                        {log.targetId.slice(0, 8)}...
                                                    </code>
                                                ) : (
                                                    <span className="font-poppins text-xs text-neutral-400">—</span>
                                                )}
                                            </td>

                                            {/* Detail */}
                                            <td className="px-6 py-4">
                                                <p className="font-poppins text-xs text-[#474747] line-clamp-2 break-words leading-relaxed" title={log.details}>
                                                    {log.details || "Tidak ada detail tambahan."}
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
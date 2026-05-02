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
    "REVIEW_PRODUCT": { icon: ShieldCheck, color: "text-green-500", bg: "bg-green-50" },
    "BLOCK_USER": { icon: UserMinus, color: "text-red-500", bg: "bg-red-50" },
    "UNBLOCK_USER": { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50" },
    "FLAG_USER": { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50" },
    "UNFLAG_USER": { icon: Eye, color: "text-gray-500", bg: "bg-gray-50" },
    "CHANGE_USER_ROLE": { icon: ShieldAlert, color: "text-purple-500", bg: "bg-purple-50" },
    "DELETE_USER": { icon: Trash2, color: "text-red-600", bg: "bg-red-100" },
};

export default async function AdminLogsPage() {
    const { success, data: logs, error } = await getAdminLogs();

    if (!success) {
        return (
            <div className="p-8 text-center text-red-500">
                Gagal memuat log: {error}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">
                    Activity Logs
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Riwayat aktivitas administratif sistem (Audit Trail).
                </p>
            </div>

            {/* Logs Timeline/Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Target ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic text-sm">
                                        Belum ada aktivitas yang tercatat.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => {
                                    const actionInfo = actionIcons[log.action] || { 
                                        icon: Tag, 
                                        color: "text-gray-400", 
                                        bg: "bg-gray-50" 
                                    };
                                    const Icon = actionInfo.icon;

                                    return (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(log.createdAt).toLocaleString("id-ID", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-900">{log.admin?.name}</span>
                                                    <span className="text-[10px] text-gray-400 tracking-tight">{log.admin?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${actionInfo.bg} ${actionInfo.color}`}>
                                                    <Icon className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">
                                                        {log.action.replace(/_/g, " ")}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                                    {log.targetId?.slice(0, 8)}...
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs text-gray-600 line-clamp-1 max-w-[200px]" title={log.details}>
                                                    {log.details}
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

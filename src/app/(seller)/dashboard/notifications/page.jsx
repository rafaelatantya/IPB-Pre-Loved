import React from "react";
import NotificationList from "@/modules/notification/components/NotificationList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Semua Notifikasi</h1>
          <p className="text-sm text-gray-500 mt-1">Lihat riwayat persetujuan produk dan aktivitas akun Anda.</p>
        </div>
      </div>

      <NotificationList limit={0} showHeader={false} />
    </div>
  );
}

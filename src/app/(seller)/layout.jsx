import React from "react";
import AdminSidebar from "@/components/layouts/adminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <AdminSidebar /> -- Jangan dihapus incase perlu, sementara di-comment buat penjual */}
      <main className="flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
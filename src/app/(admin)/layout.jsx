import React from "react";
import AdminSidebar from "@/components/layouts/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-[240px] p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
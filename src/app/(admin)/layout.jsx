import React from "react";
import AdminSidebar from "@/components/layouts/adminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <AdminSidebar />
      <main className="ml-[288px] min-h-screen px-16 py-16 font-sans text-[#1A1C1C]">
        {children}
      </main>
    </div>
  );
}
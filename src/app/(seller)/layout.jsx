import React from "react";
import Sidebar from "@/components/layouts/Sidebar";
import AdminSidebar from "@/components/layouts/adminSidebar";
import { getAuth } from "@/lib/auth";

export default async function SellerLayout({ children }) {
  const auth = await getAuth();
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#F9F9F9]">
        <AdminSidebar />
        <main className="ml-[288px] min-h-screen px-16 py-16 font-sans text-[#1A1C1C]">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="seller" />
      <main className="flex-1 p-8 min-h-screen md:ml-[240px]">
        {children}
      </main>
    </div>
  );
}
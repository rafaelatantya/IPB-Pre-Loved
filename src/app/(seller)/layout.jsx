import React from "react";
import Sidebar from "@/components/layouts/Sidebar";

export default function SellerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="seller" />
      <main className="flex-1 p-8 min-h-screen md:ml-[240px]">
        {children}
      </main>
    </div>
  );
}
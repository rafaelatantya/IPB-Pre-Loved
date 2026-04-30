"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

// Placeholder gambar produk
function ImagePlaceholder() {
  return (
    <div className="w-[56px] h-[56px] border border-gray-200 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#bbb"
        strokeWidth="1"
      >
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M3 9l4-4 4 4 4-4 4 4" />
        <circle cx="8.5" cy="13.5" r="1.5" />
      </svg>
    </div>
  );
}

const QUEUE_ITEMS = [
  {
    id: 1,
    name: "Calculus Textbook 9th Ed",
    category: "Books",
    seller: "Budi Santoso",
    uploaded: "10 mins ago",
  },
  {
    id: 2,
    name: "Lab Coat (Size M)",
    category: "Clothing",
    seller: "Siti Aminah",
    uploaded: "1 hr ago",
  },
  {
    id: 3,
    name: "Drafting Table",
    category: "Furniture",
    seller: "Reza Rahadian",
    uploaded: "3 hrs ago",
  },
];

export default function AdminQueuePage() {
  const [items, setItems] = useState(QUEUE_ITEMS);
  const router = useRouter();

  function handleReview(id) {
    router.push(`/admin/queue/${id}`);
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Pending Validation Queue
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Review and approve new listings.
        </p>
      </div>

      {/* Stat Card - Needs QC Today */}
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Needs QC Today
          </p>
          <p className="text-5xl font-bold text-gray-900">{items.length}</p>
        </div>
        <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Tabel Antrean */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-5 py-3 w-[80px]">
                Item
              </th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-3">
                Details
              </th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-3 w-[160px]">
                Seller
              </th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-3 w-[120px]">
                Uploaded
              </th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-3 w-[110px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <ImagePlaceholder />
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Category: {item.category}
                  </p>
                </td>
                <td className="px-4 py-4 text-gray-600">{item.seller}</td>
                <td className="px-4 py-4 text-gray-400">{item.uploaded}</td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleReview(item.id)}
                    className="bg-gray-900 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
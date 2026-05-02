"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, XCircle, Check, Calendar } from "lucide-react";
import { getUserNotifications, markAsRead } from "@/modules/notification/actions";
import { useSession } from "next-auth/react";

export default function NotificationList({ limit = 5, showHeader = true }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadNotifications();
    }
  }, [session?.user?.id]);

  async function loadNotifications() {
    setLoading(true);
    const res = await getUserNotifications(session.user.id);
    if (res.success) {
      setNotifications(limit ? res.data.slice(0, limit) : res.data);
    }
    setLoading(false);
  }

  async function handleMarkAsRead(id) {
    const res = await markAsRead(id);
    if (res.success) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "WARNING": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "DANGER": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
        <div className="h-4 w-32 bg-gray-100 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/4 bg-gray-100 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notifications.length === 0) return null;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
      {showHeader && (
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-900" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Pemberitahuan Terbaru</h3>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {notifications.filter(n => !n.isRead).length} Belum Dibaca
          </span>
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`p-5 flex gap-4 transition-colors hover:bg-gray-50/80 ${!n.isRead ? "bg-blue-50/20" : ""}`}
          >
            <div className="mt-1 shrink-0">
              <div className={`p-2 rounded-xl ${!n.isRead ? "bg-white shadow-sm" : "bg-gray-50"}`}>
                {getIcon(n.type)}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className={`text-sm font-bold tracking-tight ${!n.isRead ? "text-gray-900" : "text-gray-600"}`}>
                    {n.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
                {!n.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(n.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Check className="w-3 h-3" />
                    TANDAI BACA
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400 font-medium">
                <Calendar className="w-3 h-3" />
                {new Date(n.createdAt).toLocaleDateString("id-ID", { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

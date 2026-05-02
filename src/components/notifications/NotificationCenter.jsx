"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, XCircle, Check } from "lucide-react";
import Link from "next/link";
import { getUserNotifications, markAsRead } from "@/modules/notification/actions";
import { useSession } from "next-auth/react";

export default function NotificationCenter() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (session?.user?.id) {
      loadNotifications();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadNotifications() {
    const res = await getUserNotifications(session.user.id);
    if (res.success) {
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    }
  }

  async function handleMarkAsRead(id) {
    const res = await markAsRead(id);
    if (res.success) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "WARNING": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "DANGER": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden z-[60]">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Notifikasi</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                {unreadCount} Baru
              </span>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-medium">Belum ada notifikasi</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b border-gray-50 flex gap-3 transition-colors hover:bg-gray-50 ${!n.isRead ? "bg-blue-50/30" : ""}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-xs font-bold leading-tight ${!n.isRead ? "text-gray-900" : "text-gray-600"}`}>
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-[10px] text-blue-600 hover:underline font-bold flex items-center gap-0.5 shrink-0"
                        >
                          <Check className="w-3 h-3" />
                          Baca
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {new Date(n.createdAt).toLocaleDateString("id-ID", { 
                        day: 'numeric', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-gray-100 bg-gray-50/50">
            <Link 
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="w-full block text-center py-2 text-[10px] font-bold text-gray-400 uppercase hover:text-gray-600 transition-colors"
            >
              Lihat Semua
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

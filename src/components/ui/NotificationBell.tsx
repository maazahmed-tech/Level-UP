"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
  SYSTEM: "bell",
  REMINDER: "clock",
  ACHIEVEMENT: "trophy",
  MESSAGE: "chat",
  ALERT: "warning",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotifIcon({ type }: { type: string }) {
  const icon = TYPE_ICONS[type] || "bell";

  if (icon === "clock") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  if (icon === "trophy") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
        <path d="M18 2H6v7a6 6 0 0012 0V2z" />
      </svg>
    );
  }
  if (icon === "chat") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    );
  }
  if (icon === "warning") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  // Default bell
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?count=true");
      if (res.ok) {
        const data = await res.json();
        setCount(data.count || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleOpen() {
    setOpen(!open);
    if (!open) {
      setLoading(true);
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
  }

  async function markAsRead(id: number) {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setCount(0);
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 text-white/50 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#E51A1A] text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[320px] bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2A]">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {count > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-[#E51A1A] font-semibold bg-transparent border-none cursor-pointer hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-white/30 text-sm">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-white/30 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-none cursor-pointer ${
                    n.isRead
                      ? "bg-transparent"
                      : "bg-[#E51A1A]/5 hover:bg-[#E51A1A]/10"
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    n.isRead ? "bg-[#2A2A2A] text-white/30" : "bg-[#E51A1A]/20 text-[#E51A1A]"
                  }`}>
                    <NotifIcon type={n.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${n.isRead ? "text-white/50" : "text-white"}`}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-white/40 line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-white/20 mt-1">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="mt-2 w-2 h-2 rounded-full bg-[#E51A1A] shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

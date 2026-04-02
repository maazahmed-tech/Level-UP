"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const sidebarLinks = [
  { href: "/hub", label: "Dashboard" },
  { href: "/hub/feed", label: "Feed" },
  { href: "/hub/recipes", label: "Recipes" },
  { href: "/hub/workouts", label: "Workouts" },
  { href: "/hub/restaurants", label: "Restaurants" },
  { href: "/hub/calculator", label: "Calculator" },
  { href: "/hub/snap-my-macros", label: "Meal Tracker" },
  { href: "/hub/progress", label: "Progress" },
  { href: "/hub/analytics", label: "Analytics" },
  { href: "/hub/favourites", label: "Favourites" },
  { href: "/hub/messages", label: "Messages" },
  { href: "/hub/settings", label: "Settings" },
];

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-70px)]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center text-2xl border-none cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? "\u2715" : "\u2630"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-[70px] left-0 h-[calc(100vh-70px)] w-[260px] bg-[#1E1E1E] border-r border-[#222] flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Hub branding */}
        <div className="p-6 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.svg" alt="Level Up" width={32} height={32} className="rounded-full" />
            <div>
              <p className="font-bold text-sm">The Hub</p>
              <p className="text-xs text-white/40">by Level Up</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/hub" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-r-3 border-primary"
                    : "text-white/60 hover:bg-dark/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#222]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-white/50 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 bg-light min-h-full">
        <div className="p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/recipes", label: "Recipes" },
  { href: "/admin/workouts", label: "Workouts" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/restaurants", label: "Restaurants" },
  { href: "/admin/food-database", label: "Food Database" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/signup-requests", label: "Signup Requests" },
  { href: "/admin/feed", label: "Feed" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/assets", label: "Assets" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen">
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
        className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-dark flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Admin branding */}
        <div className="p-6 border-b border-white/10">
          <p className="font-black text-lg tracking-widest text-white">LEVEL UP</p>
          <p className="text-xs text-white/50 mt-0.5">Admin Panel</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-r-3 border-primary"
                    : "text-white/60 hover:text-white/80 hover:bg-[#1E1E1E]/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-[#1E1E1E]/5 rounded-lg transition-colors"
          >
            &larr; Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-[#1E1E1E]/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 bg-light min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

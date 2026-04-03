"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NotificationBell from "@/components/ui/NotificationBell";

const sidebarLinks = [
  { href: "/hub", label: "Dashboard" },
  { href: "/hub/feed", label: "Feed" },
  { href: "/hub/recipes", label: "Recipes" },
  { href: "/hub/workouts", label: "Workouts" },
  { href: "/hub/restaurants", label: "Restaurants" },
  { href: "/hub/calculator", label: "Calculator" },
  { href: "/hub/food-chart", label: "Food Chart" },
  { href: "/hub/snap-my-macros", label: "Meal Tracker" },
  { href: "/hub/progress", label: "Progress" },
  { href: "/hub/analytics", label: "Analytics" },
  { href: "/hub/steps", label: "Steps" },
  { href: "/hub/favourites", label: "Favourites" },
  { href: "/hub/messages", label: "Messages" },
  { href: "/hub/settings", label: "Settings" },
];

interface DashboardStats {
  mealTotals?: { calories: number };
  targets?: { calories: number } | null;
  user?: { firstName: string; lastName: string } | null;
}

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [initials, setInitials] = useState("");
  const [caloriesEaten, setCaloriesEaten] = useState(0);
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    // Fetch user info
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          const fn = data.user.firstName || "";
          const ln = data.user.lastName || "";
          setUserName(`${fn} ${ln}`.trim());
          setInitials(
            `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase()
          );
        }
      })
      .catch(() => {});

    // Fetch dashboard stats
    fetch("/api/user/dashboard")
      .then((r) => r.json())
      .then((data: DashboardStats) => {
        if (data.mealTotals) {
          setCaloriesEaten(data.mealTotals.calories || 0);
        }
        if (data.targets) {
          setCalorieTarget(data.targets.calories || 2000);
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const calPercent = Math.min(100, Math.round((caloriesEaten / calorieTarget) * 100));
  const stepPercent = Math.min(100, Math.round((steps / 10000) * 100));

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
        {/* User branding */}
        <div className="p-5 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E51A1A] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white truncate">
                {userName || "The Hub"}
              </p>
              <p className="text-xs text-white/40">Level Up Hub</p>
            </div>
            <NotificationBell />
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/hub" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${
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

        {/* Today's Stats */}
        <div className="px-5 py-4 border-t border-[#222] space-y-3">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
            Today
          </p>

          {/* Calories mini bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-white/50">Calories</span>
              <span className="text-[11px] text-white/70 font-semibold">
                {caloriesEaten} / {calorieTarget}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E51A1A] rounded-full transition-all"
                style={{ width: `${calPercent}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-white/50">Steps</span>
              <span className="text-[11px] text-white/70 font-semibold">
                {steps.toLocaleString()} / 10,000
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF6B00] rounded-full transition-all"
                style={{ width: `${stepPercent}%` }}
              />
            </div>
          </div>

          {/* Quick log buttons */}
          <div className="flex gap-2 pt-1">
            <Link
              href="/hub/snap-my-macros"
              className="flex-1 text-center text-[10px] font-semibold py-1.5 rounded-lg bg-[#E51A1A]/10 text-[#E51A1A] hover:bg-[#E51A1A]/20 transition-colors"
            >
              Log Meal
            </Link>
            <Link
              href="/hub/progress"
              className="flex-1 text-center text-[10px] font-semibold py-1.5 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] hover:bg-[#FF6B00]/20 transition-colors"
            >
              Log Weight
            </Link>
            <Link
              href="/hub/steps"
              className="flex-1 text-center text-[10px] font-semibold py-1.5 rounded-lg bg-[#FFB800]/10 text-[#FFB800] hover:bg-[#FFB800]/20 transition-colors"
            >
              Log Steps
            </Link>
          </div>
        </div>

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

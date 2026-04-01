"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  firstName: string;
  lastName: string;
  email: string;
};

const quickLinks = [
  { href: "/hub/recipes", label: "Browse Recipes", icon: "🍴", desc: "400+ macro-friendly recipes" },
  { href: "/hub/restaurants", label: "Restaurant Guides", icon: "🍽", desc: "Eat out without the guilt" },
  { href: "/hub/calculator", label: "Macro Calculator", icon: "🧮", desc: "Get your personalized targets" },
  { href: "/hub/snap-my-macros", label: "Snap My Macros", icon: "📷", desc: "Photo-based meal tracking" },
  { href: "/hub/progress", label: "Track Progress", icon: "📈", desc: "Log weight & photos" },
  { href: "/hub/settings", label: "Settings", icon: "⚙", desc: "Manage your account" },
];

export default function HubDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl font-black mb-2">
          Welcome back{user ? `, ${user.firstName}` : ""}! 👋
        </h1>
        <p className="text-white/50">
          Your Hub dashboard. Everything you need in one place.
        </p>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-[#1E1E1E] p-6 rounded-2xl shadow-card hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 group"
          >
            <div className="text-3xl mb-3">{link.icon}</div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
              {link.label}
            </h3>
            <p className="text-white/50 text-sm">{link.desc}</p>
          </Link>
        ))}
      </div>

      {/* Getting Started */}
      <div className="mt-10 bg-[#1E1E1E] rounded-2xl shadow-card p-8">
        <h2 className="text-xl font-bold mb-4">Getting Started</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-semibold text-sm">Set your macro targets</p>
              <p className="text-white/50 text-sm">
                Use the{" "}
                <Link href="/hub/calculator" className="text-primary font-semibold">
                  calculator
                </Link>{" "}
                to get personalized calorie and macro goals.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-semibold text-sm">Explore recipes</p>
              <p className="text-white/50 text-sm">
                Browse{" "}
                <Link href="/hub/recipes" className="text-primary font-semibold">
                  400+ recipes
                </Link>{" "}
                with full macro breakdowns and video guides.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-semibold text-sm">Track your meals</p>
              <p className="text-white/50 text-sm">
                Use{" "}
                <Link href="/hub/snap-my-macros" className="text-primary font-semibold">
                  Snap My Macros
                </Link>{" "}
                to log meals with a photo.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              4
            </div>
            <div>
              <p className="font-semibold text-sm">Monitor your progress</p>
              <p className="text-white/50 text-sm">
                Log your weight and upload photos in the{" "}
                <Link href="/hub/progress" className="text-primary font-semibold">
                  progress tracker
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

interface Client {
  id: string;
  name: string;
  email: string;
  activePlanName: string | null;
  planStatus: string;
  adherencePercent: number;
  weightChange: number | null;
  lastActivity: string | null;
  hoursSinceLastActivity: number | null;
}

type SortKey = "adherence" | "lastActive" | "name";

export default function ProgressOverviewClient({ clients }: { clients: Client[] }) {
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [search, setSearch] = useState("");

  const sorted = useMemo(() => {
    let filtered = clients;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = clients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.activePlanName && c.activePlanName.toLowerCase().includes(q))
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "adherence") return b.adherencePercent - a.adherencePercent;
      if (sortBy === "lastActive") {
        const aH = a.hoursSinceLastActivity ?? 99999;
        const bH = b.hoursSinceLastActivity ?? 99999;
        return aH - bH;
      }
      return a.name.localeCompare(b.name);
    });
  }, [clients, sortBy, search]);

  function adherenceColor(pct: number, hasPlan: boolean) {
    if (!hasPlan) return "bg-red-500/20 text-red-400";
    if (pct >= 80) return "bg-green-500/20 text-green-400";
    if (pct >= 50) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  }

  function adherenceBarColor(pct: number, hasPlan: boolean) {
    if (!hasPlan) return "bg-red-500/40";
    if (pct >= 80) return "bg-green-500";
    if (pct >= 50) return "bg-yellow-500";
    return "bg-red-500";
  }

  function formatLastActive(hours: number | null): string {
    if (hours === null) return "Never";
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Progress</h1>
          <p className="text-sm text-white/40 mt-1">
            Overview of all clients' plan adherence and activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="px-3 py-1.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E51A1A]/50 w-48"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="px-3 py-1.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E51A1A]/50"
          >
            <option value="name">Sort: Name</option>
            <option value="adherence">Sort: Adherence</option>
            <option value="lastActive">Sort: Last Active</option>
          </select>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4">
          <p className="text-xs text-white/40">Total Clients</p>
          <p className="text-2xl font-bold text-white">{clients.length}</p>
        </div>
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4">
          <p className="text-xs text-white/40">With Active Plan</p>
          <p className="text-2xl font-bold text-green-400">
            {clients.filter((c) => c.activePlanName).length}
          </p>
        </div>
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4">
          <p className="text-xs text-white/40">No Plan</p>
          <p className="text-2xl font-bold text-red-400">
            {clients.filter((c) => !c.activePlanName).length}
          </p>
        </div>
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4">
          <p className="text-xs text-white/40">Avg Adherence</p>
          <p className="text-2xl font-bold text-white">
            {clients.length > 0
              ? Math.round(
                  clients.reduce((s, c) => s + c.adherencePercent, 0) / clients.length
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Client Cards */}
      {sorted.length === 0 ? (
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-12 text-center">
          <p className="text-white/40">
            {search ? "No clients match your search" : "No clients found"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((c) => {
            const hasPlan = !!c.activePlanName;
            return (
              <Link
                key={c.id}
                href={`/admin/users/${c.id}`}
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#3A3A3A] transition-colors block"
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#E51A1A]/20 flex items-center justify-center text-[#E51A1A] font-bold text-sm flex-shrink-0">
                    {c.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{c.name}</p>
                    <p className="text-white/30 text-xs truncate">{c.email}</p>
                  </div>
                </div>

                {/* Plan */}
                <div className="mb-3">
                  <p className="text-xs text-white/40 mb-1">Plan</p>
                  <p className="text-sm text-white/70">
                    {c.activePlanName || (
                      <span className="text-red-400">No plan assigned</span>
                    )}
                  </p>
                </div>

                {/* Adherence */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-white/40">Weekly Adherence</p>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium ${adherenceColor(c.adherencePercent, hasPlan)}`}
                    >
                      {hasPlan ? `${c.adherencePercent}%` : "N/A"}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${adherenceBarColor(c.adherencePercent, hasPlan)}`}
                      style={{ width: `${hasPlan ? Math.min(c.adherencePercent, 100) : 0}%` }}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs">
                  {/* Weight Change */}
                  <div>
                    <p className="text-white/30">Weight</p>
                    <p
                      className={
                        c.weightChange === null
                          ? "text-white/40"
                          : c.weightChange < 0
                            ? "text-green-400"
                            : c.weightChange > 0
                              ? "text-red-400"
                              : "text-white/40"
                      }
                    >
                      {c.weightChange === null
                        ? "--"
                        : `${c.weightChange > 0 ? "+" : ""}${c.weightChange} kg`}
                    </p>
                  </div>

                  {/* Last Active */}
                  <div>
                    <p className="text-white/30">Last Active</p>
                    <p
                      className={
                        c.hoursSinceLastActivity === null
                          ? "text-red-400"
                          : c.hoursSinceLastActivity > 72
                            ? "text-red-400"
                            : c.hoursSinceLastActivity > 24
                              ? "text-yellow-400"
                              : "text-green-400"
                      }
                    >
                      {formatLastActive(c.hoursSinceLastActivity)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

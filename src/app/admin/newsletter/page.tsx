"use client";

import { useState, useMemo } from "react";

interface Subscriber {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  subscribed: string;
  active: boolean;
}

const MOCK_SUBSCRIBERS: Subscriber[] = [
  { id: 1, email: "sarah.m@email.com", firstName: "Sarah", lastName: "Mitchell", subscribed: "2025-11-02", active: true },
  { id: 2, email: "james.k@email.com", firstName: "James", lastName: "Kelly", subscribed: "2025-12-15", active: true },
  { id: 3, email: "emily.r@email.com", firstName: "Emily", lastName: "Roberts", subscribed: "2025-10-08", active: true },
  { id: 4, email: "tom.h@email.com", firstName: "Tom", lastName: "Hughes", subscribed: "2025-09-20", active: true },
  { id: 5, email: "laura.p@email.com", firstName: "Laura", lastName: "Price", subscribed: "2026-01-05", active: true },
  { id: 6, email: "chris.w@email.com", firstName: "Chris", lastName: "Walsh", subscribed: "2025-08-14", active: false },
  { id: 7, email: "hannah.b@email.com", firstName: "Hannah", lastName: "Brady", subscribed: "2026-02-01", active: true },
  { id: 8, email: "david.l@email.com", firstName: "David", lastName: "Lynch", subscribed: "2025-07-22", active: true },
  { id: 9, email: "fiona.g@email.com", firstName: "Fiona", lastName: "Gallagher", subscribed: "2025-11-18", active: true },
  { id: 10, email: "ryan.o@email.com", firstName: "Ryan", lastName: "O'Brien", subscribed: "2026-01-20", active: true },
  { id: 11, email: "megan.t@email.com", firstName: "Megan", lastName: "Taylor", subscribed: "2025-12-01", active: false },
  { id: 12, email: "alex.n@email.com", firstName: "Alex", lastName: "Nolan", subscribed: "2025-10-30", active: true },
  { id: 13, email: "sophie.c@email.com", firstName: "Sophie", lastName: "Clarke", subscribed: "2026-02-14", active: true },
  { id: 14, email: "daniel.f@email.com", firstName: "Daniel", lastName: "Fitzpatrick", subscribed: "2025-09-05", active: true },
  { id: 15, email: "amy.j@email.com", firstName: "Amy", lastName: "Jordan", subscribed: "2026-03-01", active: true },
  { id: 16, email: "ben.s@email.com", firstName: "Ben", lastName: "Sullivan", subscribed: "2025-11-25", active: true },
  { id: 17, email: "katie.v@email.com", firstName: "Katie", lastName: "Vaughan", subscribed: "2026-01-10", active: true },
  { id: 18, email: "michael.p@email.com", firstName: "Michael", lastName: "Power", subscribed: "2025-08-30", active: false },
  { id: 19, email: "chloe.a@email.com", firstName: "Chloe", lastName: "Adams", subscribed: "2026-02-20", active: true },
  { id: 20, email: "mark.d@email.com", firstName: "Mark", lastName: "Doyle", subscribed: "2025-10-15", active: true },
];

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(MOCK_SUBSCRIBERS);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return subscribers;
    const q = search.toLowerCase();
    return subscribers.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q)
    );
  }, [search, subscribers]);

  function handleRemove(id: number) {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  }

  function handleExportCSV() {
    const headers = ["Email", "First Name", "Last Name", "Subscribed", "Active"];
    const rows = subscribers.map((s) => [
      s.email,
      s.firstName,
      s.lastName,
      s.subscribed,
      s.active ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter Subscribers</h1>
          <p className="text-sm text-white/50 mt-1">{subscribers.length} total subscribers</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer border-none"
        >
          Export CSV
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by email or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2.5 rounded-xl border border-[#222] bg-[#1E1E1E] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Table */}
      <div className="bg-[#1E1E1E] rounded-2xl shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-dark/5 text-left">
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Email</th>
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Name</th>
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Subscribed</th>
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/30">
                  No subscribers found.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-[#1A1A1A] hover:bg-dark/2 transition-colors">
                  <td className="px-6 py-3 text-white">{sub.email}</td>
                  <td className="px-6 py-3 text-white/60">
                    {sub.firstName} {sub.lastName}
                  </td>
                  <td className="px-6 py-3 text-white/50">{formatDate(sub.subscribed)}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        sub.active ? "bg-green-100 text-green-700" : "bg-dark/10 text-white/30"
                      }`}
                    >
                      {sub.active ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleRemove(sub.id)}
                      className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors cursor-pointer border-none"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

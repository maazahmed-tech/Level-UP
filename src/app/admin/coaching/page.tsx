"use client";

import { useState, useMemo } from "react";

type Status = "Pending" | "Reviewed" | "Approved" | "Rejected";

interface Application {
  id: number;
  name: string;
  email: string;
  goal: string;
  experience: string;
  submitted: string;
  status: Status;
  message: string;
  currentWeight: string;
  targetWeight: string;
}

const MOCK_APPLICATIONS: Application[] = [
  { id: 1, name: "James Kelly", email: "james.k@email.com", goal: "Weight Loss", experience: "Beginner", submitted: "2026-03-28", status: "Pending", message: "I've been struggling with my weight for years. Looking for a structured plan to lose 15kg.", currentWeight: "95kg", targetWeight: "80kg" },
  { id: 2, name: "Sophie Clarke", email: "sophie.c@email.com", goal: "Body Recomposition", experience: "Intermediate", submitted: "2026-03-27", status: "Pending", message: "I've been training for 2 years but want to lean out while building muscle. Need help with nutrition.", currentWeight: "68kg", targetWeight: "65kg" },
  { id: 3, name: "Amy Jordan", email: "amy.j@email.com", goal: "Weight Loss", experience: "Beginner", submitted: "2026-03-25", status: "Pending", message: "Post-pregnancy weight loss. Want to get back in shape safely.", currentWeight: "78kg", targetWeight: "62kg" },
  { id: 4, name: "Ryan O'Brien", email: "ryan.o@email.com", goal: "Muscle Gain", experience: "Intermediate", submitted: "2026-03-20", status: "Reviewed", message: "Want to bulk up properly with a clean diet and progressive overload programme.", currentWeight: "75kg", targetWeight: "85kg" },
  { id: 5, name: "Megan Taylor", email: "megan.t@email.com", goal: "Weight Loss", experience: "Beginner", submitted: "2026-03-15", status: "Approved", message: "Ready to commit fully. I've tried everything else and need proper coaching.", currentWeight: "82kg", targetWeight: "65kg" },
  { id: 6, name: "Daniel Fitzpatrick", email: "daniel.f@email.com", goal: "Athletic Performance", experience: "Advanced", submitted: "2026-03-10", status: "Approved", message: "Training for a triathlon. Need help optimising my nutrition around training sessions.", currentWeight: "80kg", targetWeight: "78kg" },
  { id: 7, name: "Laura Price", email: "laura.p@email.com", goal: "Weight Loss", experience: "Beginner", submitted: "2026-03-05", status: "Rejected", message: "Looking for a quick fix diet plan.", currentWeight: "90kg", targetWeight: "60kg" },
  { id: 8, name: "Chris Walsh", email: "chris.w@email.com", goal: "Body Recomposition", experience: "Intermediate", submitted: "2026-02-28", status: "Reviewed", message: "Want to cut from 18% to 12% body fat while maintaining strength.", currentWeight: "88kg", targetWeight: "82kg" },
];

const statusColors: Record<Status, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Reviewed: "bg-blue-100 text-blue-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
};

const ALL_STATUSES: (Status | "All")[] = ["All", "Pending", "Reviewed", "Approved", "Rejected"];

export default function AdminCoachingPage() {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});
  const [saveMessage, setSaveMessage] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filterStatus === "All") return applications;
    return applications.filter((a) => a.status === filterStatus);
  }, [applications, filterStatus]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: applications.length };
    for (const s of ["Pending", "Reviewed", "Approved", "Rejected"]) {
      c[s] = applications.filter((a) => a.status === s).length;
    }
    return c;
  }, [applications]);

  const selected = applications.find((a) => a.id === selectedId) || null;

  function updateStatus(id: number, status: Status) {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  function handleSave(id: number) {
    setSaveMessage(id);
    setTimeout(() => setSaveMessage(null), 2000);
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
      <h1 className="text-2xl font-bold text-white">Coaching Applications</h1>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setFilterStatus(s);
              setSelectedId(null);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer border-none transition-colors ${
              filterStatus === s
                ? "bg-primary text-white"
                : "bg-[#1E1E1E] text-white/50 hover:bg-dark/5"
            }`}
          >
            {s}
            <span className="ml-1.5 text-xs opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1E1E1E] rounded-2xl shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-dark/5 text-left">
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Name</th>
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Email</th>
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Goal</th>
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Experience</th>
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Submitted</th>
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 font-semibold text-xs text-white/50 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-white/30">
                  No applications found.
                </td>
              </tr>
            ) : (
              filtered.map((app) => (
                <tr
                  key={app.id}
                  className={`border-b border-[#1A1A1A] hover:bg-dark/2 transition-colors ${
                    selectedId === app.id ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-6 py-3 font-medium text-white">{app.name}</td>
                  <td className="px-6 py-3 text-white/60">{app.email}</td>
                  <td className="px-6 py-3 text-white/60">{app.goal}</td>
                  <td className="px-6 py-3 text-white/60">{app.experience}</td>
                  <td className="px-6 py-3 text-white/50">{formatDate(app.submitted)}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => setSelectedId(selectedId === app.id ? null : app.id)}
                      className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors cursor-pointer border-none"
                    >
                      {selectedId === app.id ? "Close" : "View"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inline detail card */}
      {selected && (
        <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-bold text-white">{selected.name}&apos;s Application</h2>
            <button
              onClick={() => setSelectedId(null)}
              className="text-white/30 hover:text-white text-lg cursor-pointer bg-transparent border-none"
            >
              {"\u2715"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide">Email</p>
              <p className="text-sm text-white mt-0.5">{selected.email}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide">Goal</p>
              <p className="text-sm text-white mt-0.5">{selected.goal}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide">Experience</p>
              <p className="text-sm text-white mt-0.5">{selected.experience}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide">Submitted</p>
              <p className="text-sm text-white mt-0.5">{formatDate(selected.submitted)}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide">Current Weight</p>
              <p className="text-sm text-white mt-0.5">{selected.currentWeight}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide">Target Weight</p>
              <p className="text-sm text-white mt-0.5">{selected.targetWeight}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Message</p>
            <p className="text-sm text-white bg-dark/3 rounded-xl p-4">{selected.message}</p>
          </div>

          <div>
            <label className="text-xs text-white/40 uppercase tracking-wide block mb-1">
              Admin Notes
            </label>
            <textarea
              value={adminNotes[selected.id] || ""}
              onChange={(e) =>
                setAdminNotes((prev) => ({ ...prev, [selected.id]: e.target.value }))
              }
              rows={3}
              placeholder="Add notes about this application..."
              className="w-full px-4 py-3 rounded-xl border border-[#222] bg-[#1E1E1E] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label className="text-xs text-white/40 uppercase tracking-wide">Status</label>
            <select
              value={selected.status}
              onChange={(e) => updateStatus(selected.id, e.target.value as Status)}
              className="px-4 py-2 rounded-xl border border-[#222] bg-[#1E1E1E] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              onClick={() => handleSave(selected.id)}
              className="px-5 py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer border-none"
            >
              {saveMessage === selected.id ? "Saved!" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

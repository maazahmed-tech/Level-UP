"use client";

import { useState, useEffect, useCallback } from "react";

interface SignupUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string | null;
  plan: string;
  planStatus: string;
  paymentScreenshot: string | null;
  paymentAccountName: string | null;
  paymentTransactionRef: string | null;
  createdAt: string;
}

type TabFilter = "ALL" | "PENDING" | "ACTIVE" | "CANCELLED";

export default function AdminSignupRequestsPage() {
  const [requests, setRequests] = useState<SignupUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/signup-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  async function handleAction(userId: string, action: "approve" | "decline") {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/signup-requests/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        await fetchRequests();
        setExpandedId(null);
      }
    } catch (err) {
      console.error("Failed to update:", err);
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = activeTab === "ALL" ? requests : requests.filter((r) => r.planStatus === activeTab);

  const counts = {
    ALL: requests.length,
    PENDING: requests.filter((r) => r.planStatus === "PENDING").length,
    ACTIVE: requests.filter((r) => r.planStatus === "ACTIVE").length,
    CANCELLED: requests.filter((r) => r.planStatus === "CANCELLED").length,
  };

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "PENDING", label: "Pending" },
    { key: "ACTIVE", label: "Approved" },
    { key: "CANCELLED", label: "Declined" },
  ];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-[#FFB800]/20 text-[#FFB800]",
      ACTIVE: "bg-green-500/20 text-green-400",
      CANCELLED: "bg-[#E51A1A]/20 text-[#E51A1A]",
    };
    return (
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${styles[status] || "bg-white/10 text-white/50"}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#E51A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-2">Signup Requests</h1>
      <p className="text-white/50 mb-8">Review EasyPaisa payment proofs and approve user accounts.</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer border-none ${
              activeTab === tab.key ? "bg-[#E51A1A] text-white" : "bg-[#1E1E1E] text-white/60 hover:text-white"
            }`}
          >
            {tab.label}
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20" : "bg-[#2A2A2A] text-white/40"}`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-12 text-center">
          <p className="text-white/40 text-lg">No signup requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((user) => (
            <div key={user.id} className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl overflow-hidden">
              {/* Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-bold truncate">{user.firstName} {user.lastName}</h3>
                    {statusBadge(user.planStatus)}
                    <span className="text-xs bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-0.5 rounded-full font-semibold">{user.plan}</span>
                  </div>
                  <p className="text-white/50 text-sm truncate">{user.email}</p>
                  <p className="text-white/30 text-xs mt-1">
                    Submitted {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#2A2A2A] text-white/60 hover:text-white hover:bg-[#333] transition-colors cursor-pointer border-none"
                >
                  {expandedId === user.id ? "Hide" : "View Details"}
                </button>
              </div>

              {/* Expanded */}
              {expandedId === user.id && (
                <div className="border-t border-[#2A2A2A] p-5 space-y-5">
                  {/* Screenshot */}
                  {user.paymentScreenshot && (
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-2">Payment Screenshot</h4>
                      <div className="bg-[#0A0A0A] rounded-xl p-2 inline-block border border-[#2A2A2A]">
                        <img src={user.paymentScreenshot} alt="Payment proof" className="max-w-full max-h-[400px] rounded-lg object-contain" />
                      </div>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Account Name</p>
                      <p className="text-white font-medium">{user.paymentAccountName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Transaction Ref</p>
                      <p className="text-white font-medium">{user.paymentTransactionRef || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Country</p>
                      <p className="text-white font-medium">{user.country || "N/A"}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {user.planStatus === "PENDING" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(user.id, "approve")}
                        disabled={actionLoading === user.id}
                        className="px-6 py-2.5 rounded-full text-sm font-bold bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-50 cursor-pointer border-none"
                      >
                        {actionLoading === user.id ? "Processing..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleAction(user.id, "decline")}
                        disabled={actionLoading === user.id}
                        className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#E51A1A] text-white hover:bg-[#C41010] transition-colors disabled:opacity-50 cursor-pointer border-none"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

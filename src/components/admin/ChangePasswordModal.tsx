"use client";

import { useState } from "react";

interface Props {
  userId: string;
  userName: string;
}

export default function ChangePasswordModal({ userId, userName }: Props) {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password updated successfully" });
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setOpen(false);
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update password" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-3 py-1.5 bg-blue-900/20 text-blue-400 rounded-lg font-medium hover:bg-blue-900/30 transition-colors cursor-pointer border-none"
      >
        Change Password
      </button>
    );
  }

  return (
    <div className="mt-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 space-y-3">
      <p className="text-xs text-white/50">
        Change password for <span className="text-white font-semibold">{userName}</span>
      </p>

      {message && (
        <div
          className={`text-xs px-3 py-2 rounded-lg ${
            message.type === "success"
              ? "bg-green-900/30 text-green-400"
              : "bg-red-900/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (min 8 chars)"
          required
          className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#E51A1A]"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
          className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#E51A1A]"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="text-xs px-4 py-2 bg-[#E51A1A] text-white rounded-lg font-medium hover:bg-[#E51A1A]/90 transition-colors cursor-pointer border-none disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setMessage(null);
              setNewPassword("");
              setConfirmPassword("");
            }}
            className="text-xs px-4 py-2 bg-[#2A2A2A] text-white/60 rounded-lg font-medium hover:bg-[#2A2A2A]/80 transition-colors cursor-pointer border-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

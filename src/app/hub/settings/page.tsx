"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string | null;
  unitPreference: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [unit, setUnit] = useState("METRIC");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setFirstName(data.user.firstName);
          setLastName(data.user.lastName);
          setCountry(data.user.country || "");
          setUnit(data.user.unitPreference || "METRIC");
        }
      })
      .catch(() => {});
  }, []);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, country, unitPreference: unit }),
      });
      if (res.ok) {
        setProfileMsg("Profile updated successfully!");
      } else {
        const data = await res.json();
        setProfileMsg(data.error || "Failed to update profile");
      }
    } catch {
      setProfileMsg("Something went wrong");
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg("");

    if (newPassword.length < 8) {
      setPasswordMsg("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPasswordMsg("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setPasswordMsg(data.error || "Failed to change password");
      }
    } catch {
      setPasswordMsg("Something went wrong");
    }
  }

  async function handleDeleteAccount() {
    try {
      const res = await fetch("/api/user/account", { method: "DELETE" });
      if (res.ok) {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
      }
    } catch {
      // ignore
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center h-64 text-white/30">Loading...</div>;
  }

  return (
    <div className="max-w-[600px]">
      <h1 className="text-3xl font-black mb-8">Settings</h1>

      {/* Profile */}
      <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-8 mb-6">
        <h2 className="text-lg font-bold mb-5">Profile Information</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-sm mb-1.5">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full py-3 px-4 border-2 border-[#2A2A2A] rounded-xl bg-[#1E1E1E] focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-1.5">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full py-3 px-4 border-2 border-[#2A2A2A] rounded-xl bg-[#1E1E1E] focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1.5">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full py-3 px-4 border-2 border-[#222] rounded-xl bg-dark/5 text-white/40"
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1.5">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full py-3 px-4 border-2 border-[#2A2A2A] rounded-xl bg-[#1E1E1E] focus:border-primary focus:outline-none transition-colors"
            >
              <option value="">Select a country</option>
              <option value="IE">Ireland</option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1.5">Units</label>
            <div className="flex gap-4">
              {["METRIC", "IMPERIAL"].map((u) => (
                <label key={u} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="unit"
                    value={u}
                    checked={unit === u}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                  <span className="text-sm">{u === "METRIC" ? "Metric (kg/cm)" : "Imperial (lbs/ft)"}</span>
                </label>
              ))}
            </div>
          </div>

          {profileMsg && (
            <p className={`text-sm font-semibold ${profileMsg.includes("success") ? "text-green-600" : "text-primary"}`}>
              {profileMsg}
            </p>
          )}

          <Button type="submit">Save Changes</Button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-8 mb-6">
        <h2 className="text-lg font-bold mb-5">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block font-semibold text-sm mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full py-3 px-4 border-2 border-[#2A2A2A] rounded-xl bg-[#1E1E1E] focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 8 chars, 1 letter, 1 number"
              required
              className="w-full py-3 px-4 border-2 border-[#2A2A2A] rounded-xl bg-[#1E1E1E] focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full py-3 px-4 border-2 border-[#2A2A2A] rounded-xl bg-[#1E1E1E] focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {passwordMsg && (
            <p className={`text-sm font-semibold ${passwordMsg.includes("success") ? "text-green-600" : "text-primary"}`}>
              {passwordMsg}
            </p>
          )}

          <Button type="submit" variant="dark">
            Change Password
          </Button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-8 border-2 border-primary/20">
        <h2 className="text-lg font-bold mb-3 text-primary">Danger Zone</h2>
        <p className="text-white/50 text-sm mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        {showDelete ? (
          <div className="flex gap-3">
            <button
              onClick={handleDeleteAccount}
              className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm cursor-pointer border-none"
            >
              Yes, Delete My Account
            </button>
            <button
              onClick={() => setShowDelete(false)}
              className="px-5 py-2.5 bg-dark/10 text-white rounded-lg font-semibold text-sm cursor-pointer border-none"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDelete(true)}
            className="px-5 py-2.5 border-2 border-primary text-primary rounded-lg font-semibold text-sm cursor-pointer bg-transparent hover:bg-primary/5 transition-colors"
          >
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
}

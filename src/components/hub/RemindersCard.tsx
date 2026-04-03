"use client";

import { useState, useEffect } from "react";

interface Reminder {
  type: string;
  time: string;
  enabled: boolean;
}

const REMINDER_TYPES = [
  { type: "WAKE_UP", label: "Wake Up", defaultTime: "07:00" },
  { type: "BREAKFAST", label: "Breakfast", defaultTime: "08:00" },
  { type: "LUNCH", label: "Lunch", defaultTime: "12:30" },
  { type: "DINNER", label: "Dinner", defaultTime: "18:30" },
  { type: "SNACK", label: "Snack", defaultTime: "15:00" },
  { type: "SLEEP", label: "Sleep", defaultTime: "22:30" },
];

export default function RemindersCard() {
  const [reminders, setReminders] = useState<Reminder[]>(
    REMINDER_TYPES.map((r) => ({ type: r.type, time: r.defaultTime, enabled: false }))
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/reminders")
      .then((r) => r.json())
      .then((data) => {
        if (data.reminders && data.reminders.length > 0) {
          setReminders((prev) =>
            prev.map((rem) => {
              const found = data.reminders.find(
                (r: Reminder) => r.type === rem.type
              );
              return found
                ? { type: rem.type, time: found.time, enabled: found.enabled }
                : rem;
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  function updateReminder(index: number, field: "time" | "enabled", value: string | boolean) {
    setReminders((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  async function handleSave() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/reminders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminders }),
      });
      if (res.ok) {
        setMsg("Reminders saved!");
      } else {
        setMsg("Failed to save reminders");
      }
    } catch {
      setMsg("Something went wrong");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  }

  return (
    <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-8 mb-6">
      <h2 className="text-lg font-bold mb-5">Daily Reminders</h2>
      <p className="text-white/40 text-sm mb-5">
        Set reminders to stay on track with your daily routine.
      </p>

      <div className="space-y-3">
        {reminders.map((rem, i) => {
          const meta = REMINDER_TYPES.find((r) => r.type === rem.type);
          return (
            <div
              key={rem.type}
              className="flex items-center justify-between gap-4 py-3 px-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]"
            >
              <span className="text-sm font-medium text-white min-w-[80px]">
                {meta?.label || rem.type}
              </span>

              <input
                type="time"
                value={rem.time}
                onChange={(e) => updateReminder(i, "time", e.target.value)}
                className="px-3 py-1.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E51A1A] transition-colors"
              />

              <button
                type="button"
                onClick={() => updateReminder(i, "enabled", !rem.enabled)}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer border-none ${
                  rem.enabled ? "bg-[#E51A1A]" : "bg-[#2A2A2A]"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    rem.enabled ? "left-5" : "left-1"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {msg && (
        <p className={`text-sm font-semibold mt-4 ${msg.includes("saved") ? "text-green-500" : "text-[#E51A1A]"}`}>
          {msg}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-5 px-6 py-2.5 bg-[#E51A1A] text-white rounded-xl text-sm font-semibold hover:bg-[#E51A1A]/90 transition-colors cursor-pointer border-none disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Reminders"}
      </button>
    </div>
  );
}

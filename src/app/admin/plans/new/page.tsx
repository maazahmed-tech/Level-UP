"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NewPlanTemplatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "combined",
    durationWeeks: "4",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          type: form.type,
          durationWeeks: parseInt(form.durationWeeks) || 4,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create template");
        return;
      }

      const template = await res.json();
      router.push(`/admin/plans/${template.id}/edit`);
    } catch {
      alert("Failed to create template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/plans"
          className="text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          &larr; Back to Plans
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Create Plan Template</h1>
        <p className="text-sm text-white/40 mt-1">
          Set up a new plan template, then configure its daily schedule
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Plan Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. 8-Week Fat Loss Program"
            className="w-full px-4 py-2.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-white placeholder-white/20 focus:outline-none focus:border-[#E51A1A]/50"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe this plan template..."
            rows={3}
            className="w-full px-4 py-2.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-white placeholder-white/20 focus:outline-none focus:border-[#E51A1A]/50 resize-none"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Plan Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#E51A1A]/50"
          >
            <option value="combined">Combined (Workout + Diet)</option>
            <option value="workout">Workout Only</option>
            <option value="diet">Diet Only</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Duration (weeks)
          </label>
          <input
            type="number"
            min={1}
            max={52}
            value={form.durationWeeks}
            onChange={(e) => setForm({ ...form, durationWeeks: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#E51A1A]/50"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="px-6 py-2.5 bg-[#E51A1A] text-white font-semibold rounded-lg hover:bg-[#E51A1A]/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Creating..." : "Create & Configure Days"}
          </button>
          <Link
            href="/admin/plans"
            className="px-6 py-2.5 text-white/50 hover:text-white/70 transition-colors text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Workout {
  id: number;
  title: string;
  slug: string;
}

interface TemplateDay {
  id?: number;
  dayOfWeek: number;
  weekNumber: number;
  workoutId: number | null;
  workoutNotes: string;
  mealPlan: string;
  calorieTarget: string;
  proteinTarget: string;
  carbsTarget: string;
  fatTarget: string;
  notes: string;
}

interface Template {
  id: number;
  name: string;
  description: string | null;
  type: string;
  durationWeeks: number;
  days: (TemplateDay & { workout?: Workout | null })[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function emptyDay(weekNumber: number, dayOfWeek: number): TemplateDay {
  return {
    dayOfWeek,
    weekNumber,
    workoutId: null,
    workoutNotes: "",
    mealPlan: "",
    calorieTarget: "",
    proteinTarget: "",
    carbsTarget: "",
    fatTarget: "",
    notes: "",
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EditPlanTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [template, setTemplate] = useState<Template | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [days, setDays] = useState<Map<string, TemplateDay>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCell, setEditingCell] = useState<string | null>(null);

  // Edit form state for current cell
  const [cellForm, setCellForm] = useState<TemplateDay>(emptyDay(1, 1));

  const dayKey = (week: number, day: number) => `${week}-${day}`;

  const loadData = useCallback(async () => {
    try {
      const [tRes, wRes] = await Promise.all([
        fetch(`/api/admin/plans/${id}`),
        fetch("/api/admin/workouts"),
      ]);
      const tData = await tRes.json();
      const wData = await wRes.json();

      setTemplate(tData);
      setWorkouts(
        (wData as Workout[]).map((w: Workout) => ({
          id: w.id,
          title: w.title,
          slug: w.slug,
        }))
      );

      // Build days map
      const map = new Map<string, TemplateDay>();
      for (const d of tData.days) {
        map.set(dayKey(d.weekNumber, d.dayOfWeek), {
          dayOfWeek: d.dayOfWeek,
          weekNumber: d.weekNumber,
          workoutId: d.workoutId,
          workoutNotes: d.workoutNotes || "",
          mealPlan: d.mealPlan || "",
          calorieTarget: d.calorieTarget != null ? String(d.calorieTarget) : "",
          proteinTarget: d.proteinTarget != null ? String(d.proteinTarget) : "",
          carbsTarget: d.carbsTarget != null ? String(d.carbsTarget) : "",
          fatTarget: d.fatTarget != null ? String(d.fatTarget) : "",
          notes: d.notes || "",
        });
      }
      setDays(map);
    } catch {
      alert("Failed to load template data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openCell(week: number, day: number) {
    const key = dayKey(week, day);
    const existing = days.get(key);
    setCellForm(existing ? { ...existing } : emptyDay(week, day));
    setEditingCell(key);
  }

  function saveCell() {
    if (!editingCell) return;
    const updated = new Map(days);

    // Check if the cell has any data
    const hasData =
      cellForm.workoutId ||
      cellForm.workoutNotes.trim() ||
      cellForm.mealPlan.trim() ||
      cellForm.calorieTarget ||
      cellForm.notes.trim();

    if (hasData) {
      updated.set(editingCell, { ...cellForm });
    } else {
      updated.delete(editingCell);
    }

    setDays(updated);
    setEditingCell(null);
  }

  function clearCell() {
    if (!editingCell) return;
    const updated = new Map(days);
    updated.delete(editingCell);
    setDays(updated);
    setEditingCell(null);
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      const daysArr = Array.from(days.values()).map((d) => ({
        dayOfWeek: d.dayOfWeek,
        weekNumber: d.weekNumber,
        workoutId: d.workoutId || null,
        workoutNotes: d.workoutNotes || null,
        mealPlan: d.mealPlan || null,
        calorieTarget: d.calorieTarget ? parseInt(d.calorieTarget) : null,
        proteinTarget: d.proteinTarget ? parseFloat(d.proteinTarget) : null,
        carbsTarget: d.carbsTarget ? parseFloat(d.carbsTarget) : null,
        fatTarget: d.fatTarget ? parseFloat(d.fatTarget) : null,
        notes: d.notes || null,
      }));

      const res = await fetch(`/api/admin/plans/${id}/days`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: daysArr }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save");
        return;
      }

      alert("Days saved successfully!");
    } catch {
      alert("Failed to save days");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateTemplate(field: string, value: string) {
    try {
      await fetch(`/api/admin/plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (template) {
        setTemplate({ ...template, [field]: value });
      }
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#E51A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-20 text-white/40">
        Template not found.{" "}
        <Link href="/admin/plans" className="text-[#E51A1A] hover:underline">
          Back to plans
        </Link>
      </div>
    );
  }

  const weeks = Array.from({ length: template.durationWeeks }, (_, i) => i + 1);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/admin/plans"
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            &larr; Back to Plans
          </Link>
          <h1 className="text-2xl font-bold text-white mt-2">{template.name}</h1>
          <p className="text-sm text-white/40 mt-1">
            {template.durationWeeks} weeks &middot; {template.type} plan &middot;{" "}
            {days.size} day{days.size !== 1 ? "s" : ""} configured
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-5 py-2 bg-[#E51A1A] text-white font-semibold rounded-lg hover:bg-[#E51A1A]/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving..." : "Save All Days"}
        </button>
      </div>

      {/* Template metadata quick edit */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">Name</label>
            <input
              type="text"
              defaultValue={template.name}
              onBlur={(e) => handleUpdateTemplate("name", e.target.value)}
              className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E51A1A]/50"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Type</label>
            <select
              defaultValue={template.type}
              onChange={(e) => handleUpdateTemplate("type", e.target.value)}
              className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E51A1A]/50"
            >
              <option value="combined">Combined</option>
              <option value="workout">Workout</option>
              <option value="diet">Diet</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Duration (weeks)</label>
            <input
              type="number"
              min={1}
              max={52}
              defaultValue={template.durationWeeks}
              onBlur={(e) => handleUpdateTemplate("durationWeeks", e.target.value)}
              className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E51A1A]/50"
            />
          </div>
        </div>
      </div>

      {/* Week/Day Grid */}
      <div className="space-y-4">
        {weeks.map((week) => (
          <div key={week} className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white/60 mb-3">Week {week}</h3>
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((dow) => {
                const key = dayKey(week, dow);
                const d = days.get(key);
                const hasWorkout = d?.workoutId;
                const hasMeal = d?.mealPlan || d?.calorieTarget;
                const isEmpty = !d;

                let bgColor = "bg-[#0A0A0A]";
                let borderColor = "border-[#2A2A2A]";
                if (hasWorkout && hasMeal) {
                  bgColor = "bg-[#E51A1A]/10";
                  borderColor = "border-[#E51A1A]/30";
                } else if (hasWorkout) {
                  bgColor = "bg-[#E51A1A]/10";
                  borderColor = "border-[#E51A1A]/20";
                } else if (hasMeal) {
                  bgColor = "bg-orange-500/10";
                  borderColor = "border-orange-500/20";
                }

                return (
                  <button
                    key={dow}
                    onClick={() => openCell(week, dow)}
                    className={`${bgColor} border ${borderColor} rounded-lg p-2 min-h-[80px] text-left hover:border-white/30 transition-colors cursor-pointer`}
                  >
                    <p className="text-[10px] font-bold text-white/40 uppercase mb-1">
                      {DAY_LABELS[dow - 1]}
                    </p>
                    {isEmpty ? (
                      <p className="text-[10px] text-white/15">+</p>
                    ) : (
                      <div className="space-y-0.5">
                        {hasWorkout && (
                          <p className="text-[10px] text-[#E51A1A] truncate">
                            {workouts.find((w) => w.id === d.workoutId)?.title || "Workout"}
                          </p>
                        )}
                        {d.calorieTarget && (
                          <p className="text-[10px] text-orange-400">{d.calorieTarget} kcal</p>
                        )}
                        {d.mealPlan && !d.calorieTarget && (
                          <p className="text-[10px] text-orange-400 truncate">Meal plan</p>
                        )}
                        {d.notes && (
                          <p className="text-[10px] text-white/30 truncate">{d.notes}</p>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-white/40">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#E51A1A]/20 border border-[#E51A1A]/30" /> Workout
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/30" /> Meal Plan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#0A0A0A] border border-[#2A2A2A]" /> Empty
        </span>
      </div>

      {/* ── Edit Cell Modal ── */}
      {editingCell && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-[#2A2A2A] flex items-center justify-between">
              <h3 className="text-white font-semibold">
                Week {cellForm.weekNumber} &mdash; {DAY_LABELS[cellForm.dayOfWeek - 1]}
              </h3>
              <button
                onClick={() => setEditingCell(null)}
                className="text-white/40 hover:text-white text-xl bg-transparent border-none cursor-pointer leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Workout */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Workout</label>
                <select
                  value={cellForm.workoutId || ""}
                  onChange={(e) =>
                    setCellForm({
                      ...cellForm,
                      workoutId: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E51A1A]/50"
                >
                  <option value="">No workout</option>
                  {workouts.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Workout Notes */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Workout Notes</label>
                <textarea
                  value={cellForm.workoutNotes}
                  onChange={(e) => setCellForm({ ...cellForm, workoutNotes: e.target.value })}
                  placeholder="e.g. 4 sets x 12 reps, increase weight..."
                  rows={2}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E51A1A]/50 resize-none"
                />
              </div>

              {/* Calorie & Macros */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={cellForm.calorieTarget}
                    onChange={(e) => setCellForm({ ...cellForm, calorieTarget: e.target.value })}
                    placeholder="2000"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E51A1A]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={cellForm.proteinTarget}
                    onChange={(e) => setCellForm({ ...cellForm, proteinTarget: e.target.value })}
                    placeholder="150"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E51A1A]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={cellForm.carbsTarget}
                    onChange={(e) => setCellForm({ ...cellForm, carbsTarget: e.target.value })}
                    placeholder="200"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E51A1A]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={cellForm.fatTarget}
                    onChange={(e) => setCellForm({ ...cellForm, fatTarget: e.target.value })}
                    placeholder="60"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E51A1A]/50"
                  />
                </div>
              </div>

              {/* Meal Plan Notes */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Meal Plan Notes</label>
                <textarea
                  value={cellForm.mealPlan}
                  onChange={(e) => setCellForm({ ...cellForm, mealPlan: e.target.value })}
                  placeholder="e.g. Breakfast: Oats + protein shake..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E51A1A]/50 resize-none"
                />
              </div>

              {/* Day Notes */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Day Notes</label>
                <textarea
                  value={cellForm.notes}
                  onChange={(e) => setCellForm({ ...cellForm, notes: e.target.value })}
                  placeholder="e.g. Rest day, active recovery..."
                  rows={2}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E51A1A]/50 resize-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-[#2A2A2A] flex items-center justify-between">
              <button
                onClick={clearCell}
                className="text-sm text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer"
              >
                Clear Day
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingCell(null)}
                  className="px-4 py-1.5 text-sm text-white/50 hover:text-white/70 bg-transparent border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCell}
                  className="px-4 py-1.5 bg-[#E51A1A] text-white text-sm font-semibold rounded-lg hover:bg-[#E51A1A]/90 transition-colors cursor-pointer"
                >
                  Set Day
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

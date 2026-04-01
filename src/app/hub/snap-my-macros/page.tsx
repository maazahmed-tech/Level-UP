"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MealEntry {
  id: string;
  description: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

type Tab = "log" | "meals";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const TARGETS = { calories: 2200, protein: 165, carbs: 220, fat: 60 };

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

/* ------------------------------------------------------------------ */
/*  Quick-add presets                                                   */
/* ------------------------------------------------------------------ */

const PRESETS = [
  { label: "Protein Shake", calories: 250, protein: 30, carbs: 15, fat: 5 },
  { label: "Chicken & Rice", calories: 450, protein: 40, carbs: 50, fat: 8 },
  { label: "Greek Yogurt", calories: 150, protein: 15, carbs: 12, fat: 5 },
  { label: "Protein Bar", calories: 220, protein: 20, carbs: 25, fat: 8 },
  { label: "Eggs on Toast", calories: 350, protein: 22, carbs: 30, fat: 15 },
  { label: "Tuna Salad", calories: 300, protein: 35, carbs: 10, fat: 12 },
];

/* ------------------------------------------------------------------ */
/*  Sample data                                                        */
/* ------------------------------------------------------------------ */

function buildSampleMeals(): MealEntry[] {
  const today = todayStr();
  return [
    {
      id: generateId(),
      description: "Protein Oats",
      mealType: "Breakfast",
      calories: 380,
      protein: 30,
      carbs: 45,
      fat: 8,
      date: today,
      time: "08:00",
    },
    {
      id: generateId(),
      description: "Chicken Burrito Bowl",
      mealType: "Lunch",
      calories: 520,
      protein: 42,
      carbs: 55,
      fat: 12,
      date: today,
      time: "12:30",
    },
    {
      id: generateId(),
      description: "Protein Shake",
      mealType: "Snack",
      calories: 250,
      protein: 30,
      carbs: 15,
      fat: 5,
      date: today,
      time: "15:00",
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Meal-type badge colors                                             */
/* ------------------------------------------------------------------ */

const MEAL_TYPE_COLORS: Record<string, string> = {
  Breakfast: "bg-amber-100 text-amber-800",
  Lunch: "bg-emerald-100 text-emerald-800",
  Dinner: "bg-indigo-100 text-indigo-800",
  Snack: "bg-pink-100 text-pink-800",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SnapMyMacrosPage() {
  const [tab, setTab] = useState<Tab>("log");
  const [meals, setMeals] = useState<MealEntry[]>(buildSampleMeals);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [successMsg, setSuccessMsg] = useState(false);

  /* Form state */
  const [formDesc, setFormDesc] = useState("");
  const [formType, setFormType] = useState<MealEntry["mealType"]>("Breakfast");
  const [formCal, setFormCal] = useState("");
  const [formProtein, setFormProtein] = useState("");
  const [formCarbs, setFormCarbs] = useState("");
  const [formFat, setFormFat] = useState("");

  /* ---- actions ---- */

  function clearForm() {
    setFormDesc("");
    setFormType("Breakfast");
    setFormCal("");
    setFormProtein("");
    setFormCarbs("");
    setFormFat("");
  }

  function handleLog(e: React.FormEvent) {
    e.preventDefault();
    if (!formDesc.trim() || !formCal) return;

    const now = new Date();
    const entry: MealEntry = {
      id: generateId(),
      description: formDesc.trim(),
      mealType: formType,
      calories: Number(formCal) || 0,
      protein: Number(formProtein) || 0,
      carbs: Number(formCarbs) || 0,
      fat: Number(formFat) || 0,
      date: todayStr(),
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    };

    setMeals((prev) => [...prev, entry]);
    clearForm();
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setTab("meals");
    }, 2000);
  }

  function handleDelete(id: string) {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setFormDesc(preset.label);
    setFormCal(String(preset.calories));
    setFormProtein(String(preset.protein));
    setFormCarbs(String(preset.carbs));
    setFormFat(String(preset.fat));
  }

  /* ---- derived data ---- */

  const filteredMeals = meals
    .filter((m) => m.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const totals = filteredMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  /* ---- shared input classes ---- */

  const inputClass =
    "w-full px-4 py-3 border-2 border-[#2A2A2A] rounded-xl focus:border-primary focus:outline-none bg-[#1E1E1E] text-white transition-colors";

  /* ================================================================== */
  /*  RENDER                                                             */
  /* ================================================================== */

  return (
    <section className="min-h-screen bg-cream">
      {/* ---- Header ---- */}
      <div className="bg-dark text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Snap My Macros</h1>
          <p className="text-white/70 text-lg">
            Log your meals and track your daily macros effortlessly.
          </p>
        </div>
      </div>

      {/* ---- Tab bar ---- */}
      <div className="max-w-3xl mx-auto px-4 -mt-5">
        <div className="bg-[#1E1E1E] rounded-2xl shadow-card flex overflow-hidden">
          <button
            onClick={() => setTab("log")}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
              tab === "log"
                ? "bg-primary text-white"
                : "text-white/50 hover:bg-beige"
            }`}
          >
            Log a Meal
          </button>
          <button
            onClick={() => setTab("meals")}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
              tab === "meals"
                ? "bg-primary text-white"
                : "text-white/50 hover:bg-beige"
            }`}
          >
            Meal Log
          </button>
        </div>
      </div>

      {/* ---- Content ---- */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ============================================================ */}
        {/*  TAB 1 — Log a Meal                                          */}
        {/* ============================================================ */}
        {tab === "log" && (
          <div className="space-y-8">
            {/* Success banner */}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-5 py-3 rounded-2xl text-center font-semibold animate-pulse">
                Meal logged!
              </div>
            )}

            {/* Form card */}
            <form
              onSubmit={handleLog}
              className="bg-[#1E1E1E] rounded-2xl shadow-card p-6 md:p-8 space-y-5"
            >
              <h2 className="text-xl font-bold text-white">Log a Meal</h2>

              {/* Meal name */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">
                  Meal Name / Description <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken Salad"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Meal type */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">
                  Meal Type
                </label>
                <select
                  value={formType}
                  onChange={(e) =>
                    setFormType(e.target.value as MealEntry["mealType"])
                  }
                  className={inputClass}
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snack</option>
                </select>
              </div>

              {/* Macro inputs — 2x2 grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    Calories <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="kcal"
                    value={formCal}
                    onChange={(e) => setFormCal(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="grams"
                    value={formProtein}
                    onChange={(e) => setFormProtein(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="grams"
                    value={formCarbs}
                    onChange={(e) => setFormCarbs(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="grams"
                    value={formFat}
                    onChange={(e) => setFormFat(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Log Meal
              </button>
            </form>

            {/* Quick-add presets */}
            <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-1">Quick Add</h3>
              <p className="text-white/50 text-sm mb-4">
                Tap a preset to auto-fill the form above.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="border-2 border-[#2A2A2A] rounded-xl px-4 py-3 text-left hover:border-primary hover:bg-beige transition-colors group"
                  >
                    <span className="block font-semibold text-white text-sm group-hover:text-primary transition-colors">
                      {p.label}
                    </span>
                    <span className="block text-white/50 text-xs mt-0.5">
                      {p.calories} cal &middot; {p.protein}P &middot; {p.carbs}C &middot; {p.fat}F
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2 — Meal Log                                            */}
        {/* ============================================================ */}
        {tab === "meals" && (
          <div className="space-y-6">
            {/* Date picker */}
            <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Meal Log</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border-2 border-[#2A2A2A] rounded-xl focus:border-primary focus:outline-none text-white text-sm"
              />
            </div>

            {/* Daily summary */}
            <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-5 md:p-6">
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">
                Daily Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(
                  [
                    { label: "Calories", key: "calories" as const, unit: "kcal", color: "bg-amber-500" },
                    { label: "Protein", key: "protein" as const, unit: "g", color: "bg-emerald-500" },
                    { label: "Carbs", key: "carbs" as const, unit: "g", color: "bg-blue-500" },
                    { label: "Fat", key: "fat" as const, unit: "g", color: "bg-pink-500" },
                  ] as const
                ).map((metric) => {
                  const current = totals[metric.key];
                  const target = TARGETS[metric.key];
                  const pct = Math.min((current / target) * 100, 100);
                  const over = current > target;
                  return (
                    <div
                      key={metric.key}
                      className="bg-light rounded-xl p-4"
                    >
                      <p className="text-xs font-medium text-white/50 mb-1">{metric.label}</p>
                      <p className="text-xl font-bold text-white">
                        {current}
                        <span className="text-sm font-normal text-white/50 ml-0.5">
                          {metric.unit}
                        </span>
                      </p>
                      <p className="text-xs text-white/50 mb-2">
                        / {target}
                        {metric.unit}
                      </p>
                      {/* Progress bar */}
                      <div className="w-full h-2 bg-dark/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            over ? "bg-primary" : metric.color
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meal list */}
            {filteredMeals.length === 0 ? (
              <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-10 text-center">
                <p className="text-white/50 text-lg mb-4">
                  No meals logged for this date. Start tracking!
                </p>
                <button
                  onClick={() => setTab("log")}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Log a Meal
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-[#1E1E1E] rounded-2xl shadow-card p-5 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            MEAL_TYPE_COLORS[meal.mealType]
                          }`}
                        >
                          {meal.mealType}
                        </span>
                        <span className="text-xs text-white/50">
                          {formatTime(meal.time)}
                        </span>
                      </div>
                      <p className="font-semibold text-white truncate">
                        {meal.description}
                      </p>
                      <div className="flex gap-3 mt-1.5 text-sm text-white/50 flex-wrap">
                        <span>{meal.calories} cal</span>
                        <span>{meal.protein}g P</span>
                        <span>{meal.carbs}g C</span>
                        <span>{meal.fat}g F</span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(meal.id)}
                      className="text-dark/30 hover:text-primary transition-colors p-1 mt-1 shrink-0"
                      aria-label="Delete meal"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

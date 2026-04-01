"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type WeightEntry = { date: string; weight: number };
type ProgressPhoto = {
  id: string;
  date: string;
  notes: string;
  url: string;
  file: File;
};

// ---------------------------------------------------------------------------
// Sample weight data generator (30 days trending 85 -> ~81 kg)
// ---------------------------------------------------------------------------
function generateSampleWeights(): WeightEntry[] {
  const entries: WeightEntry[] = [];
  const now = new Date();
  let weight = 85;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    // Gentle downward trend with realistic daily fluctuation
    const trend = -0.14; // ~4 kg over 30 days
    const fluctuation = (Math.random() - 0.45) * 0.6; // slight bias down
    weight = Math.round((weight + trend + fluctuation) * 10) / 10;
    weight = Math.max(weight, 80.5); // floor
    entries.push({ date: dateStr, weight });
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function fmtDateFull(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ---------------------------------------------------------------------------
// SVG Weight Chart
// ---------------------------------------------------------------------------
type ChartProps = { data: WeightEntry[] };

function WeightChart({ data }: ChartProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    entry: WeightEntry;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (data.length === 0)
    return (
      <p className="text-white/40 text-center py-12">
        No data to display. Log your first weight entry above.
      </p>
    );

  // Dimensions (logical viewBox units)
  const W = 800;
  const H = 360;
  const pad = { top: 20, right: 30, bottom: 50, left: 55 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const weights = data.map((d) => d.weight);
  const minW = Math.floor(Math.min(...weights) - 0.5);
  const maxW = Math.ceil(Math.max(...weights) + 0.5);
  const rangeW = maxW - minW || 1;

  const xScale = (i: number) => pad.left + (i / (data.length - 1 || 1)) * cw;
  const yScale = (w: number) => pad.top + (1 - (w - minW) / rangeW) * ch;

  // Build path
  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.weight)}`)
    .join(" ");

  // Y-axis ticks (5-6 ticks)
  const yTickCount = 5;
  const yTicks: number[] = [];
  for (let t = 0; t <= yTickCount; t++) {
    yTicks.push(minW + (rangeW / yTickCount) * t);
  }

  // X-axis ticks (show ~8 labels max)
  const xStep = Math.max(1, Math.floor(data.length / 8));
  const xTicks: number[] = [];
  for (let i = 0; i < data.length; i += xStep) xTicks.push(i);
  if (xTicks[xTicks.length - 1] !== data.length - 1)
    xTicks.push(data.length - 1);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || data.length < 2) return;
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * W;
      // Find closest point
      let closest = 0;
      let closestDist = Infinity;
      for (let i = 0; i < data.length; i++) {
        const dist = Math.abs(xScale(i) - mouseX);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      }
      setTooltip({
        x: xScale(closest),
        y: yScale(data[closest].weight),
        entry: data[closest],
      });
    },
    [data]
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
    >
      {/* Grid lines */}
      {yTicks.map((t, i) => (
        <line
          key={`yg-${i}`}
          x1={pad.left}
          x2={W - pad.right}
          y1={yScale(t)}
          y2={yScale(t)}
          stroke="#e5e5e5"
          strokeWidth={1}
        />
      ))}

      {/* Y-axis labels */}
      {yTicks.map((t, i) => (
        <text
          key={`yl-${i}`}
          x={pad.left - 10}
          y={yScale(t) + 4}
          textAnchor="end"
          fontSize={12}
          fill="#888"
        >
          {t.toFixed(1)}
        </text>
      ))}

      {/* X-axis labels */}
      {xTicks.map((idx) => (
        <text
          key={`xl-${idx}`}
          x={xScale(idx)}
          y={H - pad.bottom + 25}
          textAnchor="middle"
          fontSize={12}
          fill="#888"
        >
          {fmtDate(data[idx].date)}
        </text>
      ))}

      {/* Area fill */}
      <path
        d={`${pathD} L ${xScale(data.length - 1)} ${pad.top + ch} L ${pad.left} ${pad.top + ch} Z`}
        fill="rgba(244,67,54,0.07)"
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#F44336"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Dots */}
      {data.map((d, i) => (
        <circle
          key={i}
          cx={xScale(i)}
          cy={yScale(d.weight)}
          r={3.5}
          fill="#F44336"
          stroke="#fff"
          strokeWidth={2}
        />
      ))}

      {/* Tooltip */}
      {tooltip && (
        <g>
          <line
            x1={tooltip.x}
            x2={tooltip.x}
            y1={pad.top}
            y2={pad.top + ch}
            stroke="#F44336"
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.5}
          />
          <circle
            cx={tooltip.x}
            cy={tooltip.y}
            r={6}
            fill="#F44336"
            stroke="#fff"
            strokeWidth={2.5}
          />
          <rect
            x={tooltip.x - 52}
            y={tooltip.y - 40}
            width={104}
            height={28}
            rx={6}
            fill="#222"
          />
          <text
            x={tooltip.x}
            y={tooltip.y - 22}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fill="#fff"
          >
            {tooltip.entry.weight} kg &middot; {fmtDate(tooltip.entry.date)}
          </text>
        </g>
      )}
    </svg>
  );
}

// ===========================================================================
// Main Page Component
// ===========================================================================
export default function ProgressPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"weight" | "photos">("weight");

  // ------ Weight state ------
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(
    generateSampleWeights
  );
  const [logDate, setLogDate] = useState(todayISO());
  const [logWeight, setLogWeight] = useState("");
  const [chartRange, setChartRange] = useState<7 | 30 | 90 | 0>(30);

  // ------ Photos state ------
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [photoDate, setPhotoDate] = useState(todayISO());
  const [photoNotes, setPhotoNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);

  // ------ Derived weight data ------
  const sorted = useMemo(
    () => [...weightEntries].sort((a, b) => a.date.localeCompare(b.date)),
    [weightEntries]
  );

  const chartData = useMemo(() => {
    if (chartRange === 0) return sorted;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - chartRange);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return sorted.filter((e) => e.date >= cutoffStr);
  }, [sorted, chartRange]);

  const startWeight = sorted.length > 0 ? sorted[0].weight : null;
  const currentWeight = sorted.length > 0 ? sorted[sorted.length - 1].weight : null;
  const totalChange =
    startWeight !== null && currentWeight !== null
      ? Math.round((currentWeight - startWeight) * 10) / 10
      : null;

  const tableEntries = useMemo(() => {
    const desc = [...sorted].reverse();
    return desc.map((entry, idx) => {
      const sortedIdx = sorted.length - 1 - idx;
      const prev = sortedIdx > 0 ? sorted[sortedIdx - 1] : null;
      const change = prev
        ? Math.round((entry.weight - prev.weight) * 10) / 10
        : null;
      return { ...entry, change };
    });
  }, [sorted]);

  // ------ Handlers ------
  function handleLogWeight() {
    const w = parseFloat(logWeight);
    if (!logDate || isNaN(w) || w <= 0) return;
    setWeightEntries((prev) => {
      const filtered = prev.filter((e) => e.date !== logDate);
      return [...filtered, { date: logDate, weight: w }];
    });
    setLogWeight("");
  }

  function handleDeleteEntry(date: string) {
    setWeightEntries((prev) => prev.filter((e) => e.date !== date));
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleUploadPhoto() {
    if (!photoFile) return;
    const newPhoto: ProgressPhoto = {
      id: uid(),
      date: photoDate,
      notes: photoNotes,
      url: URL.createObjectURL(photoFile),
      file: photoFile,
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    setPhotoFile(null);
    setPreviewUrl(null);
    setPhotoNotes("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function toggleCompareSelect(id: string) {
    setCompareSelection((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }

  const selectedPhotos = photos.filter((p) => compareSelection.includes(p.id));

  // ------ Render ------
  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Progress Tracker</h1>
      <p className="text-white/50 mb-6">
        Log your weight and track your transformation over time.
      </p>

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-8">
        {(["weight", "photos"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === tab
                ? "bg-primary text-white shadow-md"
                : "bg-[#1E1E1E] text-white/60 border border-[#2A2A2A] hover:border-[#181818]0"
            }`}
          >
            {tab === "weight" ? "Weight" : "Photos"}
          </button>
        ))}
      </div>

      {/* ================================================================= */}
      {/* TAB 1: WEIGHT TRACKER                                             */}
      {/* ================================================================= */}
      {activeTab === "weight" && (
        <div className="space-y-6">
          {/* Log Form */}
          <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-bold mb-4">Log Weight</h2>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                  Date
                </label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm bg-light focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                  Weight
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Enter weight"
                    value={logWeight}
                    onChange={(e) => setLogWeight(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogWeight()}
                    className="border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm w-40 bg-light focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="text-sm font-semibold text-white/40">kg</span>
                </div>
              </div>
              <Button onClick={handleLogWeight} className="!py-2.5 !px-8 !text-sm">
                Log Weight
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1">
                Starting Weight
              </p>
              <p className="text-2xl font-black">
                {startWeight !== null ? `${startWeight} kg` : "--"}
              </p>
            </div>
            <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1">
                Current Weight
              </p>
              <p className="text-2xl font-black">
                {currentWeight !== null ? `${currentWeight} kg` : "--"}
              </p>
            </div>
            <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1">
                Total Change
              </p>
              <p
                className={`text-2xl font-black ${
                  totalChange !== null
                    ? totalChange <= 0
                      ? "text-green-600"
                      : "text-primary"
                    : ""
                }`}
              >
                {totalChange !== null
                  ? `${totalChange > 0 ? "+" : ""}${totalChange} kg`
                  : "--"}
              </p>
            </div>
          </div>

          {/* Weight Chart */}
          <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold">Weight Trend</h2>
              <div className="flex gap-1.5">
                {(
                  [
                    [7, "7 Days"],
                    [30, "30 Days"],
                    [90, "90 Days"],
                    [0, "All"],
                  ] as [number, string][]
                ).map(([range, label]) => (
                  <button
                    key={range}
                    onClick={() => setChartRange(range as 7 | 30 | 90 | 0)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartRange === range
                        ? "bg-primary text-white"
                        : "bg-light text-white/50 hover:bg-beige"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <WeightChart data={chartData} />
          </div>

          {/* Weight Log Table */}
          <div className="bg-[#1E1E1E] rounded-2xl shadow-card overflow-hidden">
            <div className="p-6 pb-3">
              <h2 className="text-lg font-bold">Weight Log</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#222] text-left">
                    <th className="px-6 py-3 font-semibold text-white/40 text-xs uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-6 py-3 font-semibold text-white/40 text-xs uppercase tracking-wide">
                      Weight
                    </th>
                    <th className="px-6 py-3 font-semibold text-white/40 text-xs uppercase tracking-wide">
                      Change
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {tableEntries.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-white/30">
                        No entries yet. Log your first weight above.
                      </td>
                    </tr>
                  )}
                  {tableEntries.map((entry) => (
                    <tr
                      key={entry.date}
                      className="border-b border-[#1A1A1A] hover:bg-light/50 transition-colors"
                    >
                      <td className="px-6 py-3 font-medium">{fmtDateFull(entry.date)}</td>
                      <td className="px-6 py-3">{entry.weight} kg</td>
                      <td className="px-6 py-3">
                        {entry.change !== null ? (
                          <span
                            className={`font-semibold ${
                              entry.change < 0
                                ? "text-green-600"
                                : entry.change > 0
                                  ? "text-primary"
                                  : "text-white/30"
                            }`}
                          >
                            {entry.change > 0 ? "+" : ""}
                            {entry.change} kg
                          </span>
                        ) : (
                          <span className="text-dark/30">--</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleDeleteEntry(entry.date)}
                          className="text-dark/30 hover:text-primary transition-colors cursor-pointer text-base"
                          title="Delete entry"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: PHOTOS                                                     */}
      {/* ================================================================= */}
      {activeTab === "photos" && (
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-bold mb-4">Upload Progress Photo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                    Date
                  </label>
                  <input
                    type="date"
                    value={photoDate}
                    onChange={(e) => setPhotoDate(e.target.value)}
                    className="border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm bg-light focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                    Notes (optional)
                  </label>
                  <textarea
                    value={photoNotes}
                    onChange={(e) => setPhotoNotes(e.target.value)}
                    placeholder="E.g. Front pose, flexed, after workout..."
                    rows={3}
                    className="border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm bg-light resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <Button
                  onClick={handleUploadPhoto}
                  className={`!py-2.5 !px-8 !text-sm ${!photoFile ? "opacity-50 pointer-events-none" : ""}`}
                >
                  Upload Photo
                </Button>
              </div>
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wide block mb-1.5">
                  Photo
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#2A2A2A] rounded-xl h-52 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition-all overflow-hidden"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <span className="text-4xl mb-2 opacity-40">📷</span>
                      <p className="text-sm text-white/30 font-medium">
                        Click to select a photo
                      </p>
                      <p className="text-xs text-dark/30 mt-1">
                        JPG, PNG up to 10MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
          </div>

          {/* Compare Mode Controls */}
          {photos.length >= 2 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCompareMode((prev) => !prev);
                  setCompareSelection([]);
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  compareMode
                    ? "bg-dark text-white"
                    : "bg-[#1E1E1E] text-white/60 border border-[#2A2A2A] hover:border-[#181818]0"
                }`}
              >
                {compareMode ? "Exit Compare" : "Compare Photos"}
              </button>
              {compareMode && (
                <span className="text-sm text-white/40">
                  Select 2 photos to compare ({compareSelection.length}/2)
                </span>
              )}
            </div>
          )}

          {/* Compare View */}
          {compareMode && selectedPhotos.length === 2 && (
            <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-6">
              <h2 className="text-lg font-bold mb-4">Side-by-Side Comparison</h2>
              <div className="grid grid-cols-2 gap-6">
                {selectedPhotos.map((photo) => (
                  <div key={photo.id} className="text-center">
                    <div className="rounded-xl overflow-hidden bg-light mb-3 aspect-[3/4]">
                      <img
                        src={photo.url}
                        alt={`Progress photo ${photo.date}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-bold">{fmtDateFull(photo.date)}</p>
                    {photo.notes && (
                      <p className="text-xs text-white/40 mt-1">{photo.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {photos.length === 0 ? (
            <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-12 text-center">
              <span className="text-5xl mb-4 block">📸</span>
              <p className="text-white/40 max-w-md mx-auto">
                No progress photos yet. Upload your first one to start tracking
                your transformation!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => {
                const isSelected = compareSelection.includes(photo.id);
                return (
                  <div
                    key={photo.id}
                    onClick={() => compareMode && toggleCompareSelect(photo.id)}
                    className={`rounded-xl overflow-hidden bg-[#1E1E1E] shadow-card transition-all ${
                      compareMode ? "cursor-pointer" : ""
                    } ${
                      isSelected
                        ? "ring-3 ring-primary ring-offset-2"
                        : compareMode
                          ? "hover:ring-2 hover:ring-dark/20"
                          : ""
                    }`}
                  >
                    <div className="aspect-[3/4] bg-light">
                      <img
                        src={photo.url}
                        alt={`Progress photo ${photo.date}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold">{fmtDateFull(photo.date)}</p>
                      {photo.notes && (
                        <p className="text-xs text-white/40 mt-0.5 line-clamp-2">
                          {photo.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MenuItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isBestChoice: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(true);
  const [logoEmoji, setLogoEmoji] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [tips, setTips] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/restaurants/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const r = data.restaurant;
        if (!r) { setError("Restaurant not found"); return; }
        setName(r.name || "");
        setSlug(r.slug || "");
        setLogoEmoji(r.logoUrl || "");
        setIntroduction(r.introduction || "");
        setTips(r.tips || "");
        setIsPublished(r.isPublished || false);
        try {
          const parsed = typeof r.menuItems === "string" ? JSON.parse(r.menuItems) : r.menuItems;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMenuItems(parsed);
          } else {
            setMenuItems([{ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, isBestChoice: false }]);
          }
        } catch {
          setMenuItems([{ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, isBestChoice: false }]);
        }
      })
      .catch(() => setError("Failed to load restaurant"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!slugManual) setSlug(slugify(name));
  }, [name, slugManual]);

  function addRow() {
    setMenuItems((prev) => [
      ...prev,
      { name: "", calories: 0, protein: 0, carbs: 0, fat: 0, isBestChoice: false },
    ]);
  }

  function removeRow(i: number) {
    setMenuItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, field: keyof MenuItem, value: string | number | boolean) {
    setMenuItems((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Name is required"); return; }
    if (!introduction.trim()) { setError("Introduction is required"); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/restaurants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug,
          logoUrl: logoEmoji || null,
          introduction: introduction.trim(),
          tips: tips.trim() || null,
          menuItems: menuItems.filter((m) => m.name.trim()),
          isPublished,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update");
        return;
      }
      router.push("/admin/restaurants");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E51A1A]";
  const labelClass = "block text-sm font-semibold text-white mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E51A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/restaurants"
            className="text-sm text-white/60 hover:text-[#E51A1A] transition-colors mb-2 inline-block"
          >
            &larr; Back to Restaurants
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit Restaurant</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-white mb-2">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setSlugManual(false); }}
                placeholder="e.g. McDonald's"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                placeholder="auto-generated-from-name"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Logo Emoji</label>
            <input
              type="text"
              value={logoEmoji}
              onChange={(e) => setLogoEmoji(e.target.value)}
              placeholder="e.g. burger emoji or URL"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Introduction *</label>
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={4}
              placeholder="Brief guide introduction..."
              className={inputClass + " resize-y"}
            />
          </div>
          <div>
            <label className={labelClass}>Tips</label>
            <textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              rows={3}
              placeholder="Ordering tips..."
              className={inputClass + " resize-y"}
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Menu Items</h2>
            <button
              type="button"
              onClick={addRow}
              className="text-xs px-3 py-1.5 bg-[#E51A1A] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              + Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase tracking-wide border-b border-[#2A2A2A]">
                  <th className="text-left py-2 pr-2">Item Name</th>
                  <th className="text-left py-2 px-2">Cal</th>
                  <th className="text-left py-2 px-2">Protein</th>
                  <th className="text-left py-2 px-2">Carbs</th>
                  <th className="text-left py-2 px-2">Fat</th>
                  <th className="text-center py-2 px-2">Best</th>
                  <th className="py-2 pl-2"></th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, i) => (
                  <tr key={i} className="border-b border-[#2A2A2A]/50">
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateRow(i, "name", e.target.value)}
                        placeholder="Item name"
                        className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-[#E51A1A]"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min={0}
                        value={item.calories}
                        onChange={(e) => updateRow(i, "calories", Number(e.target.value))}
                        className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-2 py-2 text-white text-sm w-20 focus:outline-none focus:border-[#E51A1A]"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={item.protein}
                        onChange={(e) => updateRow(i, "protein", Number(e.target.value))}
                        className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-2 py-2 text-white text-sm w-20 focus:outline-none focus:border-[#E51A1A]"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={item.carbs}
                        onChange={(e) => updateRow(i, "carbs", Number(e.target.value))}
                        className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-2 py-2 text-white text-sm w-20 focus:outline-none focus:border-[#E51A1A]"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={item.fat}
                        onChange={(e) => updateRow(i, "fat", Number(e.target.value))}
                        className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-2 py-2 text-white text-sm w-20 focus:outline-none focus:border-[#E51A1A]"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={item.isBestChoice}
                        onChange={(e) => updateRow(i, "isBestChoice", e.target.checked)}
                        className="w-4 h-4 accent-[#E51A1A]"
                      />
                    </td>
                    <td className="py-2 pl-2">
                      {menuItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(i)}
                          className="text-red-400 hover:text-red-300 transition-colors text-sm px-2"
                        >
                          &times;
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Published + Submit */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPublished((p) => !p)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                  isPublished ? "bg-[#E51A1A]" : "bg-[#2A2A2A]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-[#1E1E1E] rounded-full transition-transform duration-200 ${
                    isPublished ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-white">
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#E51A1A] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Update Restaurant"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

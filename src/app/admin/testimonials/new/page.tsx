"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTestimonialPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [clientName, setClientName] = useState("");
  const [duration, setDuration] = useState("");
  const [quote, setQuote] = useState("");
  const [category] = useState("hub");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string | null) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!clientName.trim()) { setError("Client name is required"); return; }
    if (!quote.trim()) { setError("Quote is required"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          duration: duration.trim(),
          quote: quote.trim(),
          category,
          profilePhoto,
          beforePhoto,
          afterPhoto,
          isFeatured,
          displayOrder,
          isPublished,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }
      router.push("/admin/testimonials");
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/testimonials"
          className="text-sm text-white/60 hover:text-[#E51A1A] transition-colors mb-2 inline-block"
        >
          &larr; Back to Testimonials
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New Testimonial</h1>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-white mb-2">Client Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Client Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Ahmed K."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 months"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Quote *</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={4}
              placeholder="Client testimonial quote..."
              className={inputClass + " resize-y"}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Category</label>
              <select value={category} disabled className={inputClass + " opacity-60"}>
                <option value="hub">Hub</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Display Order</label>
              <input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-white mb-2">Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setProfilePhoto)}
                className="text-sm text-white/60 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E51A1A] file:text-white hover:file:opacity-90"
              />
              {profilePhoto && (
                <img src={profilePhoto} alt="Profile" className="mt-2 w-20 h-20 rounded-full object-cover border border-[#2A2A2A]" />
              )}
            </div>
            <div>
              <label className={labelClass}>Before Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setBeforePhoto)}
                className="text-sm text-white/60 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E51A1A] file:text-white hover:file:opacity-90"
              />
              {beforePhoto && (
                <img src={beforePhoto} alt="Before" className="mt-2 max-w-[120px] rounded-lg border border-[#2A2A2A]" />
              )}
            </div>
            <div>
              <label className={labelClass}>After Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setAfterPhoto)}
                className="text-sm text-white/60 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E51A1A] file:text-white hover:file:opacity-90"
              />
              {afterPhoto && (
                <img src={afterPhoto} alt="After" className="mt-2 max-w-[120px] rounded-lg border border-[#2A2A2A]" />
              )}
            </div>
          </div>
        </div>

        {/* Toggles + Submit */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="flex items-center gap-8 mb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFeatured((p) => !p)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                  isFeatured ? "bg-[#FF6B00]" : "bg-[#2A2A2A]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-[#1E1E1E] rounded-full transition-transform duration-200 ${
                    isFeatured ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-white">Featured</span>
            </div>
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
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#E51A1A] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Testimonial"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

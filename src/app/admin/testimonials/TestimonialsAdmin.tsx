"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Testimonial {
  id: number;
  clientName: string;
  duration: string;
  quote: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
}

export default function TestimonialsAdmin({
  testimonials: initial,
}: {
  testimonials: Testimonial[];
}) {
  const [testimonials, setTestimonials] = useState(initial);
  const router = useRouter();

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  }

  async function toggleFeatured(id: number, current: boolean) {
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !current }),
    });
    if (res.ok) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isFeatured: !current } : t
        )
      );
    }
  }

  async function togglePublished(id: number, current: boolean) {
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    if (res.ok) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isPublished: !current } : t
        )
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Manage Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          + Add Testimonial
        </Link>
      </div>

      <p className="text-sm text-white/50">
        {testimonials.length} testimonials total
      </p>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-white text-sm">{t.clientName}</p>
                <p className="text-xs text-white/40">{t.duration}</p>
              </div>
              <button
                onClick={() => toggleFeatured(t.id, t.isFeatured)}
                className={`text-lg cursor-pointer bg-transparent border-none ${
                  t.isFeatured ? "opacity-100" : "opacity-20"
                }`}
                title={t.isFeatured ? "Remove from featured" : "Mark as featured"}
              >
                {"\u2B50"}
              </button>
            </div>

            <p className="text-sm text-white/60 line-clamp-2 flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => togglePublished(t.id, t.isPublished)}
                className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer border-none ${
                  t.isPublished
                    ? "bg-green-900/40 text-green-400"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {t.isPublished ? "Published" : "Draft"}
              </button>
              {t.isFeatured && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-900/40 text-amber-400">
                  Featured
                </span>
              )}
            </div>

            <div className="flex gap-2 mt-auto pt-2 border-t border-[#2A2A2A]">
              <Link
                href={`/admin/testimonials/${t.id}/edit`}
                className="flex-1 text-center text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(t.id)}
                className="flex-1 text-xs px-3 py-1.5 bg-red-900/20 text-red-400 rounded-lg font-medium hover:bg-red-900/30 transition-colors cursor-pointer border-none"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

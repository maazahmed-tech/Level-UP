"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WorkoutRow {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  duration: string | null;
  isPublished: boolean;
  createdAt: string;
  subcategoryName: string;
  categoryName: string;
}

export default function AdminWorkoutsClient({
  workouts,
}: {
  workouts: WorkoutRow[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this workout?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/workouts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete workout");
      }
    } catch {
      alert("Failed to delete workout");
    } finally {
      setDeleting(null);
    }
  }

  async function togglePublished(id: number, current: boolean) {
    try {
      const w = workouts.find((w) => w.id === id);
      if (!w) return;
      await fetch(`/api/admin/workouts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...w,
          isPublished: !current,
          instructions: [],
          subcategoryId: 0, // Will be ignored since we pass all fields
        }),
      });
      router.refresh();
    } catch {
      alert("Failed to update workout");
    }
  }

  const difficultyColor: Record<string, string> = {
    Beginner: "bg-green-500/20 text-green-400",
    Intermediate: "bg-[#FF6B00]/20 text-[#FF6B00]",
    Advanced: "bg-[#E51A1A]/20 text-[#E51A1A]",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Workouts</h1>
          <p className="text-white/50 mt-1">
            Manage workout videos for the hub.
          </p>
        </div>
        <Link
          href="/admin/workouts/new"
          className="bg-[#E51A1A] hover:bg-[#E51A1A]/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          + Add Workout
        </Link>
      </div>

      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="text-left px-6 py-4 text-white/50 font-semibold">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-white/50 font-semibold">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-white/50 font-semibold">
                  Difficulty
                </th>
                <th className="text-left px-6 py-4 text-white/50 font-semibold">
                  Duration
                </th>
                <th className="text-left px-6 py-4 text-white/50 font-semibold">
                  Published
                </th>
                <th className="text-right px-6 py-4 text-white/50 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {workouts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-white/40"
                  >
                    No workouts yet. Add your first workout to get started.
                  </td>
                </tr>
              ) : (
                workouts.map((w) => (
                  <tr
                    key={w.id}
                    className="border-b border-[#2A2A2A] last:border-b-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">
                        {w.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {w.categoryName}{" "}
                      <span className="text-white/30">&gt;</span>{" "}
                      {w.subcategoryName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          difficultyColor[w.difficulty] ||
                          "bg-white/10 text-white/50"
                        }`}
                      >
                        {w.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {w.duration || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(w.id, w.isPublished)}
                        className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                          w.isPublished ? "bg-[#E51A1A]" : "bg-[#2A2A2A]"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            w.isPublished ? "left-5" : "left-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/workouts/${w.id}/edit`}
                          className="text-white/50 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(w.id)}
                          disabled={deleting === w.id}
                          className="text-red-400/60 hover:text-red-400 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          {deleting === w.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

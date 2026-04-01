"use client";

import { useState } from "react";
import Link from "next/link";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  isPublished: boolean;
  itemCount: number;
}

export default function RestaurantsAdmin({
  restaurants: initial,
}: {
  restaurants: Restaurant[];
}) {
  const [restaurants, setRestaurants] = useState(initial);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this restaurant guide?"))
      return;
    const res = await fetch(`/api/admin/restaurants/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    }
  }

  async function togglePublished(id: number, current: boolean) {
    const res = await fetch(`/api/admin/restaurants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    if (res.ok) {
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isPublished: !current } : r
        )
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">
          Manage Restaurant Guides
        </h1>
        <Link
          href="/admin/restaurants/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          + Add Restaurant
        </Link>
      </div>

      <p className="text-sm text-white/50">
        {restaurants.length} restaurant guides
      </p>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <span className="text-4xl">{restaurant.logoUrl || "🍽"}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">
                  {restaurant.name}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {restaurant.itemCount} menu items
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                togglePublished(restaurant.id, restaurant.isPublished)
              }
              className={`text-xs font-semibold px-3 py-1 rounded-full w-fit cursor-pointer border-none ${
                restaurant.isPublished
                  ? "bg-green-900/40 text-green-400"
                  : "bg-white/5 text-white/30"
              }`}
            >
              {restaurant.isPublished ? "Published" : "Draft"}
            </button>

            <div className="flex gap-2 mt-auto pt-2 border-t border-[#2A2A2A]">
              <Link
                href={`/admin/restaurants/${restaurant.id}/edit`}
                className="flex-1 text-center text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(restaurant.id)}
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

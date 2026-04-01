"use client";

import { useState } from "react";
import Link from "next/link";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  introduction: string;
  itemCount: number;
}

export default function RestaurantsHub({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [search, setSearch] = useState("");

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Restaurant Survival Guides</h1>
      <p className="text-white/50 mb-8">
        Macro-friendly picks from your favourite restaurant chains. Know exactly
        what to order before you go.
      </p>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl py-3 px-4 focus:border-primary focus:outline-none text-white placeholder:text-white/30"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-white/40">
            No restaurants found matching &ldquo;{search}&rdquo;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/hub/restaurants/${restaurant.slug}`}
              className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-primary/50 transition-colors group"
            >
              {/* Emoji header */}
              <div className="bg-[#161616] flex items-center justify-center py-8">
                <span className="text-5xl group-hover:scale-110 transition-transform">
                  {restaurant.logoUrl || "🍽"}
                </span>
              </div>

              {/* Card body */}
              <div className="p-5">
                <h2 className="font-bold text-lg text-white mb-1">
                  {restaurant.name}
                </h2>
                <p className="text-sm text-primary font-semibold mb-2">
                  {restaurant.itemCount} items listed
                </p>
                <p className="text-white/50 text-sm line-clamp-2">
                  {restaurant.introduction}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

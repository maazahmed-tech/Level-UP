"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;

type SortOption = "newest" | "name-az" | "cal-low" | "cal-high";

const CATEGORY_EMOJI: Record<string, string> = {
  Breakfast: "\uD83E\uDD5E",
  Lunch: "\uD83E\uDD57",
  Dinner: "\uD83C\uDF56",
  Snacks: "\uD83E\uDD5C",
  Desserts: "\uD83C\uDF6B",
  Fakeaways: "\uD83C\uDF55",
};

interface RecipeData {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: string[];
  instructions: string[];
  videoUrl: string | null;
  imageUrl: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  prepTimeMins: number;
  cookTimeMins: number;
}

interface RecipeBrowserProps {
  recipes: RecipeData[];
  categories: string[];
  tags: string[];
}

export default function RecipeBrowser({
  recipes,
  categories,
  tags,
}: RecipeBrowserProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...recipes];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== "All") {
      result = result.filter((r) => r.category === activeCategory);
    }

    if (activeTags.size > 0) {
      result = result.filter((r) =>
        Array.from(activeTags).every((tag) => r.tags.includes(tag))
      );
    }

    switch (sort) {
      case "name-az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "cal-low":
        result.sort((a, b) => a.calories - b.calories);
        break;
      case "cal-high":
        result.sort((a, b) => b.calories - a.calories);
        break;
      case "newest":
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [recipes, search, activeCategory, activeTags, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedRecipes = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className="text-3xl font-black mb-2 text-white">Recipes</h1>
      <p className="text-white/60 mb-8">
        Browse macro-friendly recipes with video guides.
      </p>

      {/* Search Bar */}
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search recipes by name or description..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl py-3 pl-12 pr-4 focus:border-[#E51A1A] focus:outline-none text-white placeholder:text-white/30"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? "bg-[#E51A1A] text-white shadow-sm"
                : "bg-[#1E1E1E] text-white/60 border border-[#2A2A2A] hover:border-[#E51A1A]/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dietary Tag Chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeTags.has(tag)
                  ? "bg-[#E51A1A] text-white"
                  : "bg-[#1E1E1E] text-white/60 border border-[#2A2A2A] hover:border-[#E51A1A]/30"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Sort + Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-sm text-white/60">
          <span className="font-semibold text-white">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "recipe" : "recipes"} found
        </p>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortOption);
            setPage(1);
          }}
          className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl py-2 px-3 text-sm focus:border-[#E51A1A] focus:outline-none text-white cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="name-az">Name A-Z</option>
          <option value="cal-low">Lowest Calories</option>
          <option value="cal-high">Highest Calories</option>
        </select>
      </div>

      {/* Recipe Grid */}
      {paginatedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/hub/recipes/${recipe.slug}`}
              className="group bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#E51A1A]/30"
            >
              {/* Image / Placeholder */}
              <div className="relative h-[200px] bg-gradient-to-br from-[#2A2A2A] to-[#1E1E1E] flex items-center justify-center">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {CATEGORY_EMOJI[recipe.category] || "\uD83C\uDF7D\uFE0F"}
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-[#E51A1A]/20 text-[#E51A1A] text-xs font-bold px-3 py-1 rounded-full">
                  {recipe.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#E51A1A] transition-colors">
                  {recipe.title}
                </h3>

                <div className="flex items-center gap-3 text-sm text-white/60 mb-3">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                      />
                    </svg>
                    {recipe.calories} kcal
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {recipe.prepTimeMins + recipe.cookTimeMins} min
                  </span>
                </div>

                {/* Macro Bar */}
                <div className="flex items-center gap-4 text-xs text-white/60">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E51A1A]" />
                    P: {recipe.protein}g
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                    C: {recipe.carbs}g
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
                    F: {recipe.fat}g
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-12 text-center mb-8">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white mb-2">
            No recipes found
          </h2>
          <p className="text-white/50">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 bg-[#1E1E1E] border border-[#2A2A2A] text-white/60 hover:border-[#E51A1A]/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-white/60">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 bg-[#1E1E1E] border border-[#2A2A2A] text-white/60 hover:border-[#E51A1A]/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

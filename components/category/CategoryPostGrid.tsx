"use client";

import { useState, useEffect } from "react";
import type { Post } from "@/lib/types";
import type { Subtopic } from "@/lib/types";
import { PostCard } from "./PostCard";
import { PostGridSkeleton } from "./PostCardSkeleton";

interface CategoryPostGridProps {
  posts: Post[];
  subtopics: Subtopic[];
}

/**
 * Client component: owns the subtopic filter state and the simulated
 * 550ms skeleton-loading delay (per the design spec).
 */
export function CategoryPostGrid({ posts, subtopics }: CategoryPostGridProps) {
  const [activeSubtopic, setActiveSubtopic] = useState<string>("todos");
  const [loading, setLoading] = useState(true);

  // Simulate 550ms skeleton loading on mount (spec-compliant).
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(id);
  }, []);

  // Re-show skeleton for a short flicker when the filter changes.
  function handleFilter(id: string) {
    setActiveSubtopic(id);
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  }

  const filtered =
    activeSubtopic === "todos"
      ? posts
      : posts.filter((p) => p.subtopicId === activeSubtopic);

  return (
    <div>
      {/* Subtopic filter pills */}
      {subtopics.length > 0 && (
        <div className="gj-scroll mb-7 flex items-center gap-2.5 overflow-x-auto pb-1">
          {[{ id: "todos", label: "Todos" }, ...subtopics].map((sub) => {
            const active = sub.id === activeSubtopic;
            return (
              <button
                key={sub.id}
                onClick={() => handleFilter(sub.id)}
                aria-pressed={active}
                className={[
                  "flex-none whitespace-nowrap rounded-pill px-4 py-2 font-inter text-[14px] font-semibold transition-colors duration-150",
                  active
                    ? "bg-green-900 text-white"
                    : "border border-border bg-surface text-green-700 hover:border-green-700/60 hover:text-green-900",
                ].join(" ")}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Post grid or skeleton */}
      {loading ? (
        <PostGridSkeleton />
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted">
          Nenhum artigo nesta subcategoria ainda.
        </div>
      ) : (
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPostGrid;

"use client";

import { useState } from "react";
import type { Post, PostType } from "@/lib/types";
import { PostCard } from "@/components/category/PostCard";

type Filter = "todos" | PostType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "Guia", label: "Guias" },
  { id: "Comparativo", label: "Comparativos" },
];

export function AuthorPostFilter({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<Filter>("todos");

  const filtered =
    active === "todos" ? posts : posts.filter((p) => p.type === active);

  return (
    <div>
      {/* Filter pills */}
      <div className="mb-7 flex items-center gap-2.5">
        {FILTERS.map((f) => {
          const isActive = f.id === active;
          return (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              aria-pressed={isActive}
              className={[
                "rounded-pill px-4 py-2 font-inter text-[14px] font-semibold transition-colors duration-150",
                isActive
                  ? "bg-green-900 text-white"
                  : "border border-border bg-surface text-green-700 hover:border-green-700/60 hover:text-green-900",
              ].join(" ")}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted">
          Nenhum artigo nesta categoria ainda.
        </p>
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

export default AuthorPostFilter;

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { categories } from "@/lib/mock-data";
import type { Post } from "@/lib/types";
import { PostCard } from "@/components/category/PostCard";

/* ------------------------------------------------------------------ */
/* Search logic                                                        */
/* ------------------------------------------------------------------ */

function searchPosts(posts: Post[], query: string): Post[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function SearchPageContent({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autofocus on mount.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce: update live query 150ms after the user stops typing,
  // and sync the URL ?q= param for bookmarking / back-nav.
  const handleInput = useCallback(
    (value: string) => {
      setInputValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setQuery(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
          params.set("q", value.trim());
        } else {
          params.delete("q");
        }
        router.replace(`/busca?${params.toString()}`, { scroll: false });
      }, 150);
    },
    [router, searchParams]
  );

  function clearInput() {
    setInputValue("");
    setQuery("");
    router.replace("/busca", { scroll: false });
    inputRef.current?.focus();
  }

  const results = searchPosts(posts, query);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="mx-auto max-w-container px-6 py-12">
      {/* Search heading */}
      <h1 className="mb-7 text-center font-lora text-[28px] font-bold tracking-[-0.01em] text-green-900 sm:text-[34px]">
        O que você está procurando?
      </h1>

      {/* Search input */}
      <div className="mx-auto mb-10 max-w-[640px]">
        <div className="relative flex items-center">
          <SearchInputIcon className="pointer-events-none absolute left-4 h-5 w-5 flex-none text-muted" />

          <input
            ref={inputRef}
            type="search"
            placeholder="Buscar guias e comparativos…"
            value={inputValue}
            onChange={(e) => handleInput(e.target.value)}
            aria-label="Campo de busca"
            className="w-full rounded-[14px] border border-border bg-surface py-4 pl-[50px] pr-[50px] font-inter text-[20px] text-ink shadow-card outline-none transition-shadow duration-150 placeholder:text-muted focus:border-green-700/50 focus:shadow-[0_0_0_3px_rgba(45,106,79,0.12)]"
          />

          {inputValue && (
            <button
              onClick={clearInput}
              aria-label="Limpar busca"
              className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-[#F0EDE4] hover:text-ink"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results / states */}
      {hasQuery ? (
        results.length > 0 ? (
          <div>
            <p className="mb-6 font-inter text-[14.5px] font-semibold text-muted">
              {results.length} resultado{results.length !== 1 && "s"} para{" "}
              <span className="text-green-900">"{query.trim()}"</span>
            </p>
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              }}
            >
              {results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyResults query={query.trim()} />
        )
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty states                                                        */
/* ------------------------------------------------------------------ */

function EmptyResults({ query }: { query: string }) {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0EDE4]">
        <SearchInputIcon className="h-7 w-7 text-muted" />
      </div>
      <h2 className="font-lora text-[22px] font-bold text-green-900">
        Nenhum resultado para "{query}"
      </h2>
      <p className="mt-2 text-[15px] text-muted">
        Tente outros termos ou explore uma das categorias abaixo.
      </p>
      <CategorySuggestions className="mt-8" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-4 text-center">
      <p className="mb-8 text-[16px] text-muted">
        Digite para buscar entre nossos guias e comparativos.
      </p>
      <CategorySuggestions />
    </div>
  );
}

function CategorySuggestions({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.06em] text-muted">
        Explore por categoria
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2 font-inter text-[14px] font-semibold text-green-700 no-underline transition-colors hover:border-green-700/50 hover:bg-green-tint hover:text-green-900"
          >
            {cat.label}
            <span className="text-[12px] text-muted-2">{cat.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function SearchInputIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default SearchPageContent;

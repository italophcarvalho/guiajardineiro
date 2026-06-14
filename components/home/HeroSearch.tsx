"use client";

import { useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const popularTags = [
  { label: "Tesouras de poda", slug: "melhores-tesouras-de-poda-2026" },
  { label: "Suculentas", slug: "suculentas-para-iniciantes" },
  { label: "Adubo orgânico", slug: "guia-de-adubacao-organica" },
  { label: "Irrigação", slug: "melhores-kits-de-irrigacao-gotejamento" },
];

export function HeroSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (q) router.push(`/busca?q=${encodeURIComponent(q)}`);
  }

  return (
    <div>
      {/* Search box */}
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex max-w-[520px] items-center gap-2 rounded-[14px] border border-border-3 bg-surface p-2 pl-[18px] shadow-card"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6F766B"
          strokeWidth="2"
          strokeLinecap="round"
          className="flex-none"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          placeholder="O que você quer cultivar hoje?"
          aria-label="Buscar artigos"
          className="flex-1 border-none bg-transparent font-inter text-[16px] text-ink outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="flex-none rounded-[10px] bg-terracotta px-5 py-3 font-inter text-[15px] font-semibold text-surface transition-colors hover:bg-terracotta-hover"
        >
          Buscar
        </button>
      </form>

      {/* Popular tags */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-muted">Popular:</span>
        {popularTags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/artigo/${tag.slug}`}
            className="font-inter text-[13px] font-semibold text-green-700 underline underline-offset-[3px] no-underline decoration-green-700/40 hover:decoration-green-700"
            style={{ textDecoration: "underline" }}
          >
            {tag.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

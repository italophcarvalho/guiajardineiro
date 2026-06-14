"use client";

import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/mock-data";

/**
 * Site header — sticky, backdrop blur, 3-column grid.
 *
 * Grid columns: [burger | logo | search]
 * Below: horizontal category strip (collapses into dropdown on mobile).
 *
 * Marked "use client" because it manages mobile nav state and the search
 * input navigates programmatically.
 */
export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = searchRef.current?.value.trim();
    if (q) router.push(`/busca?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/[0.88] backdrop-blur-md backdrop-saturate-150">
      {/* ── Main row ─────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-container grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-[14px]">

        {/* Left: burger */}
        <div className="flex items-center justify-start">
          <button
            onClick={() => setNavOpen((o) => !o)}
            aria-label={navOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-border bg-surface text-green-900 transition-colors hover:bg-green-tint"
          >
            {navOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Center: logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline"
          aria-label="Guia Jardineiro — Página inicial"
        >
          <span className="inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] bg-green-900">
            <LeafLogoIcon />
          </span>
          <span className="font-lora text-[21px] font-bold tracking-[-0.01em] text-green-900">
            Guia Jardineiro
          </span>
        </Link>

        {/* Right: search */}
        <div className="flex items-center justify-end">
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="flex w-full max-w-[280px] items-center gap-2 rounded-pill border border-border bg-surface px-[14px] py-2"
          >
            <SearchIcon className="h-4 w-4 flex-none text-muted" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Buscar..."
              aria-label="Buscar artigos"
              className="w-full border-none bg-transparent font-inter text-sm text-ink outline-none placeholder:text-muted"
            />
          </form>
        </div>
      </div>

      {/* ── Category strip (desktop) ─────────────────────────────── */}
      <nav
        aria-label="Categorias"
        className="gj-scroll hidden overflow-x-auto md:block"
      >
        <div className="mx-auto flex max-w-container gap-1.5 px-6 pb-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="flex-none whitespace-nowrap rounded-pill px-[13px] py-[7px] font-inter text-[13.5px] font-semibold text-[#3A5D45] no-underline transition-colors hover:bg-green-tint hover:text-green-900"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Mobile dropdown ──────────────────────────────────────── */}
      <div
        id="mobile-nav"
        aria-hidden={!navOpen}
        className={`overflow-hidden border-t border-border bg-surface transition-all duration-200 md:hidden ${
          navOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Categorias (menu mobile)" className="px-6 pb-4 pt-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              onClick={() => setNavOpen(false)}
              className="block border-b border-[#F0EEE6] py-[11px] font-inter text-[15px] font-semibold text-green-900 no-underline last:border-none"
            >
              {cat.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function LeafLogoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9CC4A8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22c0-6 0-10 0-10" />
      <path d="M12 12C12 7 8 4 3 4c0 5 4 8 9 8Z" fill="#2D6A4F" stroke="#9CC4A8" />
      <path d="M12 14c0-4 4-7 9-7 0 4-4 7-9 7Z" fill="#40916C" stroke="#C9E4D2" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default Header;

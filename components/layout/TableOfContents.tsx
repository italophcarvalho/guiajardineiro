"use client";

import { useEffect, useRef, useState } from "react";

export interface Heading {
  id: string;
  text: string;
  /** 2 = H2, 3 = H3 — only H2 and H3 are rendered */
  level: 2 | 3;
}

export interface TableOfContentsProps {
  headings: Heading[];
  /** Label above the list. Default "Neste artigo". */
  label?: string;
}

/**
 * Sticky sidebar Table of Contents.
 *
 * Tracks the active section via IntersectionObserver watching the heading
 * elements in the article. The active item gets a left border + green tint.
 */
export function TableOfContents({
  headings,
  label = "Neste artigo",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    // Keep track of which headings are visible; pick the topmost one.
    const visible = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id") ?? "";
          if (entry.isIntersecting) {
            visible.set(id, entry.boundingClientRect.top);
          } else {
            visible.delete(id);
          }
        });

        if (visible.size > 0) {
          // Pick the heading closest to the top of the viewport.
          const topId = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0];
          setActiveId(topId);
        }
      },
      {
        // Fire when a heading enters the upper 20% of the viewport.
        rootMargin: "0px 0px -80% 0px",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="rounded-card border border-border bg-surface p-[18px]">
      <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-muted">
        {label}
      </p>
      <nav aria-label="Índice do artigo">
        <ul className="flex flex-col gap-0.5">
          {headings.map((h) => {
            const isActive = h.id === activeId;
            return (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={[
                    "block rounded-r-lg border-l-[2px] px-2.5 py-[7px] font-inter text-[14px] no-underline transition-all duration-150",
                    h.level === 3 ? "pl-5" : "",
                    isActive
                      ? "border-green-700 bg-green-tint font-semibold text-green-700"
                      : "border-transparent text-[#3A5D45] hover:border-green-700/50 hover:bg-green-tint/60 hover:text-green-900",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default TableOfContents;

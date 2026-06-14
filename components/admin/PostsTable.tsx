"use client";

import { useState } from "react";
import Link from "next/link";
import { posts } from "@/lib/mock-data";
import type { PostStatus } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* View model                                                          */
/* ------------------------------------------------------------------ */

/**
 * A few posts are overridden to non-published states so the status tabs
 * and badges are meaningful in the demo (the mock posts are all published).
 * Matches the statuses shown in the admin prototype.
 */
const STATUS_OVERRIDE: Record<string, PostStatus> = {
  "melhores-kits-de-irrigacao-gotejamento": "agendado",
  "guia-de-adubacao-organica": "rascunho",
  "hidroponia-caseira-barata": "rascunho",
};

interface Row {
  slug: string;
  title: string;
  categoryLabel: string;
  authorName: string;
  status: PostStatus;
  views: string;
  ctr: string;
  date: string;
}

const DASH = "—";

const rows: Row[] = posts.map((p) => {
  const status = STATUS_OVERRIDE[p.slug] ?? p.status;
  const isPublished = status === "publicado";
  const isScheduled = status === "agendado";
  return {
    slug: p.slug,
    title: p.title,
    categoryLabel: p.categoryLabel,
    authorName: p.authorName,
    status,
    // Published: real metrics. Scheduled: metrics dash, keep date. Draft: all dash.
    views: isPublished ? (p.views ?? 0).toLocaleString("pt-BR") : DASH,
    ctr: isPublished ? p.affiliateCtr ?? DASH : DASH,
    date: isPublished || isScheduled ? p.date : DASH,
  };
});

/* ------------------------------------------------------------------ */
/* Status badge config                                                 */
/* ------------------------------------------------------------------ */

const STATUS_META: Record<
  PostStatus,
  { label: string; bg: string; text: string }
> = {
  publicado: { label: "Publicado", bg: "#EAF1EA", text: "#2D6A4F" },
  agendado: { label: "Agendado", bg: "#FBF1DC", text: "#B07A14" },
  rascunho: { label: "Rascunho", bg: "#EFEDE4", text: "#6F766B" },
};

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

type Tab = "todos" | PostStatus;

const TABS: { id: Tab; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "publicado", label: "Publicados" },
  { id: "rascunho", label: "Rascunhos" },
  { id: "agendado", label: "Agendados" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function PostsTable() {
  const [tab, setTab] = useState<Tab>("todos");

  const filtered = tab === "todos" ? rows : rows.filter((r) => r.status === tab);

  return (
    <div className="overflow-hidden rounded-card-lg border border-border bg-surface">
      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#EFEDE4] p-3.5">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-pressed={active}
              className={[
                "rounded-pill px-3.5 py-1.5 font-inter text-[13.5px] font-semibold transition-colors duration-150",
                active
                  ? "bg-green-900 text-white"
                  : "bg-[#F4F1E8] text-[#3A5D45] hover:bg-green-tint",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="gj-scroll overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-[13.5px]">
          <thead>
            <tr className="text-left text-[11.5px] uppercase tracking-[0.04em] text-muted">
              <th className="px-[18px] py-3 font-semibold">Título</th>
              <th className="px-3 py-3 font-semibold">Autor</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 text-right font-semibold">Views</th>
              <th className="px-3 py-3 text-right font-semibold">CTR afiliado</th>
              <th className="px-3 py-3 font-semibold">Data</th>
              <th className="px-[18px] py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const meta = STATUS_META[r.status];
              return (
                <tr key={r.slug} className="border-t border-[#F0EEE6]">
                  {/* Title + category */}
                  <td className="max-w-[340px] px-[18px] py-3.5">
                    <div className="font-semibold leading-[1.3] text-ink">
                      {r.title}
                    </div>
                    <div className="mt-[3px] text-[11.5px] font-semibold uppercase tracking-[0.03em] text-green-700">
                      {r.categoryLabel}
                    </div>
                  </td>

                  {/* Author */}
                  <td className="whitespace-nowrap px-3 py-3.5 text-[#4A5249]">
                    {r.authorName}
                  </td>

                  {/* Status badge */}
                  <td className="px-3 py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill px-2.5 py-1 text-[12px] font-semibold"
                      style={{ background: meta.bg, color: meta.text }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: meta.text }}
                      />
                      {meta.label}
                    </span>
                  </td>

                  {/* Views */}
                  <td className="whitespace-nowrap px-3 py-3.5 text-right font-semibold text-ink">
                    {r.views}
                  </td>

                  {/* CTR */}
                  <td className="whitespace-nowrap px-3 py-3.5 text-right text-[#4A5249]">
                    {r.ctr}
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-3 py-3.5 text-muted">
                    {r.date}
                  </td>

                  {/* Edit */}
                  <td className="whitespace-nowrap px-[18px] py-2.5 text-right">
                    <Link
                      href={`/admin/editor?id=${r.slug}`}
                      className="inline-block rounded-lg border border-border-3 bg-surface px-3.5 py-1.5 font-inter text-[12.5px] font-semibold text-green-900 no-underline transition-colors hover:border-callout-pros-border hover:bg-green-tint"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostsTable;

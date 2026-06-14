import Link from "next/link";
import { PostsTable } from "@/components/admin/PostsTable";

/**
 * Admin — Conteúdo (CMS dashboard).
 * Header + stats strip are static (Server Component); the status tabs and
 * filtered table live in the PostsTable client component.
 */

const STATS = [
  { label: "Total de posts", value: "48", dot: "#1B4332" },
  { label: "Publicados", value: "39", dot: "#2D6A4F" },
  { label: "Rascunhos", value: "6", dot: "#B0A99A" },
  { label: "Agendados", value: "3", dot: "#E8A02C" },
];

export default function AdminContentPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-lora text-[26px] font-bold tracking-[-0.01em] text-green-900">
            Conteúdo
          </h1>
          <p className="mt-1 text-sm text-muted">
            Gerencie, edite e publique os artigos do site.
          </p>
        </div>

        <Link
          href="/admin/editor"
          className="inline-flex items-center gap-2 rounded-[11px] bg-terracotta px-5 py-3 font-inter text-[14.5px] font-semibold text-white no-underline transition-colors hover:bg-terracotta-hover"
        >
          <PlusIcon />
          Novo post
        </Link>
      </div>

      {/* Stats strip */}
      <div
        className="mb-6 grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-card-lg border border-border bg-surface px-5 py-4"
          >
            <div className="flex items-center gap-2 text-[13px] font-semibold text-muted">
              <span
                className="h-[9px] w-[9px] rounded-full"
                style={{ background: s.dot }}
              />
              {s.label}
            </div>
            <div className="mt-1.5 font-lora text-[30px] font-bold text-green-900">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Posts table */}
      <PostsTable />
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

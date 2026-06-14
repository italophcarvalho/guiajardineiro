import Link from "next/link";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/artigo/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-border bg-surface no-underline transition-all duration-200 hover:-translate-y-[3px] hover:shadow-card-hover"
    >
      {/* Thumbnail */}
      <div
        className="relative flex aspect-[16/10] items-center justify-center"
        style={{ background: post.tint }}
      >
        <span
          className={[
            "absolute left-2.5 top-2.5 rounded-pill px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em]",
            post.type === "Comparativo"
              ? "bg-amber/25 text-amber-text"
              : "bg-white/90 text-terracotta",
          ].join(" ")}
        >
          {post.type}
        </span>
        <LeafThumbnailIcon />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-[18px]">
        <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-terracotta">
          {post.categoryLabel}
        </div>

        <h3 className="mt-1.5 font-lora text-[18px] font-semibold leading-[1.28] text-ink group-hover:text-green-900">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-muted">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-3 text-[12.5px] text-muted-2">
          <span>{post.authorName}</span>
          <span aria-hidden="true">·</span>
          <span>{post.date}</span>
          <span aria-hidden="true">·</span>
          <span>{post.read}</span>
        </div>
      </div>
    </Link>
  );
}

function LeafThumbnailIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-green-700 opacity-50"
    >
      <path d="M12 20v-8" />
      <path d="M12 12C12 7 8 5 4 5c0 5 4 7 8 7Z" />
      <path d="M12 13c0-4 4-7 8-7 0 4-4 7-8 7Z" />
    </svg>
  );
}

export default PostCard;

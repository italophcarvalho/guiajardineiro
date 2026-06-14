/**
 * Shimmer skeleton for a PostCard — shown during the 550ms loading delay
 * on the category page (Suspense / loading state).
 *
 * The shimmer animation is registered in tailwind.config.ts:
 *   keyframes.shimmer: backgroundPosition -450px→450px
 *   animation.shimmer: "shimmer 1.3s infinite linear"
 */
export function PostCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-card border border-border bg-surface"
      aria-hidden="true"
    >
      {/* Thumbnail */}
      <div
        className="aspect-[16/10] animate-shimmer"
        style={{ background: "linear-gradient(90deg,#F0EDE4 25%,#E4E1D8 50%,#F0EDE4 75%)", backgroundSize: "900px 100%" }}
      />

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-[18px]">
        {/* Category label */}
        <div
          className="h-3 w-24 animate-shimmer rounded-full"
          style={{ background: "linear-gradient(90deg,#F0EDE4 25%,#E4E1D8 50%,#F0EDE4 75%)", backgroundSize: "900px 100%" }}
        />

        {/* Title — 2 lines */}
        <div className="space-y-1.5">
          <div
            className="h-[18px] w-full animate-shimmer rounded"
            style={{ background: "linear-gradient(90deg,#F0EDE4 25%,#E4E1D8 50%,#F0EDE4 75%)", backgroundSize: "900px 100%" }}
          />
          <div
            className="h-[18px] w-3/4 animate-shimmer rounded"
            style={{ background: "linear-gradient(90deg,#F0EDE4 25%,#E4E1D8 50%,#F0EDE4 75%)", backgroundSize: "900px 100%" }}
          />
        </div>

        {/* Excerpt — 2 lines */}
        <div className="space-y-1.5">
          <div
            className="h-3.5 w-full animate-shimmer rounded"
            style={{ background: "linear-gradient(90deg,#F0EDE4 25%,#E4E1D8 50%,#F0EDE4 75%)", backgroundSize: "900px 100%" }}
          />
          <div
            className="h-3.5 w-5/6 animate-shimmer rounded"
            style={{ background: "linear-gradient(90deg,#F0EDE4 25%,#E4E1D8 50%,#F0EDE4 75%)", backgroundSize: "900px 100%" }}
          />
        </div>

        {/* Meta */}
        <div
          className="mt-auto h-3 w-48 animate-shimmer rounded-full"
          style={{ background: "linear-gradient(90deg,#F0EDE4 25%,#E4E1D8 50%,#F0EDE4 75%)", backgroundSize: "900px 100%" }}
        />
      </div>
    </div>
  );
}

/** Grid of 6 skeleton cards used as the category page `loading.tsx` state. */
export function PostGridSkeleton() {
  return (
    <div
      className="grid gap-5"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
    >
      {Array.from({ length: 6 }, (_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default PostCardSkeleton;

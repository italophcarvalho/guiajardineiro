import Image from "next/image";
import { Stars, LeafIcon, formatRating, affiliateLinkRel } from "./_shared";

export interface StickyCTABarProps {
  /** Controls slide-in. Toggle from a scroll listener in the post page. */
  visible: boolean;
  name: string;
  /** Rating 0–5 or pt-BR string. */
  rating: number | string;
  /** Price as a string, e.g. "89". */
  price: string;
  affiliateUrl: string;
  tint?: string;
  imageSrc?: string;
  ctaLabel?: string;
}

/**
 * Mobile-only sticky affiliate bar that slides up from the bottom while the
 * reader scrolls through a post. Hidden on md+ (desktop has the sidebar CTA).
 */
export function StickyCTABar({
  visible,
  name,
  rating,
  price,
  affiliateUrl,
  tint = "#E5E2D9",
  imageSrc,
  ctaLabel = "Ver preço",
}: StickyCTABarProps) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 z-50 flex w-full items-center gap-3 border-t border-border bg-surface px-4 py-3 shadow-card-hover transition-transform duration-300 ease-out md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Thumbnail */}
      <div
        className="relative flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-lg"
        style={{ background: tint }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <LeafIcon className="h-5 w-5 text-green-700 opacity-60" />
        )}
      </div>

      {/* Name + rating */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold leading-tight text-ink">
          {name}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <Stars rating={rating} size="text-[11px]" />
          <span className="text-[11px] font-semibold text-muted">
            {formatRating(rating)} · R$ {price}
          </span>
        </div>
      </div>

      {/* CTA */}
      <a
        href={affiliateUrl}
        target="_blank"
        rel={affiliateLinkRel}
        aria-label={`Ver ${name} na Amazon (link de afiliado)`}
        className="flex-none whitespace-nowrap rounded-[10px] bg-terracotta px-4 py-2.5 font-inter text-sm font-semibold text-surface transition-all duration-200 hover:bg-terracotta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
      >
        {ctaLabel}
      </a>
    </div>
  );
}

export default StickyCTABar;

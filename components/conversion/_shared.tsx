/**
 * Internal helpers shared across the conversion components.
 * Not part of the public barrel — import directly when needed.
 */
import type { SVGProps } from "react";

/* ------------------------------------------------------------------ */
/* Rating + price utils                                                */
/* ------------------------------------------------------------------ */

/** Parse a rating that may be a number (4.8) or pt-BR string ("4,8"). */
export function parseRating(rating: number | string): number {
  if (typeof rating === "number") return rating;
  const n = parseFloat(rating.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/** Format a 0–5 rating as pt-BR, e.g. 4.8 → "4,8". */
export function formatRating(rating: number | string): string {
  return parseRating(rating).toFixed(1).replace(".", ",");
}

/** Format a price (number or numeric string) as "R$ 89". */
export function formatPrice(price: number | string): string {
  const n = typeof price === "number" ? price : parseFloat(price);
  return `R$ ${Number.isFinite(n) ? n : price}`;
}

/* ------------------------------------------------------------------ */
/* Star rating                                                         */
/* ------------------------------------------------------------------ */

export interface StarsProps {
  /** Rating 0–5 (number) or pt-BR string ("4,8"). */
  rating: number | string;
  /** Tailwind text-size class for the stars. Default text-sm. */
  size?: string;
  className?: string;
}

/**
 * Renders 5 unicode stars, filled (amber) up to the rounded rating,
 * the rest empty (border color). Accessible via aria-label.
 */
export function Stars({ rating, size = "text-sm", className = "" }: StarsProps) {
  const value = parseRating(rating);
  const filled = Math.round(value);
  return (
    <span
      role="img"
      aria-label={`Avaliação ${formatRating(value)} de 5`}
      className={`inline-flex leading-none tracking-[1px] ${size} ${className}`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={i < filled ? "text-amber" : "text-border"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

/** Leaf / sprout placeholder icon used in image placeholders. */
export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 20v-8" />
      <path d="M12 12C12 7 8 5 4 5c0 5 4 7 8 7Z" />
      <path d="M12 13c0-4 4-7 8-7 0 4-4 7-8 7Z" />
    </svg>
  );
}

/** Up-right arrow used on outbound affiliate CTAs. */
export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Shared affiliate link props                                         */
/* ------------------------------------------------------------------ */

/** Standard attributes for an outbound affiliate link (FTC/SEO compliant). */
export const affiliateLinkRel = "sponsored noopener noreferrer";

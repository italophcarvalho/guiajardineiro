import Image from "next/image";
import {
  Stars,
  LeafIcon,
  ArrowIcon,
  formatRating,
  formatPrice,
  affiliateLinkRel,
} from "./_shared";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

export interface ProductCardProps {
  name: string;
  brand: string;
  /** Rating 0–5. */
  rating: number;
  /** Number of reviews. */
  reviewCount?: number;
  /** Price as a string, e.g. "89". */
  price: string;
  affiliateUrl: string;
  /** Optional badge, e.g. "Melhor geral". */
  tag?: string;
  /** Hex tint for the image placeholder. */
  tint?: string;
  /** Real product image URL; falls back to a tinted leaf placeholder. */
  imageSrc?: string;
  /** CTA label. Default "Ver na Amazon". */
  ctaLabel?: string;
}

export function ProductCard({
  name,
  brand,
  rating,
  reviewCount,
  price,
  affiliateUrl,
  tag,
  tint,
  imageSrc,
  ctaLabel = "Ver na Amazon",
}: ProductCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      {/* Image / placeholder */}
      <div
        className="relative flex aspect-[4/3] items-center justify-center"
        style={{ background: tint ?? "#E5E2D9" }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            className="object-cover"
          />
        ) : (
          <LeafIcon className="h-9 w-9 text-green-700 opacity-60" />
        )}

        {tag && (
          <span className="absolute right-2 top-2 rounded-pill bg-terracotta px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-surface">
            {tag}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-green-700">
          {brand}
        </div>
        <h3 className="mt-1 font-lora text-[17px] font-semibold leading-tight text-ink">
          {name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <Stars rating={rating} size="text-[13px]" />
          <span className="text-xs font-semibold text-muted">
            {formatRating(rating)}
            {typeof reviewCount === "number" && (
              <> · {reviewCount.toLocaleString("pt-BR")} avaliações</>
            )}
          </span>
        </div>

        <div className="mt-3 text-[13px] text-muted">
          a partir de{" "}
          <strong className="font-lora text-lg font-bold text-green-900">
            {formatPrice(price)}
          </strong>
        </div>

        <a
          href={affiliateUrl}
          target="_blank"
          rel={affiliateLinkRel}
          aria-label={`Ver ${name} na Amazon (link de afiliado)`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[11px] bg-terracotta px-4 py-3 font-inter text-sm font-semibold text-surface transition-all duration-200 hover:bg-terracotta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
        >
          {ctaLabel}
          <ArrowIcon className="h-[15px] w-[15px]" />
        </a>

        <AffiliateDisclosure compact />
      </div>
    </div>
  );
}

export default ProductCard;

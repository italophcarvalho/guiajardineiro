import type { Product } from "@/lib/types";
import {
  Stars,
  LeafIcon,
  ArrowIcon,
  formatRating,
  formatPrice,
  affiliateLinkRel,
} from "./_shared";

export interface BestPickBoxProps {
  product: Product;
  /** Why this is the top pick. */
  reason: string;
  /** Header band label. Default "Melhor Escolha". */
  label?: string;
}

/**
 * "Best Pick" highlight box — a terracotta-bordered card promoting the #1
 * product, with a starred header band, placeholder image and CTA.
 */
export function BestPickBox({
  product,
  reason,
  label = "Melhor Escolha",
}: BestPickBoxProps) {
  const link = product.links?.[0];
  const affiliateUrl = link?.url ?? "#";
  const ctaLabel = link?.label ?? "Ver na Amazon";

  return (
    <div className="overflow-hidden rounded-[16px] border-2 border-terracotta bg-surface">
      {/* Header band */}
      <div className="flex items-center gap-2 bg-terracotta px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-surface">
        <span aria-hidden="true">★</span>
        {label}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-[120px_1fr] sm:items-center">
        <div
          className="flex aspect-square items-center justify-center rounded-[12px]"
          style={{ background: product.tint }}
        >
          <LeafIcon className="h-10 w-10 text-green-700 opacity-60" />
        </div>

        <div>
          {product.tag && (
            <span className="mb-1.5 inline-block rounded-pill bg-green-tint px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700">
              {product.tag}
            </span>
          )}
          <div className="font-lora text-xl font-bold text-green-900">
            {product.name}
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            <Stars rating={product.rating} size="text-[15px]" />
            <span className="text-[13px] font-semibold text-muted">
              {formatRating(product.rating)}
              {typeof product.reviews === "number" && (
                <> · {product.reviews.toLocaleString("pt-BR")} avaliações</>
              )}
            </span>
          </div>

          <p className="mt-2 text-[14.5px] leading-snug text-body-2">{reason}</p>

          <div className="mt-3.5 flex flex-wrap items-center gap-3.5">
            <span className="font-lora text-[22px] font-bold text-green-900">
              {formatPrice(product.price)}
            </span>
            <a
              href={affiliateUrl}
              target="_blank"
              rel={affiliateLinkRel}
              className="inline-flex items-center gap-2 rounded-[11px] bg-terracotta px-5 py-3 font-inter text-sm font-semibold text-surface transition-all duration-200 hover:bg-terracotta-hover"
            >
              {ctaLabel}
              <ArrowIcon className="h-[15px] w-[15px]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestPickBox;

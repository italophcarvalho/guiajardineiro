/**
 * Guia Jardineiro — affiliate link helpers
 *
 * Centralises how outbound affiliate URLs and CTA labels are derived from a
 * product. Products may carry explicit `links` (preferred); otherwise we fall
 * back to a tagged Amazon search so the CTA always points somewhere sensible.
 *
 * The associate tag is read from NEXT_PUBLIC_AMAZON_TAG when available, so it
 * stays configurable per the handoff ("links de afiliado … configuráveis").
 */

import type { Product } from "./types";

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? "guiajardineiro-20";

/** Tagged Amazon search URL for an arbitrary query string. */
export function affiliateSearchUrl(query: string): string {
  return `https://www.amazon.com.br/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
}

/** Outbound affiliate URL for a product (explicit link or tagged search). */
export function affiliateUrlFor(product: Product): string {
  const explicit = product.links?.[0]?.url;
  if (explicit) return explicit;

  return affiliateSearchUrl(`${product.brand} ${product.name}`);
}

/** CTA label for a product (explicit link label or default). */
export function affiliateLabelFor(product: Product): string {
  return product.links?.[0]?.label ?? "Ver na Amazon";
}

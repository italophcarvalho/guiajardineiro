/**
 * Guia Jardineiro — MDX component map
 *
 * Maps the component names authors can use inside `.mdx` article bodies to the
 * real conversion components. Each block-level conversion unit is wrapped in a
 * `not-prose` element so the Tailwind Typography styles applied to the article
 * body don't bleed into the cards/buttons.
 *
 * Authoring API (inside MDX):
 *   <ProductCard id="p1" />
 *   <BestPickBox productId="p1" reason="..." />
 *   <ComparisonTable preset="tesouras" />   (or rows={[...]})
 *   <AlertBox type="dica">...</AlertBox>
 *   <ProsConsBox pros={["..."]} cons={["..."]} />
 *   <NewsletterInline />
 */

import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";

import {
  ProductCard,
  ComparisonTable,
  BestPickBox,
  AlertBox,
  ProsConsBox,
  NewsletterInline,
  type ComparisonRow,
} from "@/components/conversion";
import { parseRating } from "@/components/conversion/_shared";
import { getProductById, tesourasRanking } from "@/lib/mock-data";
import {
  affiliateUrlFor,
  affiliateLabelFor,
  affiliateSearchUrl,
} from "@/lib/affiliate";

/* ------------------------------------------------------------------ */
/* Block wrapper — isolates conversion blocks from prose styles        */
/* ------------------------------------------------------------------ */

function Block({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`not-prose my-7 ${className}`}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* MDX-friendly wrappers (resolve products from data by id)            */
/* ------------------------------------------------------------------ */

function MDXProductCard({
  id,
  ...overrides
}: { id: string } & Partial<ComponentProps<typeof ProductCard>>) {
  const product = getProductById(id);
  if (!product) return null;

  return (
    <Block>
      <ProductCard
        name={product.name}
        brand={product.brand}
        rating={parseRating(product.rating)}
        reviewCount={product.reviews}
        price={String(product.price)}
        affiliateUrl={affiliateUrlFor(product)}
        ctaLabel={affiliateLabelFor(product)}
        tag={product.tag}
        tint={product.tint}
        {...overrides}
      />
    </Block>
  );
}

function MDXBestPickBox({
  productId,
  reason,
  label,
}: {
  productId: string;
  reason: string;
  label?: string;
}) {
  const product = getProductById(productId);
  if (!product) return null;

  // Inject an affiliate link so BestPickBox's CTA resolves.
  const withLink = {
    ...product,
    links: [
      {
        store: "Amazon",
        url: affiliateUrlFor(product),
        label: affiliateLabelFor(product),
        price: product.price,
      },
    ],
  };

  return (
    <Block>
      <BestPickBox product={withLink} reason={reason} label={label} />
    </Block>
  );
}

function MDXComparisonTable({
  preset,
  rows,
  ...rest
}: {
  preset?: "tesouras";
  rows?: ComparisonRow[];
} & Partial<ComponentProps<typeof ComparisonTable>>) {
  let data = rows;

  if (!data && preset === "tesouras") {
    data = tesourasRanking.map((r) => ({
      rank: r.rank,
      name: r.name,
      tag: r.badge,
      rating: parseRating(r.rating),
      highlight: r.bestFor,
      price: r.price,
      affiliateUrl: affiliateSearchUrl(r.name),
    }));
  }

  return (
    <Block>
      <ComparisonTable rows={data ?? []} {...rest} />
    </Block>
  );
}

function MDXAlertBox(props: ComponentProps<typeof AlertBox>) {
  return (
    <div className="not-prose">
      <AlertBox {...props} />
    </div>
  );
}

/**
 * MDX cannot pass array/object expression attributes through next-mdx-remote
 * (they get stripped), so authors provide pros/cons as pipe-separated strings:
 *   <ProsConsBox pros="Corta limpo|Cabo macio" cons="Mola dura" />
 */
function MDXProsConsBox({
  pros = "",
  cons = "",
  prosLabel,
  consLabel,
}: {
  pros?: string;
  cons?: string;
  prosLabel?: string;
  consLabel?: string;
}) {
  const split = (s: string) =>
    s
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

  return (
    <div className="not-prose">
      <ProsConsBox
        pros={split(pros)}
        cons={split(cons)}
        prosLabel={prosLabel}
        consLabel={consLabel}
      />
    </div>
  );
}

function MDXNewsletterInline(props: ComponentProps<typeof NewsletterInline>) {
  return (
    <Block>
      <NewsletterInline {...props} />
    </Block>
  );
}

/* ------------------------------------------------------------------ */
/* Exported map (passed to <MDXRemote components={...} />)             */
/* ------------------------------------------------------------------ */

export const mdxComponents: MDXComponents = {
  ProductCard: MDXProductCard,
  ComparisonTable: MDXComparisonTable,
  BestPickBox: MDXBestPickBox,
  AlertBox: MDXAlertBox,
  ProsConsBox: MDXProsConsBox,
  NewsletterInline: MDXNewsletterInline,
};

export default mdxComponents;

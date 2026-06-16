import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  categories,
  getCategoryBySlug,
  getProductById,
} from "@/lib/mock-data";
import { getPostsByCategory } from "@/lib/posts";
import { affiliateUrlFor, affiliateLabelFor } from "@/lib/affiliate";
import { parseRating } from "@/components/conversion/_shared";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductCard } from "@/components/conversion";
import { CategoryPostGrid } from "@/components/category/CategoryPostGrid";

const SITE_URL = "https://www.guiajardineiro.com.br";

/* ------------------------------------------------------------------ */
/* Static generation                                                   */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export const dynamicParams = false;

/* ------------------------------------------------------------------ */
/* Metadata                                                            */
/* ------------------------------------------------------------------ */

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) return {};

  const url = `${SITE_URL}/categoria/${cat.slug}`;
  return {
    title: `${cat.label} — Guia Jardineiro`,
    description: cat.desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${cat.label} — Guia Jardineiro`,
      description: cat.desc,
      type: "website",
      url,
      siteName: "Guia Jardineiro",
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.label} — Guia Jardineiro`,
      description: cat.desc,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) notFound();

  const catPosts = getPostsByCategory(cat.id);

  // Featured product: first product id found across this category's posts.
  const featuredProductId = catPosts
    .flatMap((p) => p.citedProductIds)
    .find(Boolean);
  const featuredProduct = featuredProductId
    ? getProductById(featuredProductId)
    : undefined;

  return (
    <div>
      {/* ============================================================
          CATEGORY HEADER
          ============================================================ */}
      <header
        className="relative overflow-hidden border-b border-border"
        style={{ background: cat.tint }}
      >
        <div className="mx-auto max-w-container px-6 py-10">
          <Breadcrumb items={[{ label: cat.label }]} />

          <div className="mt-5">
            <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-green-700">
              Categoria
            </span>
            <h1 className="mt-1 font-lora text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-green-900 sm:text-[42px]">
              {cat.label}
            </h1>
            <p className="mt-3 max-w-[52ch] font-inter text-[17px] leading-relaxed text-[#3A5D45]">
              {cat.desc}
            </p>
            <p className="mt-3 text-[13.5px] font-semibold text-green-700">
              {catPosts.length} artigo{catPosts.length !== 1 && "s"}
            </p>
          </div>
        </div>

        {/* Watermark leaf */}
        <div
          className="pointer-events-none absolute right-[-20px] top-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <WatermarkLeaf />
        </div>
      </header>

      {/* ============================================================
          FILTER + POST GRID
          ============================================================ */}
      <div className="mx-auto max-w-container px-6 py-10">
        <CategoryPostGrid posts={catPosts} subtopics={cat.subs} />

        {/* ============================================================
            FEATURED PRODUCT
            ============================================================ */}
        {featuredProduct && (
          <section className="mt-14 border-t border-border pt-10">
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.06em] text-terracotta">
              Mais recomendado em {cat.label}
            </p>
            <div className="max-w-sm">
              <ProductCard
                name={featuredProduct.name}
                brand={featuredProduct.brand}
                rating={parseRating(featuredProduct.rating)}
                reviewCount={featuredProduct.reviews}
                price={String(featuredProduct.price)}
                affiliateUrl={affiliateUrlFor(featuredProduct)}
                ctaLabel={affiliateLabelFor(featuredProduct)}
                tag={featuredProduct.tag}
                tint={featuredProduct.tint}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Watermark SVG                                                       */
/* ------------------------------------------------------------------ */

function WatermarkLeaf() {
  return (
    <svg
      width="260"
      height="260"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1B4332"
      strokeWidth={0.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0.12 }}
    >
      <path d="M12 22v-10" />
      <path d="M12 12C12 6 7 2 1 2c0 7 5 10 11 10Z" />
      <path d="M12 14c0-5 5-9 11-9 0 5-5 9-11 9Z" />
    </svg>
  );
}

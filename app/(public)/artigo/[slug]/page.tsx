import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";

import { getAllPostSlugs, getPostBySlug } from "@/lib/mdx";
import {
  getAuthorById,
  getCategoryById,
  getProductById,
  getPostsByCategory,
} from "@/lib/mock-data";
import { affiliateUrlFor, affiliateLabelFor } from "@/lib/affiliate";
import { parseRating } from "@/components/conversion/_shared";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TableOfContents } from "@/components/layout/TableOfContents";
import { ProductCard, AffiliateDisclosure } from "@/components/conversion";
import { mdxComponents } from "@/components/mdx-components";
import { StickyProductCTA } from "@/components/article/StickyProductCTA";

const SITE_URL = "https://www.guiajardineiro.com.br";

/* ------------------------------------------------------------------ */
/* Static generation                                                   */
/* ------------------------------------------------------------------ */

/** Build a page for every MDX file at build time; 404 anything else. */
export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
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
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const fm = post.frontmatter;
  const url = `${SITE_URL}/artigo/${fm.slug}`;
  const author = getAuthorById(fm.authorId);

  return {
    title: `${fm.title} — Guia Jardineiro`,
    description: fm.metaDesc,
    keywords: fm.tags,
    authors: [
      {
        name: fm.authorName,
        url: author ? `${SITE_URL}/autor/${author.slug}` : undefined,
      },
    ],
    alternates: { canonical: url },
    openGraph: {
      title: fm.title,
      description: fm.metaDesc,
      type: "article",
      url,
      siteName: "Guia Jardineiro",
      locale: "pt_BR",
      publishedTime: fm.publishedAt,
      authors: [fm.authorName],
      tags: fm.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.metaDesc,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const { frontmatter: fm, content, headings } = post;
  const url = `${SITE_URL}/artigo/${fm.slug}`;

  const author = getAuthorById(fm.authorId);
  const category = getCategoryById(fm.categoryId);

  const featured = getProductById(fm.featuredProduct ?? fm.citedProductIds[0] ?? "");
  const citedProducts = fm.citedProductIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const related = getPostsByCategory(fm.categoryId)
    .filter((p) => p.slug !== fm.slug)
    .slice(0, 3);

  /* ---- Structured data (JSON-LD) -------------------------------- */

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.metaDesc,
    datePublished: fm.publishedAt,
    dateModified: fm.publishedAt,
    inLanguage: "pt-BR",
    articleSection: fm.categoryLabel,
    keywords: fm.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Person",
      name: fm.authorName,
      url: author ? `${SITE_URL}/autor/${author.slug}` : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "Guia Jardineiro",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  // ItemList of products — only meaningful for comparative rankings.
  const itemListLd =
    fm.type === "Comparativo" && citedProducts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: fm.title,
          itemListElement: citedProducts.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: p.name,
              brand: { "@type": "Brand", name: p.brand },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: parseRating(p.rating),
                ...(typeof p.reviews === "number"
                  ? { reviewCount: p.reviews }
                  : {}),
                bestRating: 5,
              },
              offers: {
                "@type": "Offer",
                price: p.price,
                priceCurrency: "BRL",
                url: affiliateUrlFor(p),
                availability: "https://schema.org/InStock",
              },
            },
          })),
        }
      : null;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}

      <div className="mx-auto max-w-container px-6 py-8">
        <Breadcrumb
          items={[
            {
              label: fm.categoryLabel,
              href: category ? `/categoria/${category.slug}` : undefined,
            },
            { label: fm.shortTitle ?? fm.title },
          ]}
        />

        <div className="mt-7 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* ====================================================
              MAIN COLUMN
              ==================================================== */}
          <article>
            {/* Eyebrow */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={[
                  "rounded-pill px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.05em]",
                  fm.type === "Comparativo"
                    ? "bg-amber/20 text-amber-text"
                    : "bg-green-tint text-green-700",
                ].join(" ")}
              >
                {fm.type}
              </span>
              {category && (
                <Link
                  href={`/categoria/${category.slug}`}
                  className="text-[12.5px] font-bold uppercase tracking-[0.05em] text-terracotta no-underline hover:underline"
                >
                  {fm.categoryLabel}
                </Link>
              )}
            </div>

            {/* Title */}
            <h1
              className="mt-3 font-lora font-bold leading-[1.1] tracking-[-0.02em] text-green-900"
              style={{ fontSize: "clamp(30px, 4vw, 44px)" }}
            >
              {fm.title}
            </h1>

            {/* Lead */}
            <p className="mt-4 font-inter text-[19px] leading-relaxed text-[#4A5249]">
              {fm.excerpt}
            </p>

            {/* Author block */}
            <div className="mt-6 flex items-center gap-3 border-y border-border py-4">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 font-lora text-lg font-bold text-white">
                {author?.initial ?? fm.authorName.charAt(0)}
              </div>
              <div className="text-[13.5px] text-muted">
                <div>
                  Por{" "}
                  {author ? (
                    <Link
                      href={`/autor/${author.slug}`}
                      className="font-semibold text-green-700 no-underline hover:underline"
                    >
                      {fm.authorName}
                    </Link>
                  ) : (
                    <span className="font-semibold text-green-900">
                      {fm.authorName}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[12.5px] text-muted-2">
                  {fm.date} · {fm.read} de leitura
                </div>
              </div>
            </div>

            {/* Affiliate disclosure (LGPD/FTC) */}
            {citedProducts.length > 0 && <AffiliateDisclosure />}

            {/* Featured image + caption */}
            <figure className="mt-7">
              <div
                className="flex aspect-[16/9] items-center justify-center rounded-card-lg"
                style={{ background: fm.tint }}
              >
                <LeafIcon className="h-14 w-14 text-green-700 opacity-50" />
              </div>
              <figcaption className="mt-2 text-[13px] text-muted-2">
                {fm.categoryLabel} · Foto ilustrativa
              </figcaption>
            </figure>

            {/* MDX body */}
            <div className="prose prose-gj mt-8 max-w-none">
              <MDXRemote
                source={content}
                components={mdxComponents}
                options={{
                  mdxOptions: { rehypePlugins: [rehypeSlug] },
                }}
              />
            </div>

            {/* Produtos citados */}
            {citedProducts.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-1.5 font-lora text-[24px] font-bold text-green-900">
                  Produtos citados neste artigo
                </h2>
                <p className="mb-5 text-[14px] text-muted">
                  Preços e disponibilidade nas lojas parceiras podem variar.
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {citedProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      name={p.name}
                      brand={p.brand}
                      rating={parseRating(p.rating)}
                      reviewCount={p.reviews}
                      price={String(p.price)}
                      affiliateUrl={affiliateUrlFor(p)}
                      ctaLabel={affiliateLabelFor(p)}
                      tag={p.tag}
                      tint={p.tint}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Leia também */}
            {related.length > 0 && (
              <section className="mt-12 border-t border-border pt-8">
                <h2 className="mb-5 font-lora text-[24px] font-bold text-green-900">
                  Leia também
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {related.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/artigo/${rp.slug}`}
                      className="group flex flex-col overflow-hidden rounded-card border border-border bg-surface no-underline transition-all duration-200 hover:-translate-y-[3px] hover:shadow-card-hover"
                    >
                      <div
                        className="flex aspect-[16/10] items-center justify-center"
                        style={{ background: rp.tint }}
                      >
                        <LeafIcon className="h-8 w-8 text-green-700 opacity-50" />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-terracotta">
                          {rp.categoryLabel}
                        </div>
                        <h3 className="mt-1.5 font-lora text-[16px] font-semibold leading-[1.28] text-ink">
                          {rp.title}
                        </h3>
                        <div className="mt-auto pt-3 text-[12px] text-muted-2">
                          {rp.read} de leitura
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* ====================================================
              SIDEBAR
              ==================================================== */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-[120px] lg:self-start">
            {/* TOC */}
            {headings.length > 0 && <TableOfContents headings={headings} />}

            {/* Featured product */}
            {featured && (
              <div>
                <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.06em] text-terracotta">
                  Recomendado neste artigo
                </p>
                <ProductCard
                  name={featured.name}
                  brand={featured.brand}
                  rating={parseRating(featured.rating)}
                  reviewCount={featured.reviews}
                  price={String(featured.price)}
                  affiliateUrl={affiliateUrlFor(featured)}
                  ctaLabel={affiliateLabelFor(featured)}
                  tag={featured.tag}
                  tint={featured.tint}
                />
              </div>
            )}

            {/* Category banner */}
            {category && (
              <Link
                href={`/categoria/${category.slug}`}
                className="block overflow-hidden rounded-card-lg bg-green-900 p-5 no-underline transition-transform duration-200 hover:-translate-y-0.5"
              >
                <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-green-300">
                  Explore a categoria
                </p>
                <div className="mt-1.5 font-lora text-[20px] font-bold text-white">
                  {category.label}
                </div>
                <p className="mt-1.5 text-[13.5px] leading-snug text-green-200">
                  {category.desc}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-green-100">
                  Ver {category.count} artigos
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {featured && (
        <StickyProductCTA
          name={featured.name}
          rating={featured.rating}
          price={String(featured.price)}
          affiliateUrl={affiliateUrlFor(featured)}
          ctaLabel={affiliateLabelFor(featured)}
          tint={featured.tint}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Local icons                                                         */
/* ------------------------------------------------------------------ */

function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 20v-8" />
      <path d="M12 12C12 7 8 5 4 5c0 5 4 7 8 7Z" />
      <path d="M12 13c0-4 4-7 8-7 0 4-4 7-8 7Z" />
    </svg>
  );
}



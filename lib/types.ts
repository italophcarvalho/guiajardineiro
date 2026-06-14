/**
 * Guia Jardineiro — domain types
 *
 * These model the public content site + the admin CMS. They start as the shape
 * of the mock data and are intended to map cleanly onto a headless CMS later.
 */

/* ------------------------------------------------------------------ */
/* Enums / unions                                                      */
/* ------------------------------------------------------------------ */

/** Editorial format of a post. */
export type PostType = "Guia" | "Comparativo";

/** Publication lifecycle status (drives the CMS status badges). */
export type PostStatus = "publicado" | "rascunho" | "agendado";

/** Editorial callout variants used inside article bodies. */
export type CalloutType = "info" | "tip" | "warning" | "product";

/** Conversion blocks an editor can insert into a post body. */
export type ConversionBlockType =
  | "affiliate-product"
  | "comparison-table"
  | "highlight-box";

/* ------------------------------------------------------------------ */
/* Category                                                            */
/* ------------------------------------------------------------------ */

/** A subtopic used to filter posts within a category. */
export interface Subtopic {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  /** Display name, e.g. "Plantas de Interior". */
  label: string;
  /** URL slug. */
  slug: string;
  /** Tint color (hex) used for image placeholders / category header. */
  tint: string;
  /** Number of published articles (for the category cards). */
  count: number;
  /** Short description shown in the category header. */
  desc: string;
  /** Optional subtopic filters. */
  subs: Subtopic[];
}

/* ------------------------------------------------------------------ */
/* Author                                                              */
/* ------------------------------------------------------------------ */

export interface Author {
  id: string;
  slug: string;
  name: string;
  firstName: string;
  /** Single-letter avatar initial. */
  initial: string;
  /** Editorial role, e.g. "Engenheiro Agrônomo". */
  role: string;
  bio: string;
  /** Specialty chips shown on the author profile. */
  specialties: string[];
  /** Optional social links keyed by network. */
  social?: Partial<Record<"instagram" | "twitter" | "linkedin" | "youtube", string>>;
}

/* ------------------------------------------------------------------ */
/* Products & affiliate links                                          */
/* ------------------------------------------------------------------ */

export interface AffiliateLink {
  /** Partner store, e.g. "Amazon". */
  store: string;
  /** Outbound affiliate URL. */
  url: string;
  /** CTA label, e.g. "Ver na Amazon". */
  label: string;
  /** Commission rate (0–1), used internally / in analytics. */
  commission?: number;
  /** Snapshot price shown on the CTA, in BRL. */
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  /** Rating as displayed (pt-BR comma decimal), e.g. "4,8". */
  rating: string;
  /** "A partir de" price in BRL (integer reais). */
  price: number;
  /** Number of reviews, if known. */
  reviews?: number;
  /** Tint color (hex) for the image placeholder. */
  tint: string;
  /** Optional badge, e.g. "Melhor geral", "Custo-benefício". */
  tag?: string;
  /** Affiliate links (one or more stores). */
  links?: AffiliateLink[];
}

/* ------------------------------------------------------------------ */
/* Post                                                                */
/* ------------------------------------------------------------------ */

/** A conversion block placed in the post body (editor + render). */
export interface ConversionBlock {
  id: string;
  type: ConversionBlockType;
  label: string;
  /** Referenced product ids (for affiliate / comparison blocks). */
  productIds?: string[];
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  /** Compact title for breadcrumbs / cards. */
  shortTitle: string;
  excerpt: string;
  type: PostType;

  /** Category id + denormalized label for convenience. */
  categoryId: string;
  categoryLabel: string;
  /** Subtopic id within the category (optional). */
  subtopicId?: string;

  /** Author id + denormalized name. */
  authorId: string;
  authorName: string;

  /** Display date (pt-BR), e.g. "8 jun 2026". */
  date: string;
  /** ISO date for sorting / structured data. */
  publishedAt?: string;
  /** Reading time label, e.g. "12 min". */
  read: string;

  status: PostStatus;
  /** Tint color (hex) for the hero/thumbnail placeholder. */
  tint: string;

  /** SEO meta description (≤160 chars). */
  metaDesc: string;
  tags: string[];

  /** Products referenced/cited in the article. */
  citedProductIds: string[];
  /** Conversion blocks placed in the body. */
  blocks?: ConversionBlock[];

  /** MDX body (when sourced from /content/posts). */
  body?: string;

  /* Analytics fields (admin reporting) */
  views?: number;
  /** Affiliate click-through rate, e.g. "3,2%". */
  affiliateCtr?: string;
}

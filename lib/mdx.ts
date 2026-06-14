/**
 * Guia Jardineiro — MDX content layer
 *
 * Reads article source from `content/posts/*.mdx`, parses frontmatter with
 * gray-matter and exposes build-time helpers for the App Router:
 *   - getAllPostSlugs()  → generateStaticParams
 *   - getPostBySlug()    → frontmatter + raw MDX body + extracted headings
 *
 * The MDX body itself is compiled in the page via <MDXRemote> (RSC). Headings
 * are extracted here so the sidebar Table of Contents can be rendered without
 * re-parsing the compiled output. Heading ids are generated with the same
 * slugger (github-slugger) that `rehype-slug` uses, so the anchors match.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { PostStatus, PostType } from "./types";
import type { Heading } from "@/components/layout/TableOfContents";

/** Absolute path to the MDX content directory. */
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/* ------------------------------------------------------------------ */
/* Frontmatter                                                         */
/* ------------------------------------------------------------------ */

/**
 * Frontmatter shape for a post MDX file. Mirrors the `Post` domain type so
 * file-sourced content maps cleanly onto the same UI as the mock data.
 */
export interface PostFrontmatter {
  slug: string;
  title: string;
  shortTitle?: string;
  excerpt: string;
  type: PostType;

  categoryId: string;
  categoryLabel: string;
  subtopicId?: string;

  authorId: string;
  authorName: string;

  date: string;
  publishedAt?: string;
  read: string;

  status: PostStatus;
  tint: string;

  metaDesc: string;
  tags: string[];

  /** Products cited in the body (affiliate cards / comparison). */
  citedProductIds: string[];
  /** The single hero/featured product (sidebar CTA + sticky bar). */
  featuredProduct?: string;
}

export interface LoadedPost {
  frontmatter: PostFrontmatter;
  /** Raw MDX body (frontmatter stripped) — compiled by the page. */
  content: string;
  /** H2/H3 headings for the Table of Contents. */
  headings: Heading[];
}

/* ------------------------------------------------------------------ */
/* Slug discovery                                                      */
/* ------------------------------------------------------------------ */

/** All post slugs (filenames without extension) for generateStaticParams. */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/* ------------------------------------------------------------------ */
/* Heading extraction (Table of Contents)                             */
/* ------------------------------------------------------------------ */

/** Strip inline markdown so the TOC label + slug match the rendered text. */
function cleanHeadingText(raw: string): string {
  return raw
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → text
    .trim();
}

/**
 * Extract H2/H3 headings from a raw MDX body, ignoring fenced code blocks.
 * Ids are produced with github-slugger to match `rehype-slug`.
 */
export function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of content.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = cleanHeadingText(match[2]);
    if (!text) continue;

    headings.push({ id: slugger.slug(text), text, level });
  }

  return headings;
}

/* ------------------------------------------------------------------ */
/* Post loading                                                        */
/* ------------------------------------------------------------------ */

/**
 * Load a single post by slug. Returns `null` when the file doesn't exist so
 * the page can call `notFound()`.
 */
export function getPostBySlug(slug: string): LoadedPost | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const frontmatter = { slug, ...data } as PostFrontmatter;
  // Normalise optional arrays so consumers don't have to guard.
  frontmatter.tags ??= [];
  frontmatter.citedProductIds ??= [];

  return {
    frontmatter,
    content,
    headings: extractHeadings(content),
  };
}

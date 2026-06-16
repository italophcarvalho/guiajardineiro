/**
 * Guia Jardineiro — post index (single source of truth)
 *
 * Reads every `content/posts/*.mdx`, parses the frontmatter and maps it to the
 * `Post` listing shape used across the site (home, category, author, search and
 * the admin dashboard). This replaces the old hand-written `posts` array in
 * `lib/mock-data.ts`, so anything created by the editor shows up everywhere
 * automatically.
 *
 * SERVER ONLY: uses `fs`. Client components must receive the result as props.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Post, PostStatus, PostType } from "./types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/**
 * YAML parses unquoted dates (e.g. `publishedAt: 2026-06-08`) as Date objects.
 * Normalise to an ISO `YYYY-MM-DD` string so sorting/serialisation are safe.
 */
function asDateString(v: unknown): string | undefined {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string") return v;
  return undefined;
}

/** Parse one MDX file into a `Post`. Returns null if the file is missing. */
function readPost(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const { data } = matter(fs.readFileSync(filePath, "utf8"));

  return {
    id: (data.id as string) ?? slug,
    slug,
    title: data.title ?? "",
    shortTitle: data.shortTitle ?? data.title ?? "",
    excerpt: data.excerpt ?? "",
    type: (data.type as PostType) ?? "Guia",
    categoryId: data.categoryId ?? "",
    categoryLabel: data.categoryLabel ?? "",
    subtopicId: data.subtopicId,
    authorId: data.authorId ?? "",
    authorName: data.authorName ?? "",
    date: data.date ?? "",
    publishedAt: asDateString(data.publishedAt),
    read: data.read ?? "",
    status: (data.status as PostStatus) ?? "rascunho",
    tint: data.tint ?? "#DCE8DD",
    metaDesc: data.metaDesc ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    citedProductIds: Array.isArray(data.citedProductIds)
      ? data.citedProductIds
      : [],
    views: typeof data.views === "number" ? data.views : undefined,
    affiliateCtr:
      typeof data.affiliateCtr === "string" ? data.affiliateCtr : undefined,
  };
}

/** Sort newest first by ISO `publishedAt` (falling back to display `date`). */
function byNewest(a: Post, b: Post): number {
  return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
}

/**
 * Every post on disk, regardless of status, newest first.
 * Use this for the admin dashboard (drafts/scheduled included).
 */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => readPost(f.replace(/\.mdx$/, "")))
    .filter((p): p is Post => p !== null)
    .sort(byNewest);
}

/** Only published posts — what the public site should ever list. */
export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((p) => p.status === "publicado");
}

/** Published posts in a given category. */
export function getPostsByCategory(categoryId: string): Post[] {
  return getPublishedPosts().filter((p) => p.categoryId === categoryId);
}

/** Published posts by a given author. */
export function getPostsByAuthor(authorId: string): Post[] {
  return getPublishedPosts().filter((p) => p.authorId === authorId);
}

/** Count of published posts per categoryId (for category cards/headers). */
export function getPublishedCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of getPublishedPosts()) {
    counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
  }
  return counts;
}

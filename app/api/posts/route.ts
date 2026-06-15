import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { blocksToMdx, type EditorBlock, type Frontmatter } from "@/lib/mdx-serializer";
import { slugify } from "@/lib/slug";
import { categories, authors } from "@/lib/mock-data";
import {
  getGitHubConfig,
  isGitHubMode,
  commitFile,
  fileExists,
} from "@/lib/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

type SaveStatus = "draft" | "scheduled" | "published";

interface SavePayload {
  frontmatter: Frontmatter;
  blocks: EditorBlock[];
  status: SaveStatus;
  scheduledDate?: string;
  /** When true, allow overwriting an existing file (editing an existing post). */
  overwrite?: boolean;
}

const STATUS_MAP: Record<SaveStatus, string> = {
  draft: "rascunho",
  scheduled: "agendado",
  published: "publicado",
};

/** Estimate reading time from the body text blocks (~200 wpm, pt-BR). */
function estimateReadTime(blocks: EditorBlock[]): string {
  const words = blocks
    .map((b) => ("content" in b ? b.content : ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

/** Format a date as the pt-BR display string used across the site, e.g. "8 jun 2026". */
const PT_MONTHS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];
function formatDisplayDate(d: Date): string {
  return `${d.getDate()} ${PT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Fill in everything the public site needs that the editor may not send:
 * ids derived from labels, dates, reading time, cited products, status.
 */
function normalizeFrontmatter(
  fm: Frontmatter,
  blocks: EditorBlock[],
  status: SaveStatus,
  slug: string,
  scheduledDate?: string
): Frontmatter {
  const categoryLabel = String(fm.categoryLabel ?? "");
  const authorName = String(fm.authorName ?? "");
  const category = categories.find((c) => c.label === categoryLabel);
  const author = authors.find((a) => a.name === authorName);

  // citedProductIds come from the product blocks in the body.
  const cited = blocks
    .filter((b): b is Extract<EditorBlock, { type: "product" }> => b.type === "product")
    .map((b) => b.data.productId)
    .filter(Boolean);

  const when =
    status === "scheduled" && scheduledDate ? new Date(scheduledDate) : new Date();

  return {
    ...fm,
    slug,
    type: fm.type ?? "Guia",
    categoryId: fm.categoryId ?? category?.id ?? "",
    categoryLabel,
    authorId: fm.authorId ?? author?.id ?? "",
    authorName,
    status: STATUS_MAP[status],
    date: fm.date ?? formatDisplayDate(when),
    publishedAt: fm.publishedAt ?? when.toISOString().slice(0, 10),
    read: fm.read ?? estimateReadTime(blocks),
    tint: fm.tint ?? category?.tint ?? "#DCE8DD",
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    citedProductIds: cited,
    metaDesc: fm.metaDesc ?? "",
    excerpt: fm.excerpt ?? "",
  };
}

/**
 * POST /api/posts
 * Body: { frontmatter, blocks, status, scheduledDate?, overwrite? }
 * Serializes to MDX and writes to content/posts/{slug}.mdx
 * (filesystem in dev, GitHub Contents API in production).
 */
export async function POST(request: Request) {
  let payload: SavePayload;
  try {
    payload = (await request.json()) as SavePayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { frontmatter, blocks, status, scheduledDate, overwrite } = payload;

  if (!frontmatter || !Array.isArray(blocks)) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes: frontmatter, blocks." },
      { status: 400 }
    );
  }

  const title = String(frontmatter.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "O título é obrigatório." }, { status: 400 });
  }

  const slug = String(frontmatter.slug || "").trim() || slugify(title);
  if (!slug) {
    return NextResponse.json(
      { error: "Não foi possível gerar um slug a partir do título." },
      { status: 400 }
    );
  }

  const fm = normalizeFrontmatter(frontmatter, blocks, status, slug, scheduledDate);
  const mdx = blocksToMdx(fm, blocks);
  const relPath = `content/posts/${slug}.mdx`;

  try {
    if (isGitHubMode()) {
      /* ---- Production: commit to GitHub (triggers Vercel redeploy) ---- */
      const config = getGitHubConfig()!;
      if (!overwrite && (await fileExists(config, relPath))) {
        return NextResponse.json(
          { error: `Já existe um post com o slug "${slug}".` },
          { status: 409 }
        );
      }
      const { commitUrl } = await commitFile(
        config,
        relPath,
        mdx,
        `${overwrite ? "Atualiza" : "Cria"} post: ${title}`
      );
      return NextResponse.json({ slug, status: fm.status, commitUrl });
    }

    /* ---- Development: write to the local filesystem ---- */
    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
    if (!overwrite && fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `Já existe um post com o slug "${slug}".` },
        { status: 409 }
      );
    }
    fs.writeFileSync(filePath, mdx, "utf8");
    return NextResponse.json({ slug, status: fm.status, path: relPath });
  } catch (err) {
    console.error("[/api/posts] save failed:", err);
    return NextResponse.json(
      { error: "Falha ao salvar o post." },
      { status: 500 }
    );
  }
}

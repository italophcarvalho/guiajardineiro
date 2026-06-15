import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { mdxToBlocks } from "@/lib/mdx-serializer";
import { getGitHubConfig, isGitHubMode, readFile } from "@/lib/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/**
 * GET /api/posts/[slug]
 * Reads content/posts/{slug}.mdx and returns { frontmatter, blocks } for the
 * editor to repopulate. Reads from the filesystem in dev, GitHub in production.
 */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const relPath = `content/posts/${slug}.mdx`;

  try {
    let raw: string | null = null;

    if (isGitHubMode()) {
      raw = await readFile(getGitHubConfig()!, relPath);
    } else {
      const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
      if (fs.existsSync(filePath)) raw = fs.readFileSync(filePath, "utf8");
    }

    if (raw == null) {
      return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
    }

    const { frontmatter, blocks } = mdxToBlocks(raw);
    return NextResponse.json({ slug, frontmatter, blocks });
  } catch (err) {
    console.error(`[/api/posts/${slug}] read failed:`, err);
    return NextResponse.json({ error: "Falha ao ler o post." }, { status: 500 });
  }
}

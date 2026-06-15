/**
 * Guia Jardineiro — MDX serializer
 *
 * Bridges the admin editor's block model and the on-disk `.mdx` format.
 *
 *   blocksToMdx(frontmatter, blocks) → full MDX file string (frontmatter + body)
 *   mdxToBlocks(mdxContent)          → { frontmatter, blocks }  (reverse parse)
 *
 * The body of a post is modelled as an ordered array of blocks:
 *
 *   Text blocks        { type: 'paragraph'|'h2'|'h3'|'quote'|'list', content }
 *   Conversion blocks  { type: 'product'|'comparison-table'|'alert-box', data }
 *   Raw passthrough    { type: 'mdx', content }   (any JSX we don't model yet,
 *                                                   e.g. <ProsConsBox>, kept verbatim)
 *
 * The round-trip is lossless for everything the editor can produce, and
 * non-destructive (via the `mdx` passthrough block) for hand-authored MDX that
 * uses components outside the editor's palette.
 */

import matter from "gray-matter";

/* ------------------------------------------------------------------ */
/* Block model                                                         */
/* ------------------------------------------------------------------ */

export type TextBlockType = "paragraph" | "h2" | "h3" | "quote" | "list";

export interface TextBlock {
  type: TextBlockType;
  /** Inline markdown. For `list`, one item per line. */
  content: string;
}

export type ProductRole = "essencial" | "complementar";

export interface ProductBlock {
  type: "product";
  data: { productId: string; role: ProductRole };
}

export interface ComparisonTableBlock {
  type: "comparison-table";
  data: { preset?: string };
}

export interface AlertBoxBlock {
  type: "alert-box";
  data: { variant: string; title?: string; content: string };
}

/** Verbatim MDX/JSX we don't model — preserved on round-trip. */
export interface RawMdxBlock {
  type: "mdx";
  content: string;
}

export type EditorBlock =
  | TextBlock
  | ProductBlock
  | ComparisonTableBlock
  | AlertBoxBlock
  | RawMdxBlock;

export type Frontmatter = Record<string, unknown>;

export interface ParsedPost {
  frontmatter: Frontmatter;
  blocks: EditorBlock[];
}

const TEXT_TYPES: TextBlockType[] = ["paragraph", "h2", "h3", "quote", "list"];

function isTextBlock(b: EditorBlock): b is TextBlock {
  return (TEXT_TYPES as string[]).includes(b.type);
}

/* ================================================================== */
/* blocksToMdx                                                         */
/* ================================================================== */

/** Escape a double-quoted JSX attribute value. */
function attr(value: string): string {
  return value.replace(/"/g, "&quot;");
}

function blockToMdx(block: EditorBlock): string {
  switch (block.type) {
    case "paragraph":
      return block.content.trim();
    case "h2":
      return `## ${block.content.trim()}`;
    case "h3":
      return `### ${block.content.trim()}`;
    case "quote":
      return block.content
        .split("\n")
        .map((line) => `> ${line}`.trimEnd())
        .join("\n");
    case "list":
      return block.content
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => `- ${item}`)
        .join("\n");
    case "product": {
      const { productId, role } = block.data;
      const roleAttr = role ? ` role="${attr(role)}"` : "";
      return `<ProductCard id="${attr(productId)}"${roleAttr} />`;
    }
    case "comparison-table": {
      const { preset } = block.data;
      const presetAttr = preset ? ` preset="${attr(preset)}"` : "";
      return `<ComparisonTable${presetAttr} />`;
    }
    case "alert-box": {
      const { variant, title, content } = block.data;
      const titleAttr = title ? ` title="${attr(title)}"` : "";
      return [
        `<AlertBox type="${attr(variant)}"${titleAttr}>`,
        `  ${content.trim()}`,
        `</AlertBox>`,
      ].join("\n");
    }
    case "mdx":
      return block.content.trim();
    default:
      return "";
  }
}

/**
 * Serialize frontmatter + body blocks into a complete MDX file string.
 * Frontmatter is emitted as YAML via gray-matter.
 */
export function blocksToMdx(
  frontmatter: Frontmatter,
  blocks: EditorBlock[]
): string {
  const body = blocks
    .map(blockToMdx)
    .filter((chunk) => chunk.length > 0)
    .join("\n\n");

  // gray-matter prepends the `---` YAML block; ensure body has a trailing newline.
  return matter.stringify(`\n${body}\n`, frontmatter);
}

/* ================================================================== */
/* mdxToBlocks                                                         */
/* ================================================================== */

const RE_H2 = /^##\s+(.*)$/;
const RE_H3 = /^###\s+(.*)$/;
const RE_QUOTE = /^>\s?(.*)$/;
const RE_LIST = /^[-*]\s+(.*)$/;
const RE_JSX_OPEN = /^<([A-Z][A-Za-z0-9]*)/;
const RE_FENCE = /^\s*(```|~~~)/;

/** Pull a string attribute out of a JSX opening tag. */
function readAttr(tag: string, name: string): string | undefined {
  const m = new RegExp(`${name}="([^"]*)"`).exec(tag);
  return m ? m[1].replace(/&quot;/g, '"') : undefined;
}

/** Classify a fully-collected JSX element string into a block. */
function classifyJsx(raw: string): EditorBlock {
  const tagName = RE_JSX_OPEN.exec(raw.trimStart())?.[1] ?? "";

  if (tagName === "ProductCard") {
    return {
      type: "product",
      data: {
        productId: readAttr(raw, "id") ?? "",
        role: (readAttr(raw, "role") as ProductRole) ?? "essencial",
      },
    };
  }

  if (tagName === "ComparisonTable") {
    return { type: "comparison-table", data: { preset: readAttr(raw, "preset") } };
  }

  if (tagName === "AlertBox") {
    const inner = /<AlertBox[^>]*>([\s\S]*?)<\/AlertBox>/.exec(raw)?.[1] ?? "";
    return {
      type: "alert-box",
      data: {
        variant: readAttr(raw, "type") ?? "dica",
        title: readAttr(raw, "title"),
        content: inner.trim(),
      },
    };
  }

  // Anything else (ProsConsBox, NewsletterInline, custom JSX) is preserved.
  return { type: "mdx", content: raw.trim() };
}

/**
 * Parse an MDX file string into frontmatter + an ordered block array.
 */
export function mdxToBlocks(mdxContent: string): ParsedPost {
  const { data, content } = matter(mdxContent);
  const lines = content.split("\n");
  const blocks: EditorBlock[] = [];

  let i = 0;
  let inFence = false;
  let fenceBuffer: string[] = [];

  while (i < lines.length) {
    const line = lines[i];

    /* ---- fenced code: keep verbatim as an mdx block ---- */
    if (RE_FENCE.test(line)) {
      if (!inFence) {
        inFence = true;
        fenceBuffer = [line];
      } else {
        fenceBuffer.push(line);
        blocks.push({ type: "mdx", content: fenceBuffer.join("\n") });
        inFence = false;
        fenceBuffer = [];
      }
      i++;
      continue;
    }
    if (inFence) {
      fenceBuffer.push(line);
      i++;
      continue;
    }

    const trimmed = line.trim();

    /* ---- blank line: block separator ---- */
    if (trimmed === "") {
      i++;
      continue;
    }

    /* ---- headings ---- */
    let m = RE_H2.exec(trimmed);
    if (m) {
      blocks.push({ type: "h2", content: m[1].trim() });
      i++;
      continue;
    }
    m = RE_H3.exec(trimmed);
    if (m) {
      blocks.push({ type: "h3", content: m[1].trim() });
      i++;
      continue;
    }

    /* ---- JSX element (single- or multi-line) ---- */
    if (RE_JSX_OPEN.test(trimmed)) {
      const tagName = RE_JSX_OPEN.exec(trimmed)![1];
      const collected: string[] = [];
      // Collect until the element closes: `/>` (self-closing) or `</Tag>` (paired).
      while (i < lines.length) {
        collected.push(lines[i]);
        const joined = collected.join("\n");
        const selfClosed = /\/>\s*$/.test(lines[i]);
        const paired = new RegExp(`</${tagName}>\\s*$`).test(lines[i]);
        if (selfClosed || paired) {
          i++;
          break;
        }
        i++;
      }
      blocks.push(classifyJsx(collected.join("\n")));
      continue;
    }

    /* ---- blockquote (consume consecutive `>` lines) ---- */
    if (RE_QUOTE.test(trimmed)) {
      const quoteLines: string[] = [];
      while (i < lines.length && RE_QUOTE.test(lines[i].trim())) {
        quoteLines.push(RE_QUOTE.exec(lines[i].trim())![1]);
        i++;
      }
      blocks.push({ type: "quote", content: quoteLines.join("\n").trim() });
      continue;
    }

    /* ---- list (consume consecutive `-`/`*` lines) ---- */
    if (RE_LIST.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && RE_LIST.test(lines[i].trim())) {
        items.push(RE_LIST.exec(lines[i].trim())![1].trim());
        i++;
      }
      blocks.push({ type: "list", content: items.join("\n") });
      continue;
    }

    /* ---- paragraph (consume consecutive plain lines, collapse wraps) ---- */
    const paraLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      const t = l.trim();
      if (
        t === "" ||
        RE_H2.test(t) ||
        RE_H3.test(t) ||
        RE_QUOTE.test(t) ||
        RE_LIST.test(t) ||
        RE_JSX_OPEN.test(t) ||
        RE_FENCE.test(l)
      ) {
        break;
      }
      paraLines.push(t);
      i++;
    }
    if (paraLines.length) {
      blocks.push({ type: "paragraph", content: paraLines.join(" ") });
    }
  }

  return { frontmatter: data, blocks };
}

/* ------------------------------------------------------------------ */
/* Convenience splitters for the editor UI                             */
/* ------------------------------------------------------------------ */

/** Body blocks that belong in the prose editor (text + raw passthrough). */
export function proseBlocks(blocks: EditorBlock[]): (TextBlock | RawMdxBlock)[] {
  return blocks.filter(
    (b): b is TextBlock | RawMdxBlock => isTextBlock(b) || b.type === "mdx"
  );
}

/** Body blocks that belong in the conversion-block list. */
export function conversionBlocks(
  blocks: EditorBlock[]
): (ProductBlock | ComparisonTableBlock | AlertBoxBlock)[] {
  return blocks.filter(
    (b): b is ProductBlock | ComparisonTableBlock | AlertBoxBlock =>
      b.type === "product" ||
      b.type === "comparison-table" ||
      b.type === "alert-box"
  );
}

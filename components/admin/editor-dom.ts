/**
 * Guia Jardineiro — contenteditable ⇄ block bridge (client only)
 *
 * The post body is edited in a contenteditable div (rich text via execCommand)
 * but persisted as markdown blocks. These helpers convert between the two:
 *
 *   domToBlocks(root)        → (TextBlock | RawMdxBlock)[]   (on save)
 *   proseBlocksToHtml(blocks) → HTML string                  (on load)
 *
 * Inline formatting (bold/italic/links) round-trips through markdown.
 */

import type { TextBlock, RawMdxBlock } from "@/lib/mdx-serializer";

/* ------------------------------------------------------------------ */
/* Inline: DOM → markdown                                              */
/* ------------------------------------------------------------------ */

function inlineToMarkdown(node: Node): string {
  let out = "";
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      out += child.nodeValue ?? "";
      return;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return;

    const el = child as HTMLElement;
    const tag = el.tagName;
    const inner = inlineToMarkdown(el);

    if (tag === "STRONG" || tag === "B") out += `**${inner}**`;
    else if (tag === "EM" || tag === "I") out += `*${inner}*`;
    else if (tag === "A") {
      const href = el.getAttribute("href") ?? "";
      out += `[${inner}](${href})`;
    } else if (tag === "BR") out += "\n";
    else out += inner;
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Block: DOM → blocks                                                 */
/* ------------------------------------------------------------------ */

/**
 * Walk the contenteditable root and produce an ordered list of text blocks.
 * Inline/text nodes between block elements are gathered into paragraphs.
 */
export function domToBlocks(root: HTMLElement): (TextBlock | RawMdxBlock)[] {
  const blocks: (TextBlock | RawMdxBlock)[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    const text = paragraph.join("").trim();
    if (text) blocks.push({ type: "paragraph", content: text });
    paragraph = [];
  };

  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      paragraph.push(node.nodeValue ?? "");
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const tag = el.tagName;

    switch (tag) {
      case "H2":
        flush();
        blocks.push({ type: "h2", content: inlineToMarkdown(el).trim() });
        break;
      case "H3":
        flush();
        blocks.push({ type: "h3", content: inlineToMarkdown(el).trim() });
        break;
      case "BLOCKQUOTE":
        flush();
        blocks.push({ type: "quote", content: inlineToMarkdown(el).trim() });
        break;
      case "UL":
      case "OL": {
        flush();
        const items = Array.from(el.querySelectorAll(":scope > li"))
          .map((li) => inlineToMarkdown(li).trim())
          .filter(Boolean);
        if (items.length) blocks.push({ type: "list", content: items.join("\n") });
        break;
      }
      case "P":
      case "DIV": {
        // execCommand wraps each line in a <div>; treat as its own paragraph.
        flush();
        const content = inlineToMarkdown(el).trim();
        if (content) blocks.push({ type: "paragraph", content });
        break;
      }
      case "BR":
        break;
      default:
        // Inline element (STRONG, EM, A, SPAN, …) at the top level.
        paragraph.push(inlineToMarkdown(el));
    }
  });

  flush();
  return blocks;
}

/* ------------------------------------------------------------------ */
/* Inline: markdown → HTML                                             */
/* ------------------------------------------------------------------ */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineToHtml(md: string): string {
  return escapeHtml(md)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

/* ------------------------------------------------------------------ */
/* Block: blocks → HTML                                                */
/* ------------------------------------------------------------------ */

/** Rebuild contenteditable HTML from prose blocks (for loading a post). */
export function proseBlocksToHtml(blocks: (TextBlock | RawMdxBlock)[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h2":
          return `<h2>${inlineToHtml(b.content)}</h2>`;
        case "h3":
          return `<h3>${inlineToHtml(b.content)}</h3>`;
        case "quote":
          return `<blockquote>${b.content
            .split("\n")
            .map(inlineToHtml)
            .join("<br>")}</blockquote>`;
        case "list":
          return `<ul>${b.content
            .split("\n")
            .filter(Boolean)
            .map((item) => `<li>${inlineToHtml(item)}</li>`)
            .join("")}</ul>`;
        case "paragraph":
          return `<p>${inlineToHtml(b.content)}</p>`;
        case "mdx":
          // Raw JSX we can't edit inline — show as escaped text so it isn't lost.
          return `<p>${escapeHtml(b.content)}</p>`;
        default:
          return "";
      }
    })
    .join("");
}

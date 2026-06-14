#!/usr/bin/env ts-node
/**
 * Gerador de posts MDX para o Guia Jardineiro.
 *
 * Uso:
 *   npx ts-node scripts/new-post.ts "Título do Post" categoria
 *
 * Exemplo:
 *   npx ts-node scripts/new-post.ts "Como cuidar de orquídeas" "Plantas de Interior"
 */

import fs from "fs";
import path from "path";

/* ------------------------------------------------------------------ */
/* Slugify — mirrors lib/slug.ts (duplicado para evitar módulos TS)   */
/* ------------------------------------------------------------------ */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* ------------------------------------------------------------------ */
/* Args                                                                */
/* ------------------------------------------------------------------ */

const [, , title, category] = process.argv;

if (!title || !category) {
  console.error(
    "❌  Uso: npx ts-node scripts/new-post.ts \"Título do Post\" \"Nome da Categoria\""
  );
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* Derivar slug, datas e ano                                           */
/* ------------------------------------------------------------------ */

const slug = slugify(title);
const now = new Date();
const publishedAt = now.toISOString().split("T")[0]; // "2026-06-13"
const year = now.getFullYear();

const dateLabel = now.toLocaleDateString("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
}); // "13 jun. 2026"

const categorySlug = slugify(category);

/* ------------------------------------------------------------------ */
/* Template MDX                                                        */
/* ------------------------------------------------------------------ */

const template = `---
title: "${title}"
slug: "${slug}"
shortTitle: "${title}"
type: "Guia"
categoryId: "${categorySlug}"
categoryLabel: "${category}"
authorId: "marina"
authorName: "Marina Couto"
date: "${dateLabel}"
publishedAt: "${publishedAt}"
read: "8 min"
status: "rascunho"
tint: "#DCE8DD"
metaDesc: ""
tags: []
citedProductIds: []
featuredProduct: ""
excerpt: ""
---

## Introdução

Escreva aqui a introdução do artigo. Explique por que o leitor deveria continuar lendo e o que vai aprender.

<AlertBox type="dica">
  Dica rápida para destacar no início do artigo.
</AlertBox>

## O que você vai encontrar neste guia

- Ponto principal 1
- Ponto principal 2
- Ponto principal 3

## Seção 1

Conteúdo da primeira seção.

### Subseção 1.1

Detalhes e exemplos práticos.

## Seção 2

Conteúdo da segunda seção.

## Conclusão

Resumo dos principais pontos e próximos passos para o leitor.
`;

/* ------------------------------------------------------------------ */
/* Escrever arquivo                                                    */
/* ------------------------------------------------------------------ */

const postsDir = path.join(process.cwd(), "content", "posts");
const filePath = path.join(postsDir, `${slug}.mdx`);

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

if (fs.existsSync(filePath)) {
  console.error(`❌  Arquivo já existe: content/posts/${slug}.mdx`);
  process.exit(1);
}

fs.writeFileSync(filePath, template, "utf-8");

console.log(`✅  Post criado: content/posts/${slug}.mdx`);
console.log(`    Título:    ${title}`);
console.log(`    Categoria: ${category}`);
console.log(`    Slug:      ${slug}`);
console.log(`    Data:      ${publishedAt}`);
console.log();
console.log(`    Próximos passos:`);
console.log(`    1. Preencha metaDesc, excerpt e tags no frontmatter`);
console.log(`    2. Adicione os IDs de produtos em citedProductIds`);
console.log(`    3. Escreva o corpo do artigo`);
console.log(`    4. Mude status para "publicado" quando pronto`);

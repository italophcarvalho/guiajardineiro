# Guia Jardineiro

Site editorial de jardinagem monetizado com links de afiliados. Construído com Next.js 14 App Router + TypeScript + Tailwind CSS.

---

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse **http://localhost:3000**.

Para checar tipos sem rodar o servidor:

```bash
npm run typecheck
```

---

## Criar um novo post

```bash
npm run new-post "Título do Post" "Nome da Categoria"
```

Exemplo:

```bash
npm run new-post "Como cuidar de orquídeas" "Plantas de Interior"
```

O script cria `content/posts/<slug>.mdx` com frontmatter pré-preenchido e uma estrutura básica de seções.

Após criar o arquivo:

1. Preencha `metaDesc`, `excerpt` e `tags` no frontmatter
2. Adicione IDs de produtos em `citedProductIds` (ex.: `["p1", "p2"]`)
3. Escreva o corpo do artigo em MDX
4. Mude `status` de `"rascunho"` para `"publicado"` quando pronto

---

## Estrutura de pastas

```
├── app/
│   ├── (public)/           # Site público (Header + Footer)
│   │   ├── page.tsx        # Home
│   │   ├── artigo/[slug]/  # Página de post MDX
│   │   ├── categoria/[slug]/ # Listagem por categoria
│   │   ├── busca/          # Busca client-side
│   │   ├── autor/[slug]/   # Perfil de autor
│   │   ├── sobre/          # Página Sobre
│   │   ├── contato/        # Formulário de contato
│   │   └── legal/          # Docs legais (privacidade, termos, cookies, afiliados)
│   ├── admin/              # Painel CMS (sem Header/Footer públicos)
│   │   ├── page.tsx        # Dashboard de conteúdo
│   │   ├── editor/         # Editor de post
│   │   └── relatorio/      # Dashboard de analytics
│   ├── robots.ts           # robots.txt automático
│   ├── sitemap.ts          # sitemap.xml dinâmico
│   ├── layout.tsx          # Root layout (fontes, metadataBase)
│   └── globals.css         # Estilos globais mínimos
│
├── components/
│   ├── conversion/         # Componentes de receita (ProductCard, ComparisonTable…)
│   ├── layout/             # Header, Footer, Breadcrumb, TableOfContents, AdminShell
│   ├── article/            # StickyProductCTA
│   ├── category/           # PostCard, PostCardSkeleton, CategoryPostGrid
│   ├── search/             # SearchPageContent
│   ├── author/             # AuthorPostFilter
│   ├── legal/              # LegalPageContent
│   ├── admin/              # PostsTable, PostEditor
│   ├── home/               # HeroSearch
│   ├── ui/                 # Toast
│   └── mdx-components.tsx  # Mapa de componentes para MDX
│
├── content/
│   └── posts/              # Arquivos .mdx (um por artigo)
│
├── lib/
│   ├── types.ts            # Tipos de domínio (Post, Product, Category, Author…)
│   ├── mock-data.ts        # Dados de exemplo (substituir por CMS no futuro)
│   ├── mock-analytics.ts   # Dados de analytics para o dashboard
│   ├── mdx.ts              # Leitura e parse de arquivos MDX
│   ├── affiliate.ts        # Geração de URLs de afiliado
│   ├── slug.ts             # Função slugify
│   ├── legal-content.ts    # Textos dos docs legais
│   └── hooks/
│       └── use-scroll-position.ts
│
├── scripts/
│   └── new-post.mjs        # Gerador de posts MDX (node scripts/new-post.mjs)
│
├── next.config.mjs         # Configuração Next.js (imagens, headers, redirects)
├── tailwind.config.ts      # Design system (cores, fontes, tokens)
└── tsconfig.json
```

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com as variáveis abaixo. Nenhuma delas é obrigatória para rodar em desenvolvimento (o site usa dados mock), mas são necessárias para integração real.

```env
# Tag de associado Amazon (Programa de Associados)
NEXT_PUBLIC_AMAZON_TAG=guiajardineiro-20

# URL base do site (usada em sitemap e OG tags)
NEXT_PUBLIC_SITE_URL=https://www.guiajardineiro.com.br

# --- Persistência do editor admin em PRODUÇÃO (GitHub Contents API) ---
# Em dev, o editor grava direto em content/posts/ no disco — estas não são
# necessárias. Em produção (Vercel), o disco é somente-leitura, então o post
# é commitado no repositório, o que dispara um novo deploy.
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx   # PAT com escopo repo (contents:write)
GITHUB_REPO=italophcarvalho/guiajardineiro
GITHUB_BRANCH=main

# --- Upload de imagem destacada (Vercel Blob) ---
# Definido automaticamente ao conectar um Blob store no projeto Vercel.
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxx
```

> Em desenvolvimento, sem `GITHUB_TOKEN` o editor salva em `content/posts/{slug}.mdx`
> no disco. Sem `BLOB_READ_WRITE_TOKEN` o upload de imagem é desativado (o post
> é salvo sem a imagem destacada).

---

## Como adicionar um produto afiliado

**1. Registrar o produto em `lib/mock-data.ts`:**

```typescript
{
  id: "p7",                           // ID único, usado em citedProductIds
  name: "Nome do Produto",
  brand: "Fabricante",
  rating: "4,7",                      // Nota em pt-BR com vírgula
  reviews: 1200,                      // Número de avaliações (opcional)
  price: 129,                         // Preço a partir de (inteiro, em reais)
  tint: "#E5E2D9",                    // Cor de fundo do placeholder de imagem
  tag: "Melhor geral",                // Badge opcional (Melhor geral, Custo-benefício…)
  links: [
    {
      store: "Amazon",
      url: "https://amzn.to/XXXXXXX", // Link de afiliado
      label: "Ver na Amazon",
      price: 129,
    },
  ],
}
```

**2. Citar o produto em um post MDX:**

Adicione o ID ao frontmatter do artigo:

```yaml
citedProductIds: ["p7"]
featuredProduct: "p7"   # opcional: destaca no sidebar e no sticky CTA mobile
```

**3. Usar componentes de conversão no corpo do artigo:**

```mdx
<ProductCard id="p7" />

<BestPickBox productId="p7" reason="Melhor relação corte/preço no teste." />

<ComparisonTable preset="tesouras" />
```

O link de afiliado é resolvido automaticamente por `lib/affiliate.ts`. Se `product.links` não tiver uma URL explícita, o sistema gera uma busca Amazon com a tag configurada em `NEXT_PUBLIC_AMAZON_TAG`.

---

## Disclosure de afiliados

Todo ProductCard exibe automaticamente "Link de afiliado — comissão sem custo para você."

Em artigos com `citedProductIds` preenchidos, o componente `<AffiliateDisclosure />` é renderizado automaticamente logo após o bloco de autor, em conformidade com FTC e LGPD.

Os textos completos estão em `/legal?doc=afiliados`.

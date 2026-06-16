import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/mock-data";
import { getPublishedPosts, getPublishedCountByCategory } from "@/lib/posts";
import { HeroSearch } from "@/components/home/HeroSearch";
import { NewsletterInline } from "@/components/conversion/NewsletterInline";

/* ------------------------------------------------------------------ */
/* SEO metadata                                                        */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Guia Jardineiro — Recomendações testadas de verdade",
  description:
    "Guias práticos, comparativos honestos e recomendações de ferramentas, sementes e vasos para jardinagem.",
  openGraph: {
    title: "Guia Jardineiro — Recomendações testadas de verdade",
    description:
      "Guias práticos, comparativos honestos e recomendações de ferramentas, sementes e vasos para jardinagem.",
    type: "website",
    locale: "pt_BR",
    siteName: "Guia Jardineiro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guia Jardineiro — Recomendações testadas de verdade",
    description:
      "Guias práticos, comparativos honestos e recomendações de ferramentas, sementes e vasos para jardinagem.",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const published = getPublishedPosts();
  const countByCategory = getPublishedCountByCategory();

  const mostRead = [...published]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 4);
  const comparativos = published
    .filter((p) => p.type === "Comparativo")
    .slice(0, 3);
  const latestPosts = published.slice(0, 6);

  return (
    <>
      {/* ============================================================
          1. HERO
          ============================================================ */}
      <section className="border-b border-border bg-cream">
        <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-20">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-green-tint px-3 py-1.5 text-[12.5px] font-semibold uppercase tracking-[0.04em] text-green-700">
              Recomendações testadas de verdade
            </span>

            <h1
              className="mt-5 font-lora font-bold leading-[1.08] tracking-[-0.02em] text-green-900"
              style={{ fontSize: "clamp(34px, 5vw, 52px)" }}
            >
              Cultive melhor com produtos que a gente realmente testou.
            </h1>

            <p className="mt-4 max-w-[46ch] font-inter text-[18px] leading-relaxed text-[#4A5249]">
              Guias práticos, comparativos honestos e recomendações de
              ferramentas, sementes e vasos — escolhidos por quem coloca a mão
              na terra.
            </p>

            <div className="mt-7">
              <HeroSearch />
            </div>
          </div>

          {/* Right — hero visual placeholder */}
          <div
            className="relative flex items-end overflow-hidden rounded-[20px] border border-[#C2D1BD] p-[22px]"
            style={{
              aspectRatio: "4/3",
              background: "linear-gradient(150deg,#DCE8DD,#C9D6C4)",
            }}
          >
            {/* Big leaf watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-50">
              <LeafHeroIcon />
            </div>

            {/* Floating "Em alta" card */}
            <div className="relative rounded-[14px] bg-white/92 px-4 py-3.5 backdrop-blur-sm">
              <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-terracotta">
                Em alta esta semana
              </div>
              <div className="mt-1 font-lora text-[17px] font-semibold text-green-900">
                {mostRead[0]?.title}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. MAIS LIDOS
          ============================================================ */}
      <section className="mx-auto max-w-container px-6 py-14">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-lora text-[28px] font-bold tracking-[-0.01em] text-green-900">
            Mais lidos desta semana
          </h2>
          <Link
            href="/busca"
            className="font-inter text-[14px] font-semibold text-green-700 no-underline hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
          {mostRead.map((post, i) => (
            <Link
              key={post.id}
              href={`/artigo/${post.slug}`}
              className="group flex gap-4 rounded-card border border-border bg-surface p-3.5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              {/* Thumbnail + rank */}
              <div
                className="relative flex h-24 w-24 flex-none items-center justify-center rounded-[10px]"
                style={{ background: post.tint }}
              >
                <span className="absolute left-1.5 top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-green-900 font-lora text-[13px] font-bold text-white">
                  {i + 1}
                </span>
                <LeafSmallIcon />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-terracotta">
                  {post.categoryLabel}
                </div>
                <h3 className="mt-1.5 font-lora text-[17px] font-semibold leading-[1.25] text-ink">
                  {post.title}
                </h3>
                <div className="mt-2 text-[12.5px] text-muted">
                  {post.authorName} · {post.read} de leitura
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          3. CATEGORIAS EM DESTAQUE
          ============================================================ */}
      <section className="mx-auto max-w-container px-6 pb-14">
        <h2 className="mb-2 font-lora text-[28px] font-bold tracking-[-0.01em] text-green-900">
          Explore por categoria
        </h2>
        <p className="mb-6 font-inter text-[15px] text-muted">
          Encontre guias e comparativos no seu interesse.
        </p>

        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="group overflow-hidden rounded-[16px] border border-border no-underline transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_32px_rgba(27,67,50,0.12)]"
              style={{ background: cat.tint }}
            >
              <div className="flex h-24 items-center justify-center">
                <CategoryIcon catId={cat.id} />
              </div>
              <div className="bg-surface px-4 py-3.5">
                <div className="font-lora text-[16.5px] font-semibold text-green-900">
                  {cat.label}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[12.5px] text-muted">
                    {countByCategory[cat.id] ?? 0} artigos
                  </span>
                  <span className="text-[13px] font-bold text-green-700">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          4. COMPARATIVOS EM DESTAQUE
          ============================================================ */}
      <section className="bg-green-900">
        <div className="mx-auto max-w-container px-6 py-14">
          {/* Header */}
          <div className="mb-2 flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-terracotta">
              <TrophyIcon />
            </span>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-green-300">
              Alta conversão
            </p>
          </div>
          <h2 className="mb-2 font-lora text-[28px] font-bold tracking-[-0.01em] text-white">
            Comparativos em destaque
          </h2>
          <p className="mb-8 text-[15px] text-green-200">
            Rankings completos com a melhor escolha para cada perfil e
            orçamento.
          </p>

          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {comparativos.map((post) => (
              <Link
                key={post.id}
                href={`/artigo/${post.slug}`}
                className="group overflow-hidden rounded-[16px] border border-[#2D6A4F] bg-[#23553D] no-underline transition-transform duration-200 hover:-translate-y-[3px]"
              >
                {/* Thumbnail */}
                <div
                  className="relative flex h-[150px] items-center justify-center"
                  style={{
                    background: "linear-gradient(150deg,#2D6A4F,#1B4332)",
                  }}
                >
                  <span className="absolute left-3 top-3 rounded-pill bg-amber px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink">
                    Comparativo
                  </span>
                  <LeafSmallIcon className="text-green-200 opacity-70" />
                </div>

                <div className="p-[18px]">
                  <div className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-green-200">
                    {post.categoryLabel}
                  </div>
                  <h3 className="mt-1.5 font-lora text-[19px] font-semibold leading-[1.25] text-white">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-green-200">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-[13px] text-[#9CC4A8]">
                    <span>{post.authorName}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.read}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5. NEWSLETTER
          ============================================================ */}
      <section className="mx-auto max-w-container px-6 py-14">
        <div className="mx-auto max-w-[600px]">
          <NewsletterInline />
        </div>
      </section>

      {/* ============================================================
          6. ÚLTIMOS ARTIGOS
          ============================================================ */}
      <section className="mx-auto max-w-container px-6 pb-16">
        <h2 className="mb-6 font-lora text-[28px] font-bold tracking-[-0.01em] text-green-900">
          Últimos artigos
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              href={`/artigo/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-card border border-border bg-surface no-underline transition-all duration-200 hover:-translate-y-[3px] hover:shadow-card-hover"
            >
              {/* Thumbnail */}
              <div
                className="relative flex aspect-[16/10] items-center justify-center"
                style={{ background: post.tint }}
              >
                <span className="absolute left-2.5 top-2.5 rounded-pill bg-white/92 px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] text-terracotta">
                  {post.type}
                </span>
                <LeafSmallIcon />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-[18px]">
                <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-terracotta">
                  {post.categoryLabel}
                </div>
                <h3 className="mt-1.5 font-lora text-[18px] font-semibold leading-[1.28] text-ink">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-3 text-[12.5px] text-muted-2">
                  {post.authorName} · {post.date} · {post.read}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Local SVG components                                               */
/* ------------------------------------------------------------------ */

function LeafHeroIcon() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2D6A4F"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22c0-7 0-12 0-12" />
      <path d="M12 12C12 5 7 2 1 2c0 7 5 10 11 10Z" />
      <path d="M12 14c0-5 5-9 11-9 0 6-5 9-11 9Z" />
    </svg>
  );
}

function LeafSmallIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`text-green-700 opacity-60 ${className}`}
    >
      <path d="M12 20v-8" />
      <path d="M12 12C12 7 8 5 4 5c0 5 4 7 8 7Z" />
      <path d="M12 13c0-4 4-7 8-7 0 4-4 7-8 7Z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
    </svg>
  );
}

/** Category-specific icons matching the editorial content. */
function CategoryIcon({ catId }: { catId: string }) {
  const shared = "h-10 w-10 text-green-900 opacity-80";

  if (catId === "interior") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={shared}>
        <path d="M12 20v-8" /><path d="M12 12C12 7 8 5 4 5c0 5 4 7 8 7Z" /><path d="M12 13c0-4 4-7 8-7 0 4-4 7-8 7Z" />
        <rect x="8" y="19" width="8" height="3" rx="1" />
      </svg>
    );
  }
  if (catId === "horta") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={shared}>
        <path d="M12 2a3 3 0 0 0-3 3c0 2 3 5 3 5s3-3 3-5a3 3 0 0 0-3-3Z" />
        <path d="M12 10v12" />
        <path d="M8 14c0-2-2-4-4-4 0 2 2 4 4 4Z" />
        <path d="M16 16c0-2 2-4 4-4 0 2-2 4-4 4Z" />
      </svg>
    );
  }
  if (catId === "ferramentas") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={shared}>
        <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
        <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
      </svg>
    );
  }
  if (catId === "paisagismo") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={shared}>
        <path d="M12 22V12" />
        <path d="M12 12C12 6 7 2 2 2c0 6 5 10 10 10Z" />
        <path d="M12 12c0-5 5-9 10-9 0 5-5 9-10 9Z" />
        <path d="M5 22h14" />
      </svg>
    );
  }
  // pragas
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={shared}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

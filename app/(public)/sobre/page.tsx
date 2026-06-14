import type { Metadata } from "next";
import Link from "next/link";
import { authors } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Sobre — Guia Jardineiro",
  description:
    "Conheça o Guia Jardineiro: quem somos, como testamos os produtos e por que você pode confiar nas nossas recomendações.",
  alternates: { canonical: "https://www.guiajardineiro.com.br/sobre" },
};

export default function SobrePage() {
  return (
    <>
      {/* ============================================================
          1. HERO — fundo verde-900
          ============================================================ */}
      <section className="bg-green-900">
        <div className="mx-auto max-w-container px-6 py-20 text-center">
          <span className="inline-block rounded-pill bg-green-700/60 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-green-200">
            Quem somos
          </span>

          <h1 className="mx-auto mt-5 max-w-[700px] font-lora text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
            Recomendamos o que testamos. Sempre.
          </h1>

          <p className="mx-auto mt-5 max-w-[52ch] font-inter text-[18px] leading-relaxed text-green-200">
            Somos um time de jardineiros, agrônomos e entusiastas que testam
            ferramentas, substratos e vasos antes de recomendar qualquer coisa.
            Sem relações públicas. Sem produto pago para entrar na lista.
          </p>

          <Link
            href="/busca"
            className="mt-8 inline-flex items-center gap-2 rounded-[11px] border border-white px-6 py-3.5 font-inter text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-white hover:text-green-900"
          >
            Ver nossos guias
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* ============================================================
          2. 3 PILARES
          ============================================================ */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-container px-6 py-16">
          <h2 className="mb-10 text-center font-lora text-[28px] font-bold tracking-[-0.01em] text-green-900">
            Nossa forma de trabalhar
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Pilar
              icon={<BeakerIcon />}
              title="Testamos de verdade"
              body="Cada produto que aparece em nossos rankings passou por pelo menos 60 dias de uso real — em roseiras, vasos, hortas e jardins. Não confundimos especificação de fábrica com desempenho real."
            />
            <Pilar
              icon={<ShieldIcon />}
              title="Independência editorial"
              body="Nenhuma marca paga para entrar em uma lista ou ganhar a posição de 'melhor geral'. As posições nos rankings refletem exclusivamente o resultado dos nossos testes."
            />
            <Pilar
              icon={<EyeIcon />}
              title="Transparência total"
              body="Somos transparentes sobre como ganhamos dinheiro: por comissões de afiliados quando você compra pelos nossos links. Isso não custa nada extra para você — e nos permite manter os testes independentes."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          3. COMO RECOMENDAMOS PRODUTOS
          ============================================================ */}
      <section className="mx-auto max-w-container px-6 py-14">
        <div className="mx-auto max-w-[680px]">
          <h2 className="font-lora text-[26px] font-bold tracking-[-0.01em] text-green-900">
            Como escolhemos o que recomendamos
          </h2>

          <p className="mt-4 font-inter text-[17px] leading-[1.75] text-body-2">
            O processo começa com uma lista longa. Identificamos os produtos
            mais relevantes em cada categoria — às vezes 15, às vezes 40 — e
            compramos os candidatos mais promissores com nosso próprio dinheiro
            ou por empréstimo direto com o fabricante (sempre declarado).
          </p>

          <p className="mt-4 font-inter text-[17px] leading-[1.75] text-body-2">
            Depois, meses de uso real. Só então escrevemos o artigo. Se um
            produto não se sair bem o suficiente para recomendarmos a um amigo,
            não entra na lista — mesmo que a marca seja parceira de afiliados.
          </p>

          <p className="mt-4 font-inter text-[17px] leading-[1.75] text-body-2">
            Participamos de programas de afiliados, incluindo o da Amazon. Quando
            você compra por um dos nossos links, recebemos uma comissão sem custo
            extra para você.{" "}
            <Link
              href="/legal?doc=afiliados"
              className="font-semibold text-green-700 underline underline-offset-2 hover:text-green-900"
            >
              Leia nossa divulgação completa de afiliados.
            </Link>
          </p>
        </div>
      </section>

      {/* ============================================================
          4. EQUIPE
          ============================================================ */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-container px-6 py-14">
          <h2 className="mb-8 font-lora text-[26px] font-bold tracking-[-0.01em] text-green-900">
            Quem faz o Guia Jardineiro
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/autor/${author.slug}`}
                className="group flex flex-col items-center rounded-card border border-border bg-cream p-7 text-center no-underline transition-all duration-200 hover:-translate-y-[3px] hover:shadow-card-hover"
              >
                {/* Avatar */}
                <div
                  className="flex h-[72px] w-[72px] items-center justify-center rounded-full text-[26px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#2D6A4F,#40916C)" }}
                >
                  <span className="font-lora">{author.initial}</span>
                </div>

                <div className="mt-4">
                  <div className="font-lora text-[18px] font-bold text-green-900">
                    {author.name}
                  </div>
                  <div className="mt-1 text-[13px] font-bold uppercase tracking-[0.04em] text-terracotta">
                    {author.role}
                  </div>
                  <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-muted">
                    {author.bio}
                  </p>
                </div>

                <span className="mt-4 text-[13.5px] font-semibold text-green-700 group-hover:underline">
                  Ver perfil →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Local sub-components                                                */
/* ------------------------------------------------------------------ */

function Pilar({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-green-tint text-green-700">
        {icon}
      </div>
      <h3 className="font-lora text-[20px] font-semibold text-green-900">
        {title}
      </h3>
      <p className="font-inter text-[15.5px] leading-[1.7] text-body-2">{body}</p>
    </div>
  );
}

/* ---- Icons -------------------------------------------------------- */

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function BeakerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3h6l1 9H8L9 3Z" />
      <path d="M6.5 12H17.5L20 19a2 2 0 0 1-1.9 2.5H5.9A2 2 0 0 1 4 19Z" />
      <path d="M10 16h.01M14 14h.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

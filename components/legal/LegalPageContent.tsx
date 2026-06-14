"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { legalNav, legalContent, type LegalSlug } from "@/lib/legal-content";

const DEFAULT_SLUG: LegalSlug = "privacidade";

function isLegalSlug(s: string | null): s is LegalSlug {
  return legalNav.some((n) => n.slug === s);
}

export function LegalPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawDoc = searchParams.get("doc");
  const activeSlug: LegalSlug = isLegalSlug(rawDoc) ? rawDoc : DEFAULT_SLUG;
  const doc = legalContent[activeSlug];

  // Write default slug into URL on first render so the address bar always
  // shows a canonical ?doc= value.
  useEffect(() => {
    if (!isLegalSlug(rawDoc)) {
      router.replace(`/legal?doc=${DEFAULT_SLUG}`, { scroll: false });
    }
  }, [rawDoc, router]);

  const navigate = useCallback(
    (slug: LegalSlug) => {
      router.push(`/legal?doc=${slug}`, { scroll: false });
    },
    [router]
  );

  return (
    <div className="mx-auto max-w-container px-6 py-12">
      <h1 className="mb-8 font-lora text-[clamp(26px,3.5vw,36px)] font-bold tracking-[-0.01em] text-green-900">
        Informações Legais
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* ---- Left sticky nav ---- */}
        <nav
          aria-label="Documentos legais"
          className="lg:sticky lg:top-[120px] lg:h-fit lg:w-[240px] lg:flex-none"
        >
          <ul className="flex flex-col gap-1">
            {legalNav.map((item) => {
              const isActive = item.slug === activeSlug;
              return (
                <li key={item.slug}>
                  <button
                    onClick={() => navigate(item.slug)}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "w-full rounded-[9px] px-3.5 py-2.5 text-left font-inter text-[14px] font-semibold transition-colors duration-150",
                      isActive
                        ? "bg-green-tint text-green-900"
                        : "text-muted hover:bg-[#F0EDE4] hover:text-ink",
                      item.slug === "afiliados" ? "mt-2 border-t border-border pt-4" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {item.label}
                    {item.slug === "afiliados" && (
                      <span className="ml-2 inline-block rounded-pill bg-amber/20 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em] text-amber-text">
                        FTC/LGPD
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ---- Right: document content ---- */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.05em] text-muted">
            Última atualização: {doc.updated}
          </div>
          <h2 className="font-lora text-[26px] font-bold tracking-[-0.01em] text-green-900">
            {doc.title}
          </h2>

          {/* Affiliate disclosure call-out — only on afiliados */}
          {activeSlug === "afiliados" && (
            <div className="mt-5 rounded-r-[12px] border-l-4 border-terracotta bg-[#FBF1E9] p-4">
              <p className="text-[14.5px] font-semibold text-[#A8420F]">
                Divulgação obrigatória — FTC &amp; LGPD
              </p>
              <p className="mt-1 text-[14px] leading-snug text-[#7A4A2E]">
                O Guia Jardineiro recebe comissões de afiliados. Este aviso é
                exigido pela legislação brasileira e pelas diretrizes da FTC.
              </p>
            </div>
          )}

          <div className="mt-7 flex flex-col gap-8">
            {doc.sections.map((section, i) => (
              <section key={i}>
                <h3 className="font-lora text-[19px] font-semibold text-green-900">
                  {section.h}
                </h3>
                <p className="mt-2.5 font-inter text-[16px] leading-[1.75] text-body-2">
                  {section.p}
                </p>
              </section>
            ))}
          </div>

          {/* Footer note */}
          <p className="mt-10 border-t border-border pt-5 text-[13px] text-muted">
            Dúvidas? Escreva para{" "}
            <a
              href="mailto:contato@guiajardineiro.com.br"
              className="font-semibold text-green-700 hover:underline"
            >
              contato@guiajardineiro.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LegalPageContent;

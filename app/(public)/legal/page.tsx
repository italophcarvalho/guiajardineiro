import type { Metadata } from "next";
import { Suspense } from "react";
import { LegalPageContent } from "@/components/legal/LegalPageContent";

export const metadata: Metadata = {
  title: "Informações Legais — Guia Jardineiro",
  description:
    "Política de Privacidade, Termos de Uso, Política de Cookies e Divulgação de Links de Afiliados do Guia Jardineiro.",
  alternates: { canonical: "https://www.guiajardineiro.com.br/legal" },
};

/**
 * Legal document page.
 * LegalPageContent uses useSearchParams (?doc=) so it requires Suspense.
 */
export default function LegalPage() {
  return (
    <Suspense>
      <LegalPageContent />
    </Suspense>
  );
}

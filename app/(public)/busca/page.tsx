import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageContent } from "@/components/search/SearchPageContent";

export const metadata: Metadata = {
  title: "Busca — Guia Jardineiro",
  description:
    "Pesquise entre nossos guias e comparativos de jardinagem.",
};

/**
 * Search page — wraps the client component in Suspense so
 * `useSearchParams()` can work with SSR without erroring.
 */
export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  );
}

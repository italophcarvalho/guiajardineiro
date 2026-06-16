import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageContent } from "@/components/search/SearchPageContent";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Busca — Guia Jardineiro",
  description:
    "Pesquise entre nossos guias e comparativos de jardinagem.",
};

/**
 * Search page — reads the published posts on the server (file-based) and hands
 * them to the client component, which does the live filtering. Wrapped in
 * Suspense so `useSearchParams()` works with SSR without erroring.
 */
export default function SearchPage() {
  const posts = getPublishedPosts();
  return (
    <Suspense>
      <SearchPageContent posts={posts} />
    </Suspense>
  );
}

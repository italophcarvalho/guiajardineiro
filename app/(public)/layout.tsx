import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Public site layout — adds the site Header and Footer.
 *
 * This wraps all routes under app/(public)/ (home, posts, categories, authors,
 * search, contact, about, legal). The /admin subtree has its own layout and
 * never inherits this one.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.guiajardineiro.com.br"),
  title: {
    default: "Guia Jardineiro — Recomendações de jardinagem testadas de verdade",
    template: "%s · Guia Jardineiro",
  },
  description:
    "Guias práticos, comparativos honestos e recomendações de ferramentas, sementes e vasos — escolhidos por quem coloca a mão na terra.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  openGraph: {
    siteName: "Guia Jardineiro",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@guiajardineiro",
  },
};

/**
 * Root layout — sets up HTML document, fonts and base body styles only.
 *
 * Header and Footer are NOT here. They live in app/(public)/layout.tsx so
 * the /admin subtree inherits this shell without the public chrome.
 * The admin shell mounts its own sidebar+topbar in app/admin/layout.tsx.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${lora.variable} ${inter.variable}`}>
      <body className="font-inter bg-cream text-ink antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

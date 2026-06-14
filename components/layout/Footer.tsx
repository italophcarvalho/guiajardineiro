import Link from "next/link";
import { categories } from "@/lib/mock-data";

const legalLinks = [
  { label: "Política de Privacidade", href: "/legal/privacidade" },
  { label: "Termos de Uso", href: "/legal/termos" },
  { label: "Política de Cookies", href: "/legal/cookies" },
  { label: "Divulgação de Afiliados", href: "/legal/afiliados" },
];

const institutionalLinks = [
  { label: "Sobre", href: "/sobre" },
  { label: "Equipe", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export function Footer() {
  return (
    <footer className="bg-green-950 text-green-200">
      {/* Main grid */}
      <div className="mx-auto max-w-container px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Col 1: brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-surface no-underline"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] bg-green-700">
                <LeafLogoIcon />
              </span>
              <span className="font-lora text-[19px] font-bold text-white">
                Guia Jardineiro
              </span>
            </Link>
            <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-green-200">
              Recomendações de jardinagem testadas de verdade — por quem coloca
              a mão na terra.
            </p>
          </div>

          {/* Col 2: categories */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.07em] text-green-100">
              Categorias
            </h3>
            <ul className="flex flex-col gap-2.5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="text-sm font-medium text-green-200 no-underline transition-colors hover:text-white"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: institutional + legal */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.07em] text-green-100">
              Institucional
            </h3>
            <ul className="flex flex-col gap-2.5">
              {institutionalLinks.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="text-sm font-medium text-green-200 no-underline transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mb-4 mt-8 text-xs font-bold uppercase tracking-[0.07em] text-green-100">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-medium text-green-200 no-underline transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar — affiliate disclosure (required by FTC/LGPD) */}
      <div className="border-t border-[#244B38]">
        <div className="mx-auto flex max-w-container flex-wrap items-center justify-between gap-3 px-6 py-5">
          <p className="text-xs text-green-100 opacity-70">
            © 2026 Guia Jardineiro · Participamos de programas de afiliados,
            incluindo o Programa de Associados da Amazon. Podemos receber
            comissões por compras feitas através de links neste site, sem custo
            adicional para você.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-green-200 opacity-70 transition-opacity hover:opacity-100"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-green-200 opacity-70 transition-opacity hover:opacity-100"
            >
              <YouTubeIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Inline SVG icons (no external dep needed)                          */
/* ------------------------------------------------------------------ */

function LeafLogoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9CC4A8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22c0-6 0-10 0-10" />
      <path d="M12 12C12 7 8 4 3 4c0 5 4 8 9 8Z" fill="#2D6A4F" stroke="#9CC4A8" />
      <path d="M12 14c0-4 4-7 9-7 0 4-4 7-9 7Z" fill="#40916C" stroke="#C9E4D2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58Z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default Footer;

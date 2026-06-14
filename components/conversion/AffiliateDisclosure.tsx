import Link from "next/link";

interface AffiliateDisclosureProps {
  /**
   * compact=true → one-liner for ProductCard footer.
   * compact=false (default) → full info-box for article headers.
   */
  compact?: boolean;
}

/**
 * FTC/LGPD affiliate disclosure.
 * Full variant goes at the top of every article with citedProducts.
 * Compact variant goes in the footer of every ProductCard.
 */
export function AffiliateDisclosure({ compact = false }: AffiliateDisclosureProps) {
  if (compact) {
    return (
      <p className="mt-3 text-[11px] leading-snug text-muted-2">
        Link de afiliado — comissão sem custo para você.{" "}
        <Link
          href="/legal?doc=afiliados"
          className="underline hover:text-green-700"
        >
          Saiba mais
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="mt-5 flex items-start gap-2.5 rounded-[10px] border border-border-2 bg-surface-2 px-4 py-3 text-[13px] leading-snug text-muted">
      <InfoIcon className="mt-px h-4 w-4 flex-none text-green-700" />
      <span>
        Este artigo pode conter links de afiliados. Se você comprar através deles,
        recebemos uma comissão sem custo extra para você.{" "}
        <Link
          href="/legal?doc=afiliados"
          className="font-semibold text-green-700 no-underline hover:underline"
        >
          Saiba mais
        </Link>
        .
      </span>
    </div>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

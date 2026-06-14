import { Stars, formatRating, formatPrice, affiliateLinkRel } from "./_shared";

export interface ComparisonRow {
  rank: number;
  name: string;
  /** Optional badge, e.g. "Melhor geral". */
  tag?: string;
  /** Rating 0–5. */
  rating: number;
  /** "Melhor para" / highlight text, e.g. "uso geral". */
  highlight: string;
  /** Price as a string, e.g. "89". */
  price: string;
  affiliateUrl: string;
}

export interface ComparisonTableProps {
  rows: ComparisonRow[];
  /** Optional label for the highlight column. Default "Melhor para". */
  highlightLabel?: string;
  ctaLabel?: string;
}

/**
 * Responsive product comparison table with a per-row affiliate CTA.
 * Scrolls horizontally on narrow screens (inner table has a min-width).
 */
export function ComparisonTable({
  rows,
  highlightLabel = "Melhor para",
  ctaLabel = "Ver preço",
}: ComparisonTableProps) {
  return (
    <div className="gj-scroll overflow-x-auto rounded-card border border-border">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#F4F1E8] text-left">
            <th className="px-4 py-3.5 font-bold text-green-900">Modelo</th>
            <th className="px-4 py-3.5 font-bold text-green-900">Avaliação</th>
            <th className="px-4 py-3.5 font-bold text-green-900">
              {highlightLabel}
            </th>
            <th className="px-4 py-3.5 font-bold text-green-900">Preço</th>
            <th className="px-4 py-3.5" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.rank}
              className="border-t border-[#EFEDE4] transition-colors duration-200 hover:bg-[#FAFAF6]"
            >
              <td className="px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <span className="font-lora text-base font-bold text-green-900">
                    {row.rank}
                  </span>
                  <div>
                    <div className="font-semibold text-ink">{row.name}</div>
                    {row.tag && (
                      <span className="mt-1 inline-block rounded-pill bg-terracotta px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-surface">
                        {row.tag}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-muted">
                <span className="flex items-center gap-1.5">
                  <Stars rating={row.rating} size="text-xs" />
                  {formatRating(row.rating)}
                </span>
              </td>
              <td className="px-4 py-3.5 text-body-2">{row.highlight}</td>
              <td className="px-4 py-3.5 font-bold text-green-900">
                {formatPrice(row.price)}
              </td>
              <td className="px-4 py-3">
                <a
                  href={row.affiliateUrl}
                  target="_blank"
                  rel={affiliateLinkRel}
                  className="inline-flex whitespace-nowrap rounded-[9px] bg-terracotta px-4 py-2.5 font-inter text-[13px] font-semibold text-surface transition-all duration-200 hover:bg-terracotta-hover"
                >
                  {ctaLabel}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonTable;

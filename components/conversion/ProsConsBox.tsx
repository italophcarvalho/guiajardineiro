import type { SVGProps } from "react";

export interface ProsConsBoxProps {
  /** List of pros (positive points). */
  pros: string[];
  /** List of cons (drawbacks). */
  cons: string[];
  /** Heading above the pros column. Default "Prós". */
  prosLabel?: string;
  /** Heading above the cons column. Default "Contras". */
  consLabel?: string;
}

/* --- icons --------------------------------------------------------- */

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

/**
 * Two-column pros / cons comparison block.
 * Prós: green tint (#F1F8F2 / #CDE3D4). Contras: terracotta tint (#FBF2EC / #E7D2C8).
 * Collapses to a single column on narrow screens.
 */
export function ProsConsBox({
  pros,
  cons,
  prosLabel = "Prós",
  consLabel = "Contras",
}: ProsConsBoxProps) {
  return (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Prós */}
      <div className="rounded-card border border-callout-pros-border bg-callout-pros-bg p-[18px]">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-surface">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
          <h4 className="font-lora text-[16px] font-bold text-green-900">
            {prosLabel}
          </h4>
        </div>
        <ul className="flex flex-col gap-2">
          {pros.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] leading-snug text-body-2">
              <CheckIcon className="mt-1 h-[15px] w-[15px] flex-none text-green-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contras */}
      <div className="rounded-card border border-callout-cons-border bg-callout-cons-bg p-[18px]">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-terracotta text-surface">
            <MinusIcon className="h-3.5 w-3.5" />
          </span>
          <h4 className="font-lora text-[16px] font-bold text-[#A8420F]">
            {consLabel}
          </h4>
        </div>
        <ul className="flex flex-col gap-2">
          {cons.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] leading-snug text-[#7A4A2E]">
              <MinusIcon className="mt-1 h-[15px] w-[15px] flex-none text-terracotta" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProsConsBox;

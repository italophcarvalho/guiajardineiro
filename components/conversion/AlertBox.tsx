import type { ReactNode, SVGProps } from "react";

export type AlertType = "dica" | "atencao" | "info" | "produto";

export interface AlertBoxProps {
  type: AlertType;
  title?: string;
  children: ReactNode;
}

interface AlertStyle {
  border: string;
  bg: string;
  iconColor: string;
  titleColor: string;
  bodyColor: string;
  defaultTitle: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

/* --- icons --------------------------------------------------------- */

function LightbulbIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

function WarningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function TagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

/* --- variant styles ------------------------------------------------ */

const STYLES: Record<AlertType, AlertStyle> = {
  dica: {
    border: "#40916C",
    bg: "#EAF1EA",
    iconColor: "#2D6A4F",
    titleColor: "#1B4332",
    bodyColor: "#3A5D45",
    defaultTitle: "Dica de especialista",
    Icon: LightbulbIcon,
  },
  atencao: {
    border: "#C8541F",
    bg: "#FBF1E9",
    iconColor: "#C8541F",
    titleColor: "#A8420F",
    bodyColor: "#7A4A2E",
    defaultTitle: "Atenção",
    Icon: WarningIcon,
  },
  info: {
    border: "#2D6A4F",
    bg: "#F0F5F1",
    iconColor: "#2D6A4F",
    titleColor: "#1B4332",
    bodyColor: "#3A4339",
    defaultTitle: "Informação",
    Icon: InfoIcon,
  },
  produto: {
    border: "#E8A02C",
    bg: "#FBF6EC",
    iconColor: "#E8A02C",
    titleColor: "#B07A14",
    bodyColor: "#5C4A2A",
    defaultTitle: "Recomendação",
    Icon: TagIcon,
  },
};

/**
 * Editorial callout box with a colored left border + tonal background.
 * Four variants: dica (green), atencao (terracotta), info (green-700),
 * produto (amber).
 */
export function AlertBox({ type, title, children }: AlertBoxProps) {
  const s = STYLES[type];
  const Icon = s.Icon;
  const heading = title ?? s.defaultTitle;

  return (
    <div
      role="note"
      className="my-6 flex gap-3.5 rounded-r-[12px] p-4 sm:px-[18px]"
      style={{ background: s.bg, borderLeft: `4px solid ${s.border}` }}
    >
      <Icon
        className="mt-0.5 h-[22px] w-[22px] flex-none"
        style={{ color: s.iconColor }}
      />
      <div>
        {heading && (
          <div
            className="mb-1 text-[15px] font-bold"
            style={{ color: s.titleColor }}
          >
            {heading}
          </div>
        )}
        <div className="text-[15px] leading-relaxed" style={{ color: s.bodyColor }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AlertBox;

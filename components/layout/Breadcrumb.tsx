import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  /** When omitted, the item renders as plain text (current page). */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Editorial breadcrumb trail.
 * The first item is always "Início" → "/".
 * The last item is the current page — rendered without a link.
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  const crumbs: BreadcrumbItem[] = [{ label: "Início", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {isLast || !crumb.href ? (
                <span
                  className={isLast ? "text-ink" : "text-muted"}
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="font-semibold text-green-700 no-underline transition-colors hover:text-green-900"
                >
                  {crumb.label}
                </Link>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-muted-2">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;

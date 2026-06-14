"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  disabled?: boolean;
}

const panelNav: NavItem[] = [
  {
    label: "Conteúdo",
    href: "/admin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 5h16M4 12h16M4 19h10" />
      </svg>
    ),
  },
  {
    label: "Relatório",
    href: "/admin/relatorio",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 5-6" />
      </svg>
    ),
  },
];

const gestaoNav: NavItem[] = [
  {
    label: "Comentários",
    href: "#",
    disabled: true,
    badge: 5,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      </svg>
    ),
  },
  {
    label: "Mídia",
    href: "#",
    disabled: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
  },
  {
    label: "Autores",
    href: "#",
    disabled: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    ),
  },
  {
    label: "Configurações",
    href: "#",
    disabled: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4.5a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 6 8.6l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 11 4.6h.09A1.65 1.65 0 0 0 12 2.5a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 19.4 6Z" />
      </svg>
    ),
  },
];

/** Page title derived from pathname. */
function usePageTitle() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin/relatorio")) return "Relatório";
  if (pathname.startsWith("/admin/editor") || pathname.includes("/editor")) return "Editor de post";
  return "Conteúdo";
}

interface AdminShellProps {
  children: ReactNode;
}

/**
 * Admin chrome: fixed sidebar (green-950) + sticky topbar + scrollable main.
 * On mobile the sidebar slides in as a drawer over an overlay.
 */
export function AdminShell({ children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = usePageTitle();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin" || pathname.startsWith("/admin/editor");
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col py-[18px]">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 pb-[18px]">
        <span className="inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] bg-green-700">
          <LeafIcon />
        </span>
        <div>
          <div className="font-lora text-base font-bold leading-tight text-white">
            Guia Jardineiro
          </div>
          <div className="text-[11px] font-semibold tracking-[0.04em] text-[#7FA38C]">
            PAINEL EDITORIAL
          </div>
        </div>
      </div>

      {/* Painel section */}
      <p className="px-[20px] pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-[0.07em] text-[#5E8470]">
        Painel
      </p>
      <nav className="px-2">
        {panelNav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              className={[
                "flex items-center gap-[11px] rounded-[10px] px-3 py-[10px] font-inter text-[14px] font-semibold no-underline transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-[#A9C0B2] hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Gestão section */}
      <p className="px-[20px] pb-1.5 pt-[18px] text-[11px] font-bold uppercase tracking-[0.07em] text-[#5E8470]">
        Gestão
      </p>
      <nav className="px-2">
        {gestaoNav.map((item) => (
          <div
            key={item.label}
            className="flex cursor-not-allowed items-center gap-[11px] rounded-[10px] px-3 py-[10px] font-inter text-[14px] font-semibold text-[#A9C0B2]"
            title="Em breve"
          >
            {item.icon}
            {item.label}
            {item.badge != null && (
              <span className="ml-auto rounded-pill bg-terracotta px-[7px] py-px text-[11px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="mt-auto border-t border-[#244B38] px-4 pt-3.5">
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 font-lora text-base font-bold text-white">
            M
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-semibold text-white">
              Marina Couto
            </div>
            <div className="text-[11.5px] text-[#7FA38C]">Editora-chefe</div>
          </div>
        </div>
        <Link
          href="/"
          className="mt-2 flex items-center gap-2 px-1 py-2 text-[12.5px] text-green-200 no-underline transition-colors hover:text-white"
        >
          <ExternalLinkIcon />
          Ver o site publicado
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-app-bg font-inter">
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside className="hidden w-[248px] flex-none bg-green-950 text-green-200 md:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>

      {/* ── Mobile drawer ────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[248px] bg-green-950 text-green-200 transition-transform duration-300 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu de navegação"
      >
        <button
          onClick={() => setDrawerOpen(false)}
          aria-label="Fechar menu"
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-green-200 hover:text-white"
        >
          <XIcon />
        </button>
        <div className="h-full overflow-y-auto">{sidebarContent}</div>
      </aside>

      {/* ── Main content area ────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border-2 bg-app-bg/90 px-7 py-[14px] backdrop-blur-sm">
          {/* Mobile: burger */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            className="mr-1 inline-flex h-9 w-9 flex-none items-center justify-center rounded-[9px] border border-border-2 bg-surface text-green-700 md:hidden"
          >
            <MenuIcon />
          </button>

          <div className="font-lora text-[20px] font-bold text-green-900">
            {pageTitle}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="hidden items-center gap-2 rounded-pill border border-border-2 bg-surface px-[14px] py-2 sm:flex" style={{ width: 240 }}>
              <SearchIcon />
              <input
                type="search"
                placeholder="Buscar no painel..."
                aria-label="Buscar no painel"
                className="w-full border-none bg-transparent font-inter text-[13.5px] text-ink outline-none placeholder:text-muted"
              />
            </div>

            {/* Notifications */}
            <button
              aria-label="Notificações"
              className="relative inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-border-2 bg-surface text-[#3A5D45]"
            >
              <BellIcon />
              <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-terracotta" />
            </button>

            {/* Avatar */}
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 font-lora font-bold text-white">
              M
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-7">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CC4A8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22v-10" />
      <path d="M12 12C12 7 8 4 3 4c0 5 4 8 9 8Z" />
      <path d="M12 14c0-4 4-7 9-7 0 4-4 7-9 7Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6F766B" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

export default AdminShell;

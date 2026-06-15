"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import type { ProductRole } from "@/lib/mdx-serializer";

interface ProductPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: Product, role: ProductRole) => void;
}

/**
 * Modal that lists the affiliate catalog (GET /api/products) and lets the
 * editor pick a product + role to insert as a `product` conversion block.
 */
export function ProductPickerModal({
  open,
  onClose,
  onSelect,
}: ProductPickerModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<ProductRole>("essencial");

  /* Fetch the catalog the first time the modal opens. */
  useEffect(() => {
    if (!open || products.length > 0) return;
    setLoading(true);
    setError(null);
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setError("Não foi possível carregar os produtos."))
      .finally(() => setLoading(false));
  }, [open, products.length]);

  /* Close on Escape. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Selecionar produto afiliado"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-card-lg border border-border bg-surface shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-lora text-[18px] font-bold text-green-900">
            Inserir produto afiliado
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-2 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 border-b border-border px-5 py-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou marca..."
            className="w-full rounded-[9px] border border-border-3 bg-surface px-3 py-2 font-inter text-[14px] text-ink outline-none focus:border-green-700/50"
          />
          <div className="flex items-center gap-2 text-[12px] font-semibold text-muted">
            Papel:
            <div className="flex gap-[3px] rounded-[9px] bg-[#F1EFE7] p-[3px]">
              {(["essencial", "complementar"] as ProductRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={[
                    "rounded-md px-3 py-1.5 text-[12px] font-semibold capitalize transition-all",
                    role === r
                      ? "bg-surface text-green-900 shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                      : "bg-transparent text-muted",
                  ].join(" ")}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="gj-scroll flex-1 overflow-y-auto p-3">
          {loading && (
            <p className="px-2 py-6 text-center text-[13px] text-muted">
              Carregando produtos...
            </p>
          )}
          {error && (
            <p className="px-2 py-6 text-center text-[13px] text-terracotta">
              {error}
            </p>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="px-2 py-6 text-center text-[13px] text-muted">
              Nenhum produto encontrado.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p, role)}
                className="flex items-center gap-3 rounded-card border border-border bg-surface-2 px-3.5 py-3 text-left transition-colors hover:border-green-500 hover:bg-green-tint/40"
              >
                <span
                  className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-[9px] font-lora text-[15px] font-bold text-green-700"
                  style={{ background: p.tint }}
                >
                  {p.brand.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-green-700">
                    {p.brand}
                  </div>
                  <div className="truncate text-[14px] font-semibold text-ink">
                    {p.name}
                  </div>
                  <div className="mt-0.5 text-[12px] text-muted">
                    ★ {p.rating} · a partir de R$ {p.price}
                  </div>
                </div>
                {p.tag && (
                  <span className="flex-none rounded-pill bg-terracotta/10 px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide text-terracotta">
                    {p.tag}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPickerModal;

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { categories, authors, getPostBySlug } from "@/lib/mock-data";
import { slugify } from "@/lib/slug";
import { Toast } from "@/components/ui/Toast";

/* ------------------------------------------------------------------ */
/* Conversion block types                                              */
/* ------------------------------------------------------------------ */

type BlockKind = "Produto afiliado" | "Tabela comparativa" | "Caixa de destaque";

interface Block {
  id: number;
  kind: BlockKind;
  label: string;
}

const BLOCK_META: Record<
  BlockKind,
  { glyph: string; iconBg: string; iconColor: string }
> = {
  "Produto afiliado": { glyph: "🛒", iconBg: "#FBEFE6", iconColor: "#C8541F" },
  "Tabela comparativa": { glyph: "▦", iconBg: "#EAF1EA", iconColor: "#2D6A4F" },
  "Caixa de destaque": { glyph: "★", iconBg: "#FBF1DC", iconColor: "#B07A14" },
};

type PubState = "rascunho" | "agendar" | "publicar";

const META_LIMIT = 160;
let blockSeq = 0;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function PostEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");
  const existing = editId ? getPostBySlug(editId) : undefined;

  /* ---- state ---- */
  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [slugManual, setSlugManual] = useState(Boolean(existing));
  const [editingSlug, setEditingSlug] = useState(false);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pubState, setPubState] = useState<PubState>(
    existing?.status === "agendado"
      ? "agendar"
      : existing?.status === "rascunho"
        ? "rascunho"
        : existing
          ? "publicar"
          : "rascunho"
  );

  const [category, setCategory] = useState(
    existing?.categoryLabel ?? categories[0].label
  );
  const [author, setAuthor] = useState(existing?.authorName ?? authors[0].name);
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [metaDesc, setMetaDesc] = useState(existing?.metaDesc ?? "");

  const [toast, setToast] = useState<string | null>(null);

  const bodyRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ---- title → slug sync (until user edits slug manually) ---- */
  function handleTitle(value: string) {
    setTitle(value);
    if (!slugManual) setSlug(slugify(value));
  }

  /* ---- revoke object URL on unmount ---- */
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  /* ---- toolbar (execCommand on the contenteditable body) ---- */
  const exec = useCallback((command: string, value?: string) => {
    bodyRef.current?.focus();
    // eslint-disable-next-line deprecation/deprecation
    document.execCommand(command, false, value);
  }, []);

  const toolbar: { label: string; title: string; onClick: () => void }[] = [
    { label: "B", title: "Negrito", onClick: () => exec("bold") },
    { label: "I", title: "Itálico", onClick: () => exec("italic") },
    { label: "H2", title: "Título 2", onClick: () => exec("formatBlock", "h2") },
    { label: "H3", title: "Título 3", onClick: () => exec("formatBlock", "h3") },
    { label: "❝", title: "Citação", onClick: () => exec("formatBlock", "blockquote") },
    { label: "•", title: "Lista", onClick: () => exec("insertUnorderedList") },
    {
      label: "🔗",
      title: "Link",
      onClick: () => {
        const url = window.prompt("URL do link:");
        if (url) exec("createLink", url);
      },
    },
    {
      label: "▦",
      title: "Tabela",
      onClick: () =>
        exec(
          "insertHTML",
          '<table style="width:100%;border-collapse:collapse;margin:12px 0"><tbody><tr><td style="border:1px solid #E7E3D8;padding:8px">Coluna 1</td><td style="border:1px solid #E7E3D8;padding:8px">Coluna 2</td></tr></tbody></table>'
        ),
    },
    {
      label: "🖼",
      title: "Imagem",
      onClick: () => {
        const url = window.prompt("URL da imagem:");
        if (url) exec("insertImage", url);
      },
    },
  ];

  /* ---- blocks ---- */
  function addBlock(kind: BlockKind, label: string) {
    setBlocks((prev) => [...prev, { id: ++blockSeq, kind, label }]);
  }
  function removeBlock(id: number) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  /* ---- tags ---- */
  function handleTagKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim().replace(/,$/, "");
      if (value && !tags.includes(value)) setTags((prev) => [...prev, value]);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  }
  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  /* ---- image ---- */
  function handleFile(file: File | undefined) {
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  }

  /* ---- publish / save → toast → back to /admin ---- */
  function finishWith(message: string) {
    setToast(message);
    setTimeout(() => router.push("/admin"), 1500);
  }
  function publish() {
    finishWith(
      pubState === "agendar"
        ? "Post agendado com sucesso!"
        : pubState === "rascunho"
          ? "Rascunho salvo."
          : "Post publicado com sucesso!"
    );
  }
  function saveDraft() {
    finishWith("Rascunho salvo.");
  }

  /* ---- derived ---- */
  const publishLabel =
    pubState === "agendar"
      ? "Agendar publicação"
      : pubState === "rascunho"
        ? "Salvar e revisar"
        : "Publicar agora";

  const metaCount = metaDesc.length;
  const metaColor =
    metaCount > META_LIMIT
      ? "#C8541F"
      : metaCount >= 120
        ? "#2D6A4F"
        : "#9CA89F";

  const displaySlug = slug || "novo-post";
  const seoTitle = title || "Título do post";
  const seoDesc =
    metaDesc || "A meta descrição aparecerá aqui conforme você escreve.";

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin"
        className="mb-3.5 inline-flex items-center gap-1.5 font-inter text-[13.5px] font-semibold text-green-700 no-underline hover:text-green-900"
      >
        <ChevronLeftIcon />
        Voltar para Conteúdo
      </Link>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ============================================================
            MAIN COLUMN
            ============================================================ */}
        <div className="flex flex-col gap-[18px]">
          {/* Card 1 — Title + slug */}
          <div className="rounded-card-lg border border-border bg-surface p-6">
            <input
              value={title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Título do post..."
              aria-label="Título do post"
              className="w-full border-none bg-transparent font-lora text-[26px] font-bold tracking-[-0.01em] text-green-900 outline-none placeholder:text-muted-2"
            />
            <div className="mt-3 flex items-center gap-1 border-t border-[#F0EEE6] pt-3 text-[13px]">
              <span className="text-muted">guia-jardineiro.com.br/</span>
              {editingSlug ? (
                <input
                  autoFocus
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugManual(true);
                  }}
                  onBlur={() => setEditingSlug(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditingSlug(false);
                  }}
                  className="flex-1 rounded border border-border-3 bg-surface-2 px-1.5 py-0.5 font-semibold text-green-700 outline-none"
                />
              ) : (
                <button
                  onClick={() => setEditingSlug(true)}
                  title="Clique para editar o slug"
                  className="font-semibold text-green-700 hover:underline"
                >
                  {displaySlug}
                </button>
              )}
            </div>
          </div>

          {/* Card 2 — Body */}
          <div className="overflow-hidden rounded-card-lg border border-border bg-surface">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-[#EFEDE4] bg-surface-2 px-3 py-2">
              {toolbar.map((t) => (
                <button
                  key={t.title}
                  onClick={t.onClick}
                  title={t.title}
                  type="button"
                  className="inline-flex h-[34px] min-w-[34px] items-center justify-center rounded-lg px-2 text-[14px] font-bold text-body-2 transition-colors hover:bg-green-tint hover:text-green-900"
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div
              ref={bodyRef}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Comece a escrever seu artigo..."
              className="gj-editor min-h-[260px] px-6 py-5 text-[16px] leading-[1.75] text-body outline-none"
            />
          </div>

          {/* Card 3 — Conversion blocks */}
          <div className="rounded-card-lg border border-border bg-surface p-[22px]">
            <div className="mb-3.5 flex items-center justify-between">
              <div className="text-[15px] font-bold text-green-900">
                Blocos de conversão
              </div>
              <span className="text-[12px] text-muted-2">
                {blocks.length} bloco{blocks.length !== 1 && "s"} no artigo
              </span>
            </div>

            {blocks.length > 0 && (
              <div className="mb-3.5 flex flex-col gap-2.5">
                {blocks.map((b) => {
                  const meta = BLOCK_META[b.kind];
                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 rounded-card border border-border bg-surface-2 px-3.5 py-3"
                    >
                      <span
                        className="inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] text-[16px]"
                        style={{ background: meta.iconBg, color: meta.iconColor }}
                      >
                        {meta.glyph}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-muted-2">
                          {b.kind}
                        </div>
                        <div className="truncate text-[14px] font-semibold text-ink">
                          {b.label}
                        </div>
                      </div>
                      <button
                        onClick={() => removeBlock(b.id)}
                        aria-label="Remover bloco"
                        className="inline-flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg text-[#B0A99A] transition-colors hover:bg-callout-warning-bg hover:text-terracotta"
                      >
                        <XIcon />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => addBlock("Produto afiliado", "Novo produto recomendado")}
                className="rounded-[10px] border border-dashed border-[#C8A98F] bg-[#FBF6F1] px-3.5 py-2 font-inter text-[13px] font-semibold text-terracotta transition-colors hover:bg-[#FBEFE6]"
              >
                + Produto afiliado
              </button>
              <button
                onClick={() => addBlock("Tabela comparativa", "Tabela de comparação")}
                className="rounded-[10px] border border-dashed border-[#BBD0C0] bg-[#F4F9F4] px-3.5 py-2 font-inter text-[13px] font-semibold text-green-700 transition-colors hover:bg-[#EAF3EA]"
              >
                + Tabela comparativa
              </button>
              <button
                onClick={() => addBlock("Caixa de destaque", "Dica de especialista")}
                className="rounded-[10px] border border-dashed border-[#BBD0C0] bg-[#F4F9F4] px-3.5 py-2 font-inter text-[13px] font-semibold text-green-700 transition-colors hover:bg-[#EAF3EA]"
              >
                + Caixa de destaque
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            SIDEBAR
            ============================================================ */}
        <div className="flex flex-col gap-4">
          {/* Card 1 — Publication */}
          <div className="rounded-card border border-border bg-surface p-[18px]">
            <div className="mb-3 text-[14.5px] font-bold text-green-900">
              Publicação
            </div>

            {/* Segmented control */}
            <div className="mb-3 flex gap-[3px] rounded-[10px] bg-[#F1EFE7] p-[3px]">
              {(
                [
                  ["rascunho", "Rascunho"],
                  ["agendar", "Agendar"],
                  ["publicar", "Publicar"],
                ] as [PubState, string][]
              ).map(([id, label]) => {
                const active = pubState === id;
                return (
                  <button
                    key={id}
                    onClick={() => setPubState(id)}
                    className={[
                      "flex-1 rounded-lg px-1 py-2 font-inter text-[12.5px] font-semibold transition-all",
                      active
                        ? "bg-surface text-green-900 shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                        : "bg-transparent text-muted",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Schedule datetime */}
            {pubState === "agendar" && (
              <label className="mb-3 flex flex-col gap-1.5 text-[12px] font-semibold text-muted">
                Data de publicação
                <input
                  type="datetime-local"
                  className="rounded-[9px] border border-border-3 bg-surface px-2.5 py-2 font-inter text-[13px] text-ink outline-none focus:border-green-700/50"
                />
              </label>
            )}

            <div className="flex items-center justify-between border-t border-[#F0EEE6] py-2 text-[13px] text-[#4A5249]">
              <span>Visibilidade</span>
              <span className="font-semibold text-green-900">Pública</span>
            </div>

            <button
              onClick={publish}
              className="mt-2 w-full rounded-[11px] bg-terracotta py-3 font-inter text-[14.5px] font-semibold text-white transition-colors hover:bg-terracotta-hover"
            >
              {publishLabel}
            </button>
            <button
              onClick={saveDraft}
              className="mt-2 w-full rounded-[11px] border border-border-3 bg-transparent py-2.5 font-inter text-[13.5px] font-semibold text-[#3A5D45] transition-colors hover:bg-[#F4F1E8]"
            >
              Salvar rascunho
            </button>
          </div>

          {/* Card 2 — Organization */}
          <div className="flex flex-col gap-3.5 rounded-card border border-border bg-surface p-[18px]">
            <div className="text-[14.5px] font-bold text-green-900">
              Organização
            </div>

            <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-muted">
              Categoria
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-[9px] border border-border-3 bg-surface px-2.5 py-2.5 font-inter text-[13.5px] text-ink outline-none focus:border-green-700/50"
              >
                {categories.map((c) => (
                  <option key={c.id}>{c.label}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-muted">
              Autor
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="rounded-[9px] border border-border-3 bg-surface px-2.5 py-2.5 font-inter text-[13.5px] text-ink outline-none focus:border-green-700/50"
              >
                {authors.map((a) => (
                  <option key={a.id}>{a.name}</option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-1.5 text-[12px] font-semibold text-muted">
              Tags
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-pill bg-green-tint px-2.5 py-1 text-[12px] font-semibold text-green-700"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        aria-label={`Remover tag ${tag}`}
                        className="text-green-700/70 hover:text-green-900"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                placeholder="Digite e pressione Enter"
                className="rounded-[9px] border border-border-3 bg-surface px-2.5 py-2.5 font-inter text-[13.5px] font-normal text-ink outline-none focus:border-green-700/50"
              />
            </div>
          </div>

          {/* Card 3 — Featured image */}
          <div className="rounded-card border border-border bg-surface p-[18px]">
            <div className="mb-3 text-[14.5px] font-bold text-green-900">
              Imagem destacada
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className="group flex aspect-video w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-[12px] border-2 border-dashed border-border-3 bg-surface-2 text-muted-2 transition-colors hover:border-green-500 hover:text-green-700"
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Pré-visualização da imagem destacada"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <UploadIcon />
                  <span className="text-[12.5px] font-semibold">
                    Arraste ou clique
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Card 4 — SEO */}
          <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-[18px]">
            <div className="text-[14.5px] font-bold text-green-900">SEO</div>

            {/* Google preview */}
            <div className="rounded-[10px] border border-[#EFEDE4] bg-surface-2 px-3.5 py-3">
              <div className="text-[11px] text-[#1a73e8]">
                guia-jardineiro.com.br › {displaySlug}
              </div>
              <div className="my-0.5 text-[14px] font-semibold leading-[1.3] text-[#1a0dab]">
                {seoTitle}
              </div>
              <div className="text-[12px] leading-[1.4] text-muted">
                {seoDesc}
              </div>
            </div>

            <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-muted">
              Meta descrição
              <textarea
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                rows={3}
                placeholder="Resumo que aparece no Google..."
                className="resize-y rounded-[9px] border border-border-3 bg-surface px-2.5 py-2 font-inter text-[13px] font-normal text-ink outline-none focus:border-green-700/50"
              />
              <span
                className="self-end text-[11px] font-semibold"
                style={{ color: metaColor }}
              >
                {metaCount}/{META_LIMIT}
              </span>
            </label>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

export default PostEditor;

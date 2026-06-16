"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { categories, authors, getProductById } from "@/lib/mock-data";
import { slugify } from "@/lib/slug";
import { Toast } from "@/components/ui/Toast";
import { ProductPickerModal } from "@/components/admin/ProductPickerModal";
import type { Product } from "@/lib/types";
import {
  proseBlocks,
  conversionBlocks,
  type EditorBlock,
  type Frontmatter,
  type ProductRole,
  type ProductBlock,
  type ComparisonTableBlock,
  type AlertBoxBlock,
  type TextBlock,
  type RawMdxBlock,
} from "@/lib/mdx-serializer";
import {
  domToBlocks,
  proseBlocksToHtml,
} from "@/components/admin/editor-dom";

/* ------------------------------------------------------------------ */
/* Conversion block types                                              */
/* ------------------------------------------------------------------ */

type BlockKind = "Produto afiliado" | "Tabela comparativa" | "Caixa de destaque";

/** A conversion block in the editor: display metadata + its serializer form. */
interface ConvBlock {
  id: number;
  kind: BlockKind;
  label: string;
  serial: ProductBlock | ComparisonTableBlock | AlertBoxBlock;
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

const PUB_TO_STATUS: Record<PubState, "draft" | "scheduled" | "published"> = {
  rascunho: "draft",
  agendar: "scheduled",
  publicar: "published",
};

const META_LIMIT = 160;
let blockSeq = 0;

/* ------------------------------------------------------------------ */
/* Map a loaded conversion block → editor ConvBlock (with a label)     */
/* ------------------------------------------------------------------ */

function toConvBlock(
  serial: ProductBlock | ComparisonTableBlock | AlertBoxBlock
): ConvBlock {
  if (serial.type === "product") {
    const product = getProductById(serial.data.productId);
    return {
      id: ++blockSeq,
      kind: "Produto afiliado",
      label: product?.name ?? serial.data.productId,
      serial,
    };
  }
  if (serial.type === "comparison-table") {
    return {
      id: ++blockSeq,
      kind: "Tabela comparativa",
      label: serial.data.preset
        ? `Tabela comparativa (${serial.data.preset})`
        : "Tabela de comparação",
      serial,
    };
  }
  return {
    id: ++blockSeq,
    kind: "Caixa de destaque",
    label: serial.data.title || "Caixa de destaque",
    serial,
  };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function PostEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  /* ---- state ---- */
  // For an existing post, everything is populated by the API fetch below; the
  // initial values here are the "new post" defaults.
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(Boolean(editId));
  const [editingSlug, setEditingSlug] = useState(false);

  const [blocks, setBlocks] = useState<ConvBlock[]>([]);
  const [pubState, setPubState] = useState<PubState>("rascunho");
  const [scheduledDate, setScheduledDate] = useState("");

  const [category, setCategory] = useState(categories[0].label);
  const [author, setAuthor] = useState(authors[0].name);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metaDesc, setMetaDesc] = useState("");

  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  /** Frontmatter loaded from the file — preserved across save (type, excerpt, …). */
  const loadedFm = useRef<Frontmatter>({});
  const bodyRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ---- load existing post from the API (populates body + blocks) ---- */
  useEffect(() => {
    if (!editId) return;
    let cancelled = false;

    fetch(`/api/posts/${editId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: { frontmatter: Frontmatter; blocks: EditorBlock[] }) => {
        if (cancelled) return;
        const fm = data.frontmatter ?? {};
        loadedFm.current = fm;

        if (typeof fm.title === "string") setTitle(fm.title);
        if (typeof fm.slug === "string") {
          setSlug(fm.slug);
          setSlugManual(true);
        }
        if (typeof fm.categoryLabel === "string") setCategory(fm.categoryLabel);
        if (typeof fm.authorName === "string") setAuthor(fm.authorName);
        if (Array.isArray(fm.tags)) setTags(fm.tags as string[]);
        if (typeof fm.metaDesc === "string") setMetaDesc(fm.metaDesc);
        if (typeof fm.image === "string" && fm.image) setImagePreview(fm.image);
        if (fm.status === "agendado") setPubState("agendar");
        else if (fm.status === "rascunho") setPubState("rascunho");
        else if (fm.status === "publicado") setPubState("publicar");

        // Prose → contenteditable HTML; conversion blocks → the block list.
        const prose = proseBlocks(data.blocks);
        if (bodyRef.current) {
          bodyRef.current.innerHTML = proseBlocksToHtml(prose);
        }
        setBlocks(conversionBlocks(data.blocks).map(toConvBlock));
      })
      .catch(() => {
        if (!cancelled) setToast("Não foi possível carregar o post.");
      });

    return () => {
      cancelled = true;
    };
  }, [editId]);

  /* ---- title → slug sync (until user edits slug manually) ---- */
  function handleTitle(value: string) {
    setTitle(value);
    if (!slugManual) setSlug(slugify(value));
  }

  /* ---- revoke object URL on unmount ---- */
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
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
      label: "🖼",
      title: "Imagem",
      onClick: () => {
        const url = window.prompt("URL da imagem:");
        if (url) exec("insertImage", url);
      },
    },
  ];

  /* ---- conversion blocks ---- */
  function addProduct(product: Product, role: ProductRole) {
    setBlocks((prev) => [
      ...prev,
      toConvBlock({ type: "product", data: { productId: product.id, role } }),
    ]);
    setPickerOpen(false);
  }
  function addComparison() {
    setBlocks((prev) => [
      ...prev,
      toConvBlock({ type: "comparison-table", data: { preset: "tesouras" } }),
    ]);
  }
  function addAlert() {
    setBlocks((prev) => [
      ...prev,
      toConvBlock({
        type: "alert-box",
        data: {
          variant: "dica",
          title: "Dica de especialista",
          content: "Escreva a dica aqui.",
        },
      }),
    ]);
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
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  /* ---- save (POST /api/posts) ---- */
  async function save(state: PubState) {
    if (saving) return;
    if (!title.trim()) {
      setToast("Adicione um título antes de salvar.");
      return;
    }

    setSaving(true);
    try {
      // Upload the featured image first, if a new one was chosen.
      let imageUrl =
        typeof loadedFm.current.image === "string"
          ? (loadedFm.current.image as string)
          : undefined;
      if (imageFile) {
        const form = new FormData();
        form.append("file", imageFile);
        const up = await fetch("/api/upload", { method: "POST", body: form });
        if (up.ok) {
          imageUrl = (await up.json()).url;
        } else if (up.status !== 501) {
          setToast("Falha ao enviar a imagem; salvando sem ela.");
        }
      }

      // Assemble the ordered body: prose (from the editor) then conversion blocks.
      const prose: (TextBlock | RawMdxBlock)[] = bodyRef.current
        ? domToBlocks(bodyRef.current)
        : [];
      const allBlocks: EditorBlock[] = [...prose, ...blocks.map((b) => b.serial)];

      const frontmatter: Frontmatter = {
        ...loadedFm.current,
        title: title.trim(),
        slug: slug || slugify(title),
        shortTitle: loadedFm.current.shortTitle ?? title.trim(),
        excerpt: loadedFm.current.excerpt ?? metaDesc,
        categoryLabel: category,
        authorName: author,
        tags,
        metaDesc,
        ...(imageUrl ? { image: imageUrl } : {}),
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frontmatter,
          blocks: allBlocks,
          status: PUB_TO_STATUS[state],
          scheduledDate: state === "agendar" ? scheduledDate : undefined,
          overwrite: Boolean(editId),
        }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        setToast(error || "Falha ao salvar o post.");
        setSaving(false);
        return;
      }

      setToast(
        state === "agendar"
          ? "Post agendado com sucesso!"
          : state === "rascunho"
            ? "Rascunho salvo."
            : "Post publicado com sucesso!"
      );
      setTimeout(() => router.push("/admin"), 1200);
    } catch {
      setToast("Erro de rede ao salvar.");
      setSaving(false);
    }
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
                onClick={() => setPickerOpen(true)}
                className="rounded-[10px] border border-dashed border-[#C8A98F] bg-[#FBF6F1] px-3.5 py-2 font-inter text-[13px] font-semibold text-terracotta transition-colors hover:bg-[#FBEFE6]"
              >
                + Produto afiliado
              </button>
              <button
                onClick={addComparison}
                className="rounded-[10px] border border-dashed border-[#BBD0C0] bg-[#F4F9F4] px-3.5 py-2 font-inter text-[13px] font-semibold text-green-700 transition-colors hover:bg-[#EAF3EA]"
              >
                + Tabela comparativa
              </button>
              <button
                onClick={addAlert}
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
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="rounded-[9px] border border-border-3 bg-surface px-2.5 py-2 font-inter text-[13px] text-ink outline-none focus:border-green-700/50"
                />
              </label>
            )}

            <div className="flex items-center justify-between border-t border-[#F0EEE6] py-2 text-[13px] text-[#4A5249]">
              <span>Visibilidade</span>
              <span className="font-semibold text-green-900">Pública</span>
            </div>

            <button
              onClick={() => save(pubState)}
              disabled={saving}
              className="mt-2 w-full rounded-[11px] bg-terracotta py-3 font-inter text-[14.5px] font-semibold text-white transition-colors hover:bg-terracotta-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Salvando..." : publishLabel}
            </button>
            <button
              onClick={() => save("rascunho")}
              disabled={saving}
              className="mt-2 w-full rounded-[11px] border border-border-3 bg-transparent py-2.5 font-inter text-[13.5px] font-semibold text-[#3A5D45] transition-colors hover:bg-[#F4F1E8] disabled:cursor-not-allowed disabled:opacity-60"
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

      <ProductPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={addProduct}
      />

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

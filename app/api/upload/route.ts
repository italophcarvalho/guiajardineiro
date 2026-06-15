import { NextResponse } from "next/server";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/upload
 * Multipart form with a single `file` field. Uploads the image to Vercel Blob
 * and returns its public URL (used by the editor's featured-image dropzone).
 *
 * Requires BLOB_READ_WRITE_TOKEN (set automatically on Vercel once a Blob
 * store is connected). Without it, returns 501 so the editor can degrade
 * gracefully in local dev.
 */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Upload de imagens indisponível: configure BLOB_READ_WRITE_TOKEN (Vercel Blob).",
      },
      { status: 501 }
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const value = form.get("file");
    if (value instanceof File) file = value;
  } catch {
    return NextResponse.json({ error: "Formulário inválido." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Apenas arquivos de imagem são aceitos." },
      { status: 400 }
    );
  }

  try {
    const { put } = await import("@vercel/blob");
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagem";
    const key = `posts/${Date.now()}-${base}.${ext}`;

    const blob = await put(key, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[/api/upload] blob upload failed:", err);
    return NextResponse.json(
      { error: "Falha ao enviar a imagem." },
      { status: 500 }
    );
  }
}

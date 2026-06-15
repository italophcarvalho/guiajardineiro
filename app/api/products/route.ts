import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import type { Product } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCTS_FILE = path.join(process.cwd(), "content", "products", "products.json");

/**
 * GET /api/products
 * Returns the affiliate product catalog (used by the editor's product picker).
 */
export function GET() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      return NextResponse.json({ products: [] });
    }
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf8");
    const products = JSON.parse(raw) as Product[];
    return NextResponse.json({ products });
  } catch (err) {
    console.error("[/api/products] failed to read catalog:", err);
    return NextResponse.json(
      { error: "Não foi possível carregar o catálogo de produtos." },
      { status: 500 }
    );
  }
}

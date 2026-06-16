import { NextResponse, type NextRequest } from "next/server";

/**
 * Protege o painel admin e as rotas de escrita com HTTP Basic Auth.
 *
 * Credenciais vêm das variáveis de ambiente ADMIN_USER e ADMIN_PASSWORD.
 * - Se NÃO estiverem definidas (ex.: ambiente local), o acesso é liberado,
 *   para não atrapalhar o desenvolvimento.
 * - Em produção, defina as duas no Vercel para travar o /admin.
 *
 * O navegador, depois do primeiro login, reenvia as credenciais
 * automaticamente em todas as chamadas à mesma origem — então o editor
 * (fetch para /api/posts, /api/upload) continua funcionando sem ajustes.
 */

export const config = {
  matcher: ["/admin/:path*", "/api/posts", "/api/posts/:path*", "/api/upload"],
};

function unauthorized() {
  return new NextResponse("Autenticação necessária.", {
    status: 401,
    headers: {
      "WWW-Authenticate":
        'Basic realm="Guia Jardineiro — Admin", charset="UTF-8"',
    },
  });
}

export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  // Sem credenciais configuradas → não protege (conveniência em dev).
  if (!user || !password) return NextResponse.next();

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const decoded = atob(header.slice(6));
    const sep = decoded.indexOf(":");
    const u = decoded.slice(0, sep);
    const p = decoded.slice(sep + 1);
    if (u === user && p === password) return NextResponse.next();
  }

  return unauthorized();
}

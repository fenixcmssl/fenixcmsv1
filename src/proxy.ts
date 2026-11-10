import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const rawHostname = req.headers.get("host") || "";
  
  const hostname = rawHostname.includes("localhost") ? "fenixcms.es" : rawHostname;
  const mainDomain = "fenixcms.es";

  // CASO 1: Portada principal exacta (Landing Page pública)
  if (hostname === mainDomain && url.pathname === "/") {
    return NextResponse.next();
  }

  // CASO 2: Superadmin y Tiendas (Reescribe internamente pasando la ruta Y los parámetros de búsqueda)
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}${url.search}`, req.url));
}

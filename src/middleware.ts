import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const rawHostname = req.headers.get("host") || "";
  
  // Estandarizar localhost para pruebas locales
  const hostname = rawHostname.includes("localhost") ? "fenixcms.es" : rawHostname;
  const mainDomain = "fenixcms.es";

  // CASO 1: Si es la portada principal exacta (Landing Page)
  if (hostname === mainDomain && url.pathname === "/") {
    return NextResponse.next();
  }

  // CASO 2: Todo lo demás (Panel Superadmin y tiendas de los inquilinos)
  // Se reescribe internamente a la carpeta /[domain]/...
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, req.url));
}

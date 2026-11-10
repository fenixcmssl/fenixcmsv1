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
  
  const hostname = rawHostname.includes("localhost") ? "fenixcms.es" : rawHostname;
  const mainDomain = "fenixcms.es";

  // CASO 1: Portada principal exacta (Landing Page)
  if (hostname === mainDomain && url.pathname === "/") {
    return NextResponse.next();
  }

  // CASO 2: Panel Superadmin y tiendas de clientes
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, req.url));
}

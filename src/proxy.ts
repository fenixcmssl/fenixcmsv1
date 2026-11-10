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

  // CASO 2: Si la ruta empieza por /superadmin, permitimos el acceso directo al panel maestro
  if (url.pathname.startsWith("/superadmin")) {
    return NextResponse.next();
  }

  // CASO 3: Tiendas de los clientes (Multi-tenant)
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}${url.search}`, req.url));
}

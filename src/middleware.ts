import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Intercepta todas las rutas excepto:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico (icono)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // 1. Definir el dominio principal de la plataforma
  const mainDomain = "fenixcms.es";

  // 2. Si la petición es para el dominio principal (Landing Page o Superadmin)
  if (hostname === mainDomain || hostname.endsWith(`.${mainDomain}`) || hostname === "localhost:3000") {
    // Permitir el acceso directo a rutas /superadmin
    if (url.pathname.startsWith("/superadmin")) {
      return NextResponse.next();
    }
    // Para el resto (la Landing Page pública), permitir acceso directo a la raíz
    return NextResponse.next();
  }

  // 3. Lógica Multi-Tenant: Si es un dominio de cliente (ej. mitienda.com)
  // Reescribimos la URL internamente para que Next.js la maneje bajo /[domain]
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, req.url));
}

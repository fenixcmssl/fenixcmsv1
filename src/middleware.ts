import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Ignorar rutas internas de Next.js y archivos estaticos para optimizar rendimiento
     */
    "/((?!api/|_next/|_static/|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "localhost:3000";

  // Extraemos el host base limpiando el puerto para pruebas locales (ej: tenant1.localhost:3000 -> tenant1.localhost)
  const currentHost = hostname.split(':')[0];

  // Reescribimos la URL para que Next.js la procese internamente dentro de src/app/[domain]/
  url.pathname = `/${currentHost}${url.pathname}`;
  
  return NextResponse.rewrite(url);
}

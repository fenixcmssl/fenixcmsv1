import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Evitar interferir con archivos estáticos, imágenes y rutas internas del sistema
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') || 
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Identificar si el tráfico va al dominio maestro o a una tienda de un cliente
  const isMainDomain = 
    hostname === 'fenixcms.es' || 
    hostname === 'www.fenixcms.es' || 
    hostname.startsWith('localhost:');

  // 3. Si NO es el dominio maestro, es el subdominio de un cliente (ej: john4095.fenixcms.es)
  if (!isMainDomain) {
    // Reescribir internamente la ruta apuntando a la carpeta dinámica /[domain]/...
    return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}${url.search}`, req.url));
  }

  // 4. Si es el dominio maestro, dejar pasar normalmente a la landing page o superadmin
  return NextResponse.next();
}

// Configurar sobre qué rutas se ejecuta este middleware
export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

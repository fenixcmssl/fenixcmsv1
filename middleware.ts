import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Evitar interferir con archivos estáticos e internos
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') || 
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Identificar si el tráfico va al dominio maestro o a una tienda
  const isMainDomain = 
    hostname === 'fenixcms.es' || 
    hostname === 'www.fenixcms.es' || 
    hostname.startsWith('localhost:');

  // 3. Enrutamiento dinámico Multi-Tenant
  if (!isMainDomain) {
    return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}${url.search}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Evitar interferir con estáticos
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') || 
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Identificar el tráfico
  const isMainDomain = 
    hostname === 'fenixcms.es' || 
    hostname === 'www.fenixcms.es' || 
    hostname.startsWith('localhost:');

  // 3. Enrutamiento multi-tenant
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

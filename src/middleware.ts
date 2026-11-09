import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Obtenemos el dominio actual (ej. localhost o mitienda.com)
  let hostname = req.headers.get('host') || '';
  // Limpiamos el puerto en entornos de desarrollo local (ej. de localhost:3000 a localhost)
  hostname = hostname.split(':')[0]; 
  
  // Reconstruimos la ruta exacta solicitada junto con sus parametros (ej. ?tab=dashboard)
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // ==========================================
  // 1. BARRERA DE SEGURIDAD PARA SUPERADMIN
  // ==========================================
  if (url.pathname.startsWith('/superadmin') && !url.pathname.startsWith('/superadmin/login')) {
    const isAuth = req.cookies.has('superadmin_auth');
    if (!isAuth) {
      // Si no tiene sesion, lo pateamos a la pantalla de login
      return NextResponse.redirect(new URL('/superadmin/login', req.url));
    }
  }

  // ==========================================
  // 2. MOTOR DE REESCRITURA MULTI-TENANT
  // ==========================================
  // Reescribe la URL para que Next.js entre a la carpeta src/app/[domain]/...
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}

// Bloqueamos la ejecucion del middleware en assets estaticos e imagenes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
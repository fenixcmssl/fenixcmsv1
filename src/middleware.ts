import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // Si la ruta contiene "/superadmin" pero NO es la página de login
  if (path.includes('/superadmin') && !path.includes('/superadmin/login')) {
    
    // Verificamos si existe la cookie de autenticación que creamos en el paso anterior
    const isAuth = req.cookies.has('superadmin_auth');
    
    if (!isAuth) {
      // Si no tiene la cookie, calculamos la ruta base (por si el dominio está en la URL)
      const basePath = path.split('/superadmin')[0]; 
      // Y lo redirigimos obligatoriamente al login
      return NextResponse.redirect(new URL(`${basePath}/superadmin/login`, req.url));
    }
  }

  // Si todo está correcto o es otra ruta pública de tiendas, dejamos pasar la petición
  return NextResponse.next();
}

// Configuramos el middleware para que no bloquee archivos estáticos, imágenes ni APIs
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
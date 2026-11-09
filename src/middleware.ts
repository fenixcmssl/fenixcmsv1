import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  
  // 1. IGNORAR ARCHIVOS ESTÁTICOS Y DE SISTEMA (Vital para evitar bucles)
  if (
    path.startsWith("/_next") || 
    path.startsWith("/api") || 
    path.includes(".") || 
    path === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  let hostname = req.headers.get("host") || "";
  hostname = hostname.split(":")[0]; 
  const searchParams = req.nextUrl.searchParams.toString();
  const fullPath = `${path}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  console.log(`\n[ESCANEO] ➡️ Peticion entrante: ${fullPath} | Host: ${hostname}`);

  // 2. SEGURIDAD DEL SUPERADMIN
  if (path.startsWith("/superadmin")) {
    const isAuth = req.cookies.has("superadmin_auth");
    console.log(`[ESCANEO] 🛡️ Ruta Superadmin detectada. Autenticado: ${isAuth}`);

    if (!isAuth && !path.startsWith("/superadmin/login")) {
      console.log(`[ESCANEO] ⛔ Bloqueado. Redirigiendo a Login...`);
      return NextResponse.redirect(new URL("/superadmin/login", req.url));
    }
  }

  // 3. REESCRITURA MULTI-TENANT
  // Comprobamos si la ruta YA tiene el hostname para evitar reescribir dos veces
  if (!path.startsWith(`/${hostname}`)) {
    console.log(`[ESCANEO] 🔄 Reescribiendo a: /${hostname}${fullPath}`);
    return NextResponse.rewrite(new URL(`/${hostname}${fullPath}`, req.url));
  }

  console.log(`[ESCANEO] ✅ Dejando pasar sin reescribir.`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
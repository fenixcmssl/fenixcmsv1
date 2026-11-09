import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// AQUI ESTA LA CORRECCION CLAVE: export function proxy
export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  
  // 1. IGNORAR ARCHIVOS ESTÁTICOS Y DE SISTEMA
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

  console.log(`\n[PROXY] ➡️ Peticion entrante: ${fullPath} | Host: ${hostname}`);

  // 2. SEGURIDAD DEL SUPERADMIN
  if (path.startsWith("/superadmin")) {
    const isAuth = req.cookies.has("superadmin_auth");
    console.log(`[PROXY] 🛡️ Ruta Superadmin. Autenticado: ${isAuth}`);

    if (!isAuth && !path.startsWith("/superadmin/login")) {
      console.log(`[PROXY] ⛔ Bloqueado. Redirigiendo a Login...`);
      return NextResponse.redirect(new URL("/superadmin/login", req.url));
    }
  }

  // 3. REESCRITURA MULTI-TENANT
  if (!path.startsWith(`/${hostname}`)) {
    console.log(`[PROXY] 🔄 Reescribiendo a: /${hostname}${fullPath}`);
    return NextResponse.rewrite(new URL(`/${hostname}${fullPath}`, req.url));
  }

  console.log(`[PROXY] ✅ Dejando pasar sin reescribir.`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
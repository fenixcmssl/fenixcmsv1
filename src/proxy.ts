import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "localhost:3000";

  // Extraer el host base sin puerto (ej: localhost:3000 -> localhost)
  const currentHost = hostname.split(":")[0];

  // Reescribir internamente hacia src/app/[domain]/
  url.pathname = `/${currentHost}${url.pathname}`;
  
  return NextResponse.rewrite(url);
}
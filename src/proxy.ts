/**
 * FenixCMS SaaS — Proxy de Enrutamiento y Aislamiento de Zonas (Next.js 16.4.5)
 */

import { NextRequest, NextResponse } from "next/server";
import { resolveDomain } from "./core/tenancy/domain-resolver";

export const config = {
  matcher: [
    "/((?!_next/static/|_next/image(?:/|$)|favicon\\.ico$).*)",
  ],
};

const REJECTION_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Vary: "Host",
} as const;

export function proxy(request: NextRequest): NextResponse {
  const internalHeaders = new Headers(request.headers);
  for (const key of Array.from(internalHeaders.keys())) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.startsWith("x-fenix-") || lowerKey === "x-tenant-id") {
      internalHeaders.delete(key);
    }
  }

  const rawHost = request.headers.get("host") ?? "";
  const pathname = request.nextUrl.pathname;
  const resolved = resolveDomain(rawHost, pathname);

  if (resolved.verificationState === "invalid_host") {
    return NextResponse.json(
      { error: "Bad Request", message: "Host inválido, reservado o no permitido." },
      { status: 400, headers: REJECTION_CACHE_HEADERS }
    );
  }

  if (resolved.verificationState === "forbidden_route_for_host") {
    return NextResponse.json(
      { error: "Not Found", message: "Ruta no disponible en este dominio." },
      { status: 404, headers: REJECTION_CACHE_HEADERS }
    );
  }

  if (resolved.verificationState === "unverified_tenant_subdomain") {
    return NextResponse.json(
      {
        error: "Service Unavailable",
        message: "Tenant no verificado: la resolución en base de datos aún no está activa.",
      },
      { status: 503, headers: REJECTION_CACHE_HEADERS }
    );
  }

  if (
    resolved.verificationState === "unverified_custom_domain" ||
    resolved.routeZone === null ||
    resolved.zone === null
  ) {
    return NextResponse.json(
      {
        error: "Not Found",
        message: "Dominio personalizado no registrado ni verificado.",
      },
      { status: 404, headers: REJECTION_CACHE_HEADERS }
    );
  }

  internalHeaders.set("x-fenix-zone", resolved.routeZone);
  internalHeaders.set("x-fenix-business-zone", resolved.zone);
  internalHeaders.set("x-fenix-is-saas", resolved.isSaasDomain ? "1" : "0");
  internalHeaders.set("x-fenix-classified", "1");

  const response = NextResponse.next({
    request: {
      headers: internalHeaders,
    },
  });

  response.headers.set("Vary", "Host, Cookie");
  if (
    resolved.routeZone === "saas_superadmin" ||
    resolved.routeZone === "saas_login"
  ) {
    response.headers.set(
      "Cache-Control",
      "private, no-store, no-cache, must-revalidate"
    );
  }

  return response;
}

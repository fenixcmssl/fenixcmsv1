/**
 * FenixCMS SaaS — Lectura Validada del Contexto Multi-Tenant (FASE 1.1 v17)
 */

import type { ProxyContext, RouteZone, ZoneType } from "../../types/core.types";

export const VALID_SAAS_ROUTE_ZONES: readonly RouteZone[] = [
  "saas_superadmin",
  "saas_login",
  "saas_public",
];

export function isValidSaasRouteZone(value: string | null): value is "saas_superadmin" | "saas_login" | "saas_public" {
  if (value === null) return false;
  for (const allowed of VALID_SAAS_ROUTE_ZONES) {
    if (value === allowed) return true;
  }
  return false;
}

function mapRouteZoneToBusinessZone(routeZone: "saas_superadmin" | "saas_login" | "saas_public"): ZoneType {
  return routeZone === "saas_superadmin" ? "superadmin" : "saas_customer";
}

export function getProxyContext(requestHeaders: Pick<Headers, "get">): ProxyContext {
  const rawRouteZone = requestHeaders.get("x-fenix-zone");
  const rawClassified = requestHeaders.get("x-fenix-classified");
  const rawIsSaas = requestHeaders.get("x-fenix-is-saas");

  if (!isValidSaasRouteZone(rawRouteZone) || rawClassified !== "1" || rawIsSaas !== "1") {
    return {
      classified: false, zone: "saas_customer", routeZone: "saas_public",
      isSaasDomain: false, tenantId: null, tenantSubdomain: null, customDomain: null,
    };
  }

  return {
    classified: true, zone: mapRouteZoneToBusinessZone(rawRouteZone), routeZone: rawRouteZone as RouteZone,
    isSaasDomain: true, tenantId: null, tenantSubdomain: null, customDomain: null,
  };
}

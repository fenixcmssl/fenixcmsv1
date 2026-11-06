/**
 * FenixCMS SaaS — Resolución y Validación de Dominios (FASE 1.1 v17)
 */

import { SAAS_CONFIG } from "../config/saas.config";
import { ROUTES, matchesRoutePrefix } from "../config/routes.config";
import type { ResolvedDomain, RouteZone, ZoneType } from "../../types/core.types";

const labelRegex = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

function isDevelopmentRuntime(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isValidDomainLabel(label: string): boolean {
  if (!label || typeof label !== "string") return false;
  return labelRegex.test(label);
}

export function normalizeHostname(rawHost: string): string | null {
  if (!rawHost || typeof rawHost !== "string") return null;
  if (rawHost.trim() !== rawHost) return null;

  const lower = rawHost.toLowerCase();
  let hostname = lower;
  let portStr: string | null = null;

  const colonIdx = lower.lastIndexOf(":");
  if (colonIdx !== -1) {
    const after = lower.slice(colonIdx + 1);
    if (/^\d+$/.test(after)) {
      hostname = lower.slice(0, colonIdx);
      portStr = after;
    } else {
      return null;
    }
  }

  if (hostname.includes(":")) return null;

  if (portStr !== null) {
    const port = Number(portStr);
    if (!Number.isInteger(port) || port < 1 || port > 65535) return null;
    if (portStr !== String(port)) return null;
  }

  if (SAAS_CONFIG.localDevHosts.has(hostname)) {
    return isDevelopmentRuntime() ? hostname : null;
  }

  if (hostname.length === 0 || hostname.length > 253) return null;

  const labels = hostname.split(".");
  if (labels.length < 2) return null;
  if (!labels.every((label) => labelRegex.test(label))) return null;

  const tld = labels[labels.length - 1];
  if (/^\d+$/.test(tld)) return null;

  return hostname;
}

export function isValidHostname(rawHost: string): boolean {
  return normalizeHostname(rawHost) !== null;
}

export function resolveDomain(rawHost: string, pathname: string): ResolvedDomain {
  const hostname = normalizeHostname(rawHost);

  if (!hostname) {
    return {
      verificationState: "invalid_host", zone: null, routeZone: null, candidateRouteZone: null,
      isSaasDomain: false, normalizedHost: null, tenantSubdomain: null, customDomain: null,
    };
  }

  const primary = SAAS_CONFIG.primaryDomain;
  const isLocalDevHost = isDevelopmentRuntime() && SAAS_CONFIG.localDevHosts.has(hostname);

  if (hostname === primary || hostname === `www.${primary}` || isLocalDevHost) {
    if (matchesRoutePrefix(pathname, ROUTES.admin)) {
      return {
        verificationState: "forbidden_route_for_host", zone: null, routeZone: null, candidateRouteZone: null,
        isSaasDomain: true, normalizedHost: hostname, tenantSubdomain: null, customDomain: null,
      };
    }

    let zone: ZoneType = "saas_customer";
    let routeZone: RouteZone = "saas_public";

    if (matchesRoutePrefix(pathname, ROUTES.superadmin)) {
      zone = "superadmin";
      routeZone = "saas_superadmin";
    } else if (matchesRoutePrefix(pathname, ROUTES.login)) {
      zone = "saas_customer";
      routeZone = "saas_login";
    }

    return {
      verificationState: "verified_saas", zone, routeZone, candidateRouteZone: routeZone,
      isSaasDomain: true, normalizedHost: hostname, tenantSubdomain: null, customDomain: null,
    };
  }

  if (hostname.endsWith(`.${primary}`)) {
    const sub = hostname.slice(0, hostname.length - primary.length - 1);

    if (!sub || sub.includes(".") || !labelRegex.test(sub) || SAAS_CONFIG.reservedSubdomains.has(sub)) {
      return {
        verificationState: "invalid_host", zone: null, routeZone: null, candidateRouteZone: null,
        isSaasDomain: false, normalizedHost: hostname, tenantSubdomain: null, customDomain: null,
      };
    }

    if (matchesRoutePrefix(pathname, ROUTES.superadmin)) {
      return {
        verificationState: "forbidden_route_for_host", zone: null, routeZone: null, candidateRouteZone: null,
        isSaasDomain: false, normalizedHost: hostname, tenantSubdomain: sub, customDomain: null,
      };
    }

    let candidateRouteZone: RouteZone = "tenant_storefront";
    if (matchesRoutePrefix(pathname, ROUTES.admin)) {
      candidateRouteZone = "tenant_admin";
    } else if (matchesRoutePrefix(pathname, ROUTES.login)) {
      candidateRouteZone = "tenant_login";
    }

    return {
      verificationState: "unverified_tenant_subdomain", zone: null, routeZone: null, candidateRouteZone,
      isSaasDomain: false, normalizedHost: hostname, tenantSubdomain: sub, customDomain: null,
    };
  }

  if (matchesRoutePrefix(pathname, ROUTES.superadmin)) {
    return {
      verificationState: "forbidden_route_for_host", zone: null, routeZone: null, candidateRouteZone: null,
      isSaasDomain: false, normalizedHost: hostname, tenantSubdomain: null, customDomain: hostname,
    };
  }

  let candidateRouteZone: RouteZone = "tenant_storefront";
  if (matchesRoutePrefix(pathname, ROUTES.admin)) {
    candidateRouteZone = "tenant_admin";
  } else if (matchesRoutePrefix(pathname, ROUTES.login)) {
    candidateRouteZone = "tenant_login";
  }

  return {
    verificationState: "unverified_custom_domain", zone: null, routeZone: null, candidateRouteZone,
    isSaasDomain: false, normalizedHost: hostname, tenantSubdomain: null, customDomain: hostname,
  };
}

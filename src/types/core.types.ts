/**
 * FenixCMS SaaS — Contratos Canónicos del Núcleo Multi-Tenant (FASE 1.1 v17)
 */

export type ZoneType =
  | "superadmin"
  | "saas_customer"
  | "tenant_admin"
  | "tenant_storefront";

export type RouteZone =
  | "saas_superadmin"
  | "saas_login"
  | "saas_public"
  | "tenant_admin"
  | "tenant_login"
  | "tenant_storefront";

export type LoginContext = "saas_customer" | "tenant_customer";

export type DomainVerificationState =
  | "verified_saas"
  | "verified_tenant"
  | "unverified_tenant_subdomain"
  | "unverified_custom_domain"
  | "forbidden_route_for_host"
  | "invalid_host";

export interface ResolvedDomain {
  verificationState: DomainVerificationState;
  zone: ZoneType | null;
  routeZone: RouteZone | null;
  candidateRouteZone: RouteZone | null;
  isSaasDomain: boolean;
  normalizedHost: string | null;
  tenantSubdomain: string | null;
  customDomain: string | null;
}

export interface ProxyContext {
  classified: boolean;
  zone: ZoneType;
  routeZone: RouteZone;
  isSaasDomain: boolean;
  tenantId: string | null;
  tenantSubdomain: string | null;
  customDomain: string | null;
}

/**
 * FenixCMS SaaS — Contratos Globales de Tipos
 */

export type {
  ZoneType,
  RouteZone,
  LoginContext,
  DomainVerificationState,
  ResolvedDomain,
  ProxyContext,
} from "./core.types";

export type AppRole =
  | "superadmin"
  | "saas_customer"
  | "tenant_admin"
  | "tenant_staff"
  | "tenant_customer";

export type TenantStatus =
  | "active"
  | "suspended"
  | "pending_setup"
  | "cancelled";

export type PlanTier = "starter" | "pro" | "enterprise";

export type BillingCycle = "monthly" | "quarterly" | "semiannual" | "annual";

export interface TenantDomain {
  domain: string;
  isPrimary: boolean;
  isVerified: boolean;
  sslActive: boolean;
}

export interface TenantContext {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  customDomain?: string | null;
  domains?: TenantDomain[];
  status: TenantStatus;
  planTier: PlanTier;
  activeModules: BusinessModuleId[];
  activeThemeId: string;
  defaultLocale: SupportedLocale;
  supportedLocales: SupportedLocale[];
}

export type KnownBusinessModuleId =
  | "ecommerce"
  | "blog"
  | "real-estate"
  | "auctions"
  | "classifieds"
  | "personal-ads";

export type BusinessModuleId = KnownBusinessModuleId | (string & {});

export interface ModuleManifest {
  id: BusinessModuleId;
  name: string;
  version: string;
  description: string;
  isCore?: boolean;
  requiredPlan?: PlanTier;
  dependencies?: BusinessModuleId[];
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  compatibleModules?: BusinessModuleId[];
  permissions?: string[];
}

export type SupportedLocale = "es" | "en" | "fr" | "it" | "pt" | "de" | "ht";

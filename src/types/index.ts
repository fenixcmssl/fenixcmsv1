/**
 * FenixCMS SaaS — Definiciones de Tipos Base del Sistema
 */

// ============================================================================
// 1. ZONAS DEL SISTEMA
// ============================================================================

export type ZoneType =
  | "superadmin"         // Zona 1: Superadministración global (negro y rojo)
  | "saas_customer"      // Zona 2: Portal de clientes SaaS (licencias, pagos)
  | "tenant_admin"       // Zona 3: Administración privada del tenant (/admin)
  | "tenant_storefront"; // Zona 4: Dominio público / escaparate del tenant

// Contexto de enrutamiento detectado para la ruta universal /login
export type LoginContext = "saas_customer" | "tenant_customer";

// ============================================================================
// 2. ROLES Y PERMISOS
// ============================================================================

export type AppRole =
  | "superadmin"         // Superadministrador global
  | "saas_customer"      // Cliente titular de suscripción FenixCMS
  | "tenant_admin"       // Dueño / Administrador de tienda o tenant
  | "tenant_staff"       // Empleado con permisos delegados en un tenant
  | "tenant_customer";   // Comprador final registrado en una tienda

// ============================================================================
// 3. TENANCY Y DOMINIOS
// ============================================================================

export type TenantStatus = "active" | "suspended" | "pending_setup" | "cancelled";

export type PlanTier = "starter" | "pro" | "enterprise";

export type BillingCycle = "monthly" | "quarterly" | "semiannual" | "annual";

export interface TenantDomain {
  id: string;
  tenantId: string;
  domain: string;
  isPrimary: boolean;
  isVerified: boolean;
  sslActive: boolean;
  createdAt: Date;
}

export interface TenantContext {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  customDomain?: string | null;
  status: TenantStatus;
  planTier: PlanTier;
  activeModules: BusinessModuleId[];
  activeThemeId: string;
  defaultLocale: SupportedLocale;
  enabledLocales: SupportedLocale[];
}

// ============================================================================
// 4. MÓDULOS DE NEGOCIO Y PLUGINS
// ============================================================================

export type BusinessModuleId =
  | "ecommerce"
  | "blog"
  | "real-estate"
  | "auctions"
  | "classifieds"
  | "personal-ads"
  | string; // Permite extensibilidad para módulos futuros

export interface ModuleManifest {
  id: BusinessModuleId;
  name: string;
  version: string;
  description: string;
  requiredPlanTier?: PlanTier;
  dependencies?: BusinessModuleId[];
  navigationItems?: {
    label: string;
    href: string;
    icon: string;
  }[];
  permissions: string[];
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  permissions: string[];
  isGlobalOnly?: boolean;
}

// ============================================================================
// 5. IDIOMAS SOPORTADOS
// ============================================================================

export type SupportedLocale =
  | "es" // Español
  | "en" // Inglés
  | "fr" // Francés
  | "it" // Italiano
  | "pt" // Portugués
  | "de" // Alemán
  | "ht"; // Criollo haitiano

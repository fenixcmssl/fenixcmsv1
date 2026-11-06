/**
 * FenixCMS SaaS — Configuración Centralizada del Servidor (FASE 1.1 v17)
 */

const DEFAULT_PRIMARY_DOMAIN = "fenixcms.es";

export const DOMAIN_LABEL_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export const LOCAL_DEV_HOSTS: ReadonlySet<string> = new Set<string>([
  "localhost",
  "127.0.0.1",
]);

export const RESERVED_SUBDOMAINS: ReadonlySet<string> = new Set<string>([
  "www", "api", "app", "admin", "superadmin", "mail", "static", "cdn",
  "assets", "auth", "billing", "status", "support", "staging", "dev", "test"
]);

export function validatePrimaryDomain(rawDomain: string | undefined): string {
  if (rawDomain === undefined || rawDomain === "") {
    return DEFAULT_PRIMARY_DOMAIN;
  }
  if (typeof rawDomain !== "string" || rawDomain.trim() !== rawDomain) {
    throw new Error(`Configuración inválida en SAAS_PRIMARY_DOMAIN: "${String(rawDomain)}" contiene espacios o formato no válido.`);
  }
  const normalized = rawDomain.toLowerCase();
  if (normalized.includes(":") || normalized.includes("/") || normalized.length > 253 || LOCAL_DEV_HOSTS.has(normalized)) {
    throw new Error(`Configuración inválida en SAAS_PRIMARY_DOMAIN: "${rawDomain}" debe ser un dominio registrable sin puerto ni protocolo.`);
  }
  const labels = normalized.split(".");
  if (labels.length < 2 || !labels.every((label) => DOMAIN_LABEL_REGEX.test(label)) || /^\d+$/.test(labels[labels.length - 1])) {
    throw new Error(`Configuración inválida en SAAS_PRIMARY_DOMAIN: "${rawDomain}" no cumple RFC 1123.`);
  }
  return normalized;
}

export const SAAS_CONFIG = {
  primaryDomain: validatePrimaryDomain(process.env.SAAS_PRIMARY_DOMAIN),
  reservedSubdomains: RESERVED_SUBDOMAINS,
  localDevHosts: LOCAL_DEV_HOSTS,
} as const;

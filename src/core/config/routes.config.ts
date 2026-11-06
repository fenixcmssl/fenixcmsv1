/**
 * FenixCMS SaaS — Configuración de Rutas de Zona (FASE 1.1 v17)
 */

export const ROUTES = {
  superadmin: "/superadmin",
  admin: "/admin",
  login: "/login",
} as const;

export function matchesRoutePrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

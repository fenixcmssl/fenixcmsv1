import { getAdminClient } from "@/lib/prisma";

export async function getTenantByDomain(domain: string) {
  const prisma = getAdminClient();
  
  // Limpieza del dominio (removiendo puertos si los hubiera como localhost:3000)
  const cleanDomain = domain.split(":")[0];

  const tenantDomain = await prisma.tenantDomain.findFirst({
    where: { domain: cleanDomain },
    include: { tenant: true },
  });

  if (tenantDomain && tenantDomain.tenant) {
    return tenantDomain.tenant;
  }

  // Fallback por defecto para desarrollo local si no encuentra el dominio exacto
  const fallbackTenant = await prisma.tenant.findFirst();
  return fallbackTenant;
}
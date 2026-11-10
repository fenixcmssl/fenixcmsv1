"use server";
import { getAdminClient } from "@/lib/prisma";

export async function createTenantAfterPayment(planName: string, payerEmail: string, payerName: string) {
  const prisma = getAdminClient();
  try {
    // Generar un subdominio único basado en el nombre del cliente
    const baseSlug = payerName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'store';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const subdomain = baseSlug + randomSuffix + ".fenixcms.es";

    // Crear el Tenant y su Dominio en la base de datos SuperAdmin
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Tienda de ' + payerName,
        tenantDomains: {
          create: {
            domain: subdomain,
            isCustom: false
          }
        }
      },
      include: {
        tenantDomains: true
      }
    });

    return { success: true, domain: subdomain, tenantId: tenant.id };
  } catch (error) {
    console.error("Error al crear el tenant en PostgreSQL:", error);
    return { success: false, error: "Error al provisionar la base de datos." };
  }
}

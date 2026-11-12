"use server";
import { getAdminClient } from "@/lib/prisma";

export async function createTenantAfterPayment(planName: string, payerEmail: string, payerName: string) {
  const prisma = getAdminClient();
  try {
    const baseSlug = payerName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'store';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const subdomain = baseSlug + randomSuffix + ".fenixcms.es";

    // Generar contraseña alfanumérica aleatoria de 8 caracteres
    const randomPassword = Math.random().toString(36).slice(-8);

    const tenant = await prisma.tenant.create({
      data: {
        name: 'Tienda de ' + payerName,
        email: payerEmail,
        password: randomPassword,
        moduleType: 'ECOMMERCE',
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

    return { success: true, domain: subdomain, tenantId: tenant.id, password: randomPassword, email: payerEmail };
  } catch (error: any) {
    console.error("Error exacto en PostgreSQL:", error);
    return { success: false, error: String(error.message || error) };
  }
}

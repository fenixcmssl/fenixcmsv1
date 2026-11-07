"use server";

import { getTenantClient, getAdminClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(domain: string, formData: FormData) {
  const adminPrisma = getAdminClient();
  const tenantDomain = await adminPrisma.tenantDomain.findUnique({
    where: { domain },
    include: { tenant: true }
  });

  if (!tenantDomain) throw new Error("Tenant no encontrado");

  const tenantId = tenantDomain.tenant.id;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const sku = formData.get("sku") as string;
  
  // Generar slug basico a partir del nombre
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const tenantPrisma = getTenantClient(tenantId);
  
  await tenantPrisma.product.create({
    data: {
      name,
      slug,
      price,
      sku,
      tenantId,
      isActive: true
    }
  });

  // Refrescar la vista de la tabla de administracion
  revalidatePath(`/${domain}/admin`);
}
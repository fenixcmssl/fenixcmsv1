"use server";

import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function runBulkImport(products: any[]) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tenant_session")?.value;
  if (!sessionId) throw new Error("No autenticado");

  const prisma = getAdminClient();
  
  // Limpiar y estructurar los datos masivos
  const dataToInsert = products.map(p => ({
    tenantId: sessionId,
    name: p.name || "Producto importado sin nombre",
    price: p.price ? parseFloat(p.price) : 0,
    sku: p.sku || null,
    stock: p.stock ? parseInt(p.stock, 10) : 0,
    description: p.description || null,
    isActive: true,
    status: "PUBLISHED"
  }));

  // Ejecutar transacción masiva en PostgreSQL
  const result = await prisma.ecommerceProduct.createMany({
    data: dataToInsert,
    skipDuplicates: true,
  });

  return result.count;
}

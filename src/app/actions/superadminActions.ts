"use server";
import { getAdminClient } from "@/lib/prisma";

export async function checkDatabaseHealth() {
  const prisma = getAdminClient();
  try {
    const tenantsCount = await prisma.tenant.count();
    return { success: true, status: "PostgreSQL Online y Operativo", count: tenantsCount };
  } catch (error) {
    console.error("Error de conexión a PostgreSQL:", error);
    return { success: false, status: "Error de Conexión" };
  }
}

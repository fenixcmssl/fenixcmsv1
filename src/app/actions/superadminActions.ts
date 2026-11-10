"use server";
import { getAdminClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSuperAdminItem(tabName: string, formData: any) {
  const prisma = getAdminClient();
  try {
    if (tabName === 'applications') {
      await prisma.application.create({
        data: {
          name: formData.name,
          type: formData.type || 'ECOMMERCE',
          version: formData.version || '1.0.0',
          status: 'ACTIVA',
          desc: formData.desc || ''
        }
      });
    } else if (tabName === 'plans') {
      await prisma.plan.create({
        data: {
          name: formData.name,
          slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          monthlyPrice: parseFloat(formData.price || 0),
          yearlyPrice: parseFloat(formData.price || 0) * 10,
          trialDays: 14,
          tag: formData.tag || 'NUEVO',
          appName: 'Fenix E-commerce Pro',
          status: 'ACTIVO',
          desc: formData.desc || ''
        }
      });
    }
    
    // Forzar a Next.js a recargar los datos frescos de la base de datos
    revalidatePath('/[domain]/superadmin', 'page');
    return { success: true };
  } catch (error: any) {
    console.error("Error al guardar en PostgreSQL:", error);
    return { success: false, error: String(error.message || error) };
  }
}

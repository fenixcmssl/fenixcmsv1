"use server";

import { getAdminClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { redirect } from "next/navigation";

export async function updateBranding(domain: string, tenantId: string, formData: FormData) {
  const themeColor = formData.get("themeColor") as string;
  const logo = formData.get("logo") as File | null;

  const adminPrisma = getAdminClient();
  const existingTenant = await adminPrisma.tenant.findUnique({ where: { id: tenantId } });
  
  if (!existingTenant) throw new Error("Tenant no encontrado");

  let logoUrl = existingTenant.logoUrl;

  if (logo && logo.size > 0) {
    if (existingTenant.logoUrl) {
      const oldFileName = existingTenant.logoUrl.split('/').pop();
      if (oldFileName) {
        const oldFilePath = join(process.cwd(), "public", "uploads", tenantId, oldFileName);
        try { await unlink(oldFilePath); } catch (e) { console.error("Error borrando logo anterior", e); }
      }
    }

    const bytes = await logo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(process.cwd(), "public", "uploads", tenantId);
    await mkdir(uploadDir, { recursive: true });

    const fileName = `logo-${Date.now()}-${logo.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    logoUrl = `/uploads/${tenantId}/${fileName}`;
  }

  await adminPrisma.tenant.update({
    where: { id: tenantId },
    data: { themeColor, logoUrl }
  });

  revalidatePath(`/${domain}/admin`);
  revalidatePath(`/${domain}/admin/settings`);
  redirect(`/admin`);
}
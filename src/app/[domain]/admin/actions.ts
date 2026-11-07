"use server";

import { getTenantClient, getAdminClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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
  const image = formData.get("image") as File | null;
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  let imageUrl = null;
  
  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = join(process.cwd(), "public", "uploads", tenantId);
    await mkdir(uploadDir, { recursive: true });
    
    const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/${tenantId}/${fileName}`;
  }

  const tenantPrisma = getTenantClient(tenantId);
  await tenantPrisma.product.create({
    data: {
      name,
      slug,
      price,
      sku,
      imageUrl,
      tenantId,
      isActive: true
    }
  });

  revalidatePath(`/${domain}/admin`);
}
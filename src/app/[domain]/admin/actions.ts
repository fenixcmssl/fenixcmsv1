"use server";

import { getTenantClient, getAdminClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
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
  revalidatePath(`/${domain}`);
}

export async function updateProduct(domain: string, productId: string, formData: FormData) {
  const adminPrisma = getAdminClient();
  const tenantDomain = await adminPrisma.tenantDomain.findUnique({
    where: { domain },
    include: { tenant: true }
  });

  if (!tenantDomain) throw new Error("Tenant no encontrado");

  const tenantId = tenantDomain.tenant.id;
  const tenantPrisma = getTenantClient(tenantId);

  const existingProduct = await tenantPrisma.product.findUnique({
    where: { id: productId }
  });

  if (!existingProduct) throw new Error("Producto no encontrado");

  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const sku = formData.get("sku") as string;
  const image = formData.get("image") as File | null;
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let imageUrl = existingProduct.imageUrl;
  
  // Si se sube una nueva imagen, borramos la vieja y guardamos la nueva
  if (image && image.size > 0) {
    if (existingProduct.imageUrl) {
      const oldFileName = existingProduct.imageUrl.split('/').pop();
      if (oldFileName) {
        const oldFilePath = join(process.cwd(), "public", "uploads", tenantId, oldFileName);
        try { await unlink(oldFilePath); } catch (e) { console.error("Error borrando imagen anterior", e); }
      }
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(process.cwd(), "public", "uploads", tenantId);
    await mkdir(uploadDir, { recursive: true });
    
    const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/${tenantId}/${fileName}`;
  }

  await tenantPrisma.product.update({
    where: { id: productId },
    data: { name, slug, price, sku, imageUrl }
  });

  revalidatePath(`/${domain}/admin`);
  revalidatePath(`/${domain}`);
}

export async function deleteProduct(domain: string, productId: string) {
  const adminPrisma = getAdminClient();
  const tenantDomain = await adminPrisma.tenantDomain.findUnique({
    where: { domain },
    include: { tenant: true }
  });

  if (!tenantDomain) throw new Error("Tenant no encontrado");

  const tenantPrisma = getTenantClient(tenantDomain.tenant.id);

  const product = await tenantPrisma.product.findUnique({
    where: { id: productId }
  });

  if (product?.imageUrl) {
    const fileName = product.imageUrl.split('/').pop();
    if (fileName) {
      const filePath = join(process.cwd(), "public", "uploads", tenantDomain.tenant.id, fileName);
      try { await unlink(filePath); } catch (error) { console.error("Error al borrar", error); }
    }
  }

  await tenantPrisma.product.delete({
    where: { id: productId }
  });

  revalidatePath(`/${domain}/admin`);
  revalidatePath(`/${domain}`);
}
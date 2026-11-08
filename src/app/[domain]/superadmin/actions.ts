"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/prisma";

export async function saveItemAction(formData: FormData) {
  const type = formData.get("itemType") as string;
  const tab = formData.get("tabName") as string;
  const id = formData.get("id") as string | null;
  const data = Object.fromEntries(formData.entries());
  
  // 1. Si es una EDICIÓN de un Tenant real en Prisma PostgreSQL
  if (tab === "tenants" && id && !id.startsWith("tenants_")) {
    const prisma = getAdminClient();
    try {
      await prisma.tenant.update({
        where: { id },
        data: { name: data.name as string }
      });
    } catch (e) { console.error("Error al actualizar tenant:", e) }
  } 
  // 2. Si es edición o creación de datos estáticos/mocks gestionados por Cookies
  else {
    const cookieStore = await cookies();
    const cookieName = `mock_new_${type}`;
    const existing = cookieStore.get(cookieName)?.value;
    let items: any[] = existing ? JSON.parse(existing) : [];
    
    if (id) {
      // Es una Edición
      const index = items.findIndex((i: any) => i.id === id);
      if (index >= 0) {
        items[index] = { ...items[index], ...data }; // Actualiza el existente
      } else {
        items.push({ ...data, id }); // Crea la modificación del base
      }
    } else {
      // Es una Creación Nueva
      const newItem = { id: `${type}_${Date.now()}`, ...data, status: data.status || "Activo" };
      items.push(newItem);
    }
    cookieStore.set(cookieName, JSON.stringify(items), { path: '/' });
  }
  
  redirect(`?tab=${tab}`);
}
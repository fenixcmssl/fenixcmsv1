"use server";
import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function loginTenant(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email y contraseña requeridos." };

  const prisma = getAdminClient();
  
  // Buscar al cliente en la base de datos
  const tenant = await prisma.tenant.findFirst({
    where: { email: email, password: password, status: 'ACTIVE' },
    include: { tenantDomains: true }
  });

  if (!tenant) return { error: "Credenciales incorrectas o tienda inactiva." };

  // Identificar el dominio principal de su tienda
  const domainRecord = tenant.tenantDomains.find(d => !d.isCustom) || tenant.tenantDomains[0];
  if (!domainRecord) return { error: "La tienda no tiene un dominio configurado." };

  // Crear una sesión temporal (cookie) por seguridad
  const cookieStore = await cookies();
  cookieStore.set("tenant_session", tenant.id, { 
    httpOnly: true, 
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 1 semana
  });

  return { success: true, domain: domainRecord.domain };
}

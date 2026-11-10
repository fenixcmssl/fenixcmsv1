"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function handleSuperAdminLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/superadmin/login?error=credenciales");
  }

  const prisma = getAdminClient();
  
  // Consultar la tabla independiente del Superadmin
  const admin = await prisma.superAdmin.findUnique({ where: { email } });

  if (admin && admin.password) {
    // Comparar el hash criptográfico
    const isValid = await bcrypt.compare(password, admin.password);
    
    if (isValid) {
      const cookieStore = await cookies();
      cookieStore.set("superadmin_auth", "true", { 
          path: "/", 
          maxAge: 60 * 60 * 24,
          httpOnly: true 
      });
      redirect("/superadmin?tab=dashboard");
    }
  }

  // Si falla la validación, devuelve error
  redirect("/superadmin/login?error=credenciales");
}

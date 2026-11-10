"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function handleSuperAdminLogin(formData: FormData) {
  const rawEmail = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!rawEmail || !password) redirect("/superadmin/login?error=credenciales");

  // Limpiar espacios y forzar minúsculas para comparar de forma segura
  const email = rawEmail.trim().toLowerCase();
  const prisma = getAdminClient();
  
  const admin = await prisma.superAdmin.findFirst();

  if (admin && admin.email === email) {
    const isValid = await bcrypt.compare(password, admin.password);
    if (isValid) {
      const cookieStore = await cookies();
      cookieStore.set("superadmin_auth", "true", { path: "/", maxAge: 60 * 60 * 24, httpOnly: true });
      redirect("/superadmin?tab=dashboard");
    }
  }

  redirect("/superadmin/login?error=credenciales");
}

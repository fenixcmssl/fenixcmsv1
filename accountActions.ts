"use server";
import { getAdminClient } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function updateSuperAdminPassword(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) redirect("/superadmin?tab=account&msg=empty");
  if (newPassword !== confirmPassword) redirect("/superadmin?tab=account&msg=mismatch");

  const prisma = getAdminClient();
  const email = "admin@fenixcms.io";

  // 1. Asegurar que el Superadmin existe en la tabla independiente (upsert inicial)
  let admin = await prisma.superAdmin.findUnique({ where: { email } });
  if (!admin) {
    const hashedTemp = await bcrypt.hash("superadmin2026", 10);
    admin = await prisma.superAdmin.create({
      data: { name: "Super Admin Maestro", email, password: hashedTemp }
    });
  }

  // 2. Verificar credencial actual
  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) redirect("/superadmin?tab=account&msg=invalid");

  // 3. Encriptar y guardar nueva credencial
  const hashedNew = await bcrypt.hash(newPassword, 10);
  await prisma.superAdmin.update({
    where: { email },
    data: { password: hashedNew }
  });

  redirect("/superadmin?tab=account&msg=success");
}
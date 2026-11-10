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
  const admin = await prisma.superAdmin.findFirst();
  if (!admin) redirect("/superadmin?tab=account&msg=invalid");

  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) redirect("/superadmin?tab=account&msg=invalid");

  const hashedNew = await bcrypt.hash(newPassword, 10);
  await prisma.superAdmin.update({
    where: { id: admin.id },
    data: { password: hashedNew }
  });

  redirect("/superadmin?tab=account&msg=success");
}

export async function updateSuperAdminProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const rawEmail = formData.get("email") as string;
  
  if (!rawEmail || !name) redirect("/superadmin?tab=account&msg=profile_empty");
  
  // Limpiar el correo antes de guardar en PostgreSQL
  const email = rawEmail.trim().toLowerCase();
  const prisma = getAdminClient();
  const admin = await prisma.superAdmin.findFirst();
  
  if (admin) {
    await prisma.superAdmin.update({
      where: { id: admin.id },
      data: { name, email }
    });
  }
  
  redirect("/superadmin?tab=account&msg=profile_success");
}

"use server";

import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const domain = formData.get("domain") as string;
  const tenantId = formData.get("tenantId") as string;
  const password = formData.get("password") as string;

  const adminPrisma = getAdminClient();
  const tenant = await adminPrisma.tenant.findUnique({
    where: { id: tenantId }
  });

  if (tenant && tenant.password === password) {
    const cookieStore = await cookies();
    cookieStore.set(`auth_${tenantId}`, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 dia de sesion
      path: "/",
    });
    redirect(`/admin`);
  } else {
    redirect(`/admin/login?error=invalid_password`);
  }
}

export async function logoutAction(tenantId: string) {
  const cookieStore = await cookies();
  cookieStore.delete(`auth_${tenantId}`);
  redirect(`/admin/login`);
}
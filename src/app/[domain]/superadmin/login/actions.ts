"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleSuperAdminLogin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // Credenciales maestras temporales para la fase de desarrollo UI
  if (email === "admin@fenixcms.io" && password === "superadmin2026") {
    const cookieStore = await cookies();
    // Guardamos una cookie de sesion valida por 24 horas
    cookieStore.set("superadmin_auth", "true", { 
        path: "/", 
        maxAge: 60 * 60 * 24,
        httpOnly: true 
    });
    
    // Redirigimos al panel de control principal
    redirect("/superadmin?tab=dashboard");
  } else {
    // Si falla, recargamos el login con un parametro de error
    redirect("/superadmin/login?error=credenciales");
  }
}
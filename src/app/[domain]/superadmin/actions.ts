"use server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function updateGlobalBranding(formData: FormData) {
  const logo = formData.get("logo") as File;
  const favicon = formData.get("favicon") as File;

  // Aseguramos que la carpeta public exista por seguridad
  const publicDir = path.join(process.cwd(), "public");
  await mkdir(publicDir, { recursive: true });

  if (logo && logo.size > 0) {
    // Solo permitimos imágenes
    if (logo.type.startsWith("image/")) {
      const logoBuffer = Buffer.from(await logo.arrayBuffer());
      // Guardamos la imagen
      await writeFile(path.join(publicDir, "global-logo.png"), logoBuffer);
    }
  }

  if (favicon && favicon.size > 0) {
    const faviconBuffer = Buffer.from(await favicon.arrayBuffer());
    // Guardamos la versión como favicon global en public para que Next.js lo sirva
    await writeFile(path.join(publicDir, "favicon.ico"), faviconBuffer);
    
    // También por seguridad en el layout si Next.js lo requiere en la raíz de app
    const appDir = path.join(process.cwd(), "src", "app");
    await mkdir(appDir, { recursive: true });
    await writeFile(path.join(appDir, "favicon.ico"), faviconBuffer);
  }

  // Desactivamos la cache en memoria de la pagina superadmin para ver los cambios de inmediato
  revalidatePath("/superadmin");
}
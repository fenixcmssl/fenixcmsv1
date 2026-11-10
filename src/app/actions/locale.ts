"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setSystemLocale(locale: string, currentPath: string) {
   const cookieStore = await cookies();
   cookieStore.set("NEXT_LOCALE", locale, { path: "/", maxAge: 31536000 });
   redirect(currentPath);
}

import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewPagePage({ params }: any) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);

  async function createPage(formData: FormData) {
    "use server";
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("tenant_session")?.value;
    if (!sessionId) redirect("/login");

    const title = formData.get("title") as string;
    let slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const type = formData.get("type") as string || "GENERAL";
    const status = formData.get("status") as string || "PUBLISHED";

    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const prisma = getAdminClient();
    
    await prisma.page.create({
      data: {
        tenantId: sessionId,
        title,
        slug,
        content,
        type,
        status
      }
    });

    redirect("/admin/pages");
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto w-full">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Añadir Nueva Página</h1>
            <p className="text-gray-500 mt-2">Crea una página estática para {domain}.</p>
          </div>
          <Link href="/admin/pages" className="text-gray-500 hover:text-gray-700 font-medium bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm">
            Volver a páginas
          </Link>
        </header>

        <form action={createPage} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
              Contenido de la Página
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Título de la Página *</label>
                <input type="text" name="title" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium" placeholder="Ej: Política de Privacidad" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Enlace Permanente (Slug)</label>
                <input type="text" name="slug" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ej-politica-privacidad" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tipo de Página</label>
                <select name="type" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="GENERAL">General (Contacto, Quiénes somos...)</option>
                  <option value="LEGAL">Legal (Términos, Privacidad, Cookies...)</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select name="status" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="PUBLISHED">Publicado</option>
                  <option value="DRAFT">Borrador</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Contenido *</label>
                <textarea name="content" required rows={15} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" placeholder="Escribe el contenido HTML o texto de tu página aquí..."></textarea>
              </div>

            </div>
          </div>

          <div className="sticky bottom-4 bg-gray-900 rounded-xl p-4 shadow-xl flex justify-between items-center z-10">
            <p className="text-gray-300 text-sm">Asegúrate de revisar la ortografía antes de publicar.</p>
            <button type="submit" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-400 transition-colors shadow-lg">
              Guardar Página
            </button>
          </div>
          
        </form>
      </div>
    </main>
  );
}

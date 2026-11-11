import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewPostPage({ params }: any) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);

  // Lógica de servidor para guardar la entrada
  async function createPost(formData: FormData) {
    "use server";
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("tenant_session")?.value;
    if (!sessionId) redirect("/login");

    const title = formData.get("title") as string;
    let slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as string || "DRAFT";

    // Si no se proporciona un slug, autogenerarlo a partir del título
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const prisma = getAdminClient();
    
    await prisma.blogPost.create({
      data: {
        tenantId: sessionId,
        title,
        slug,
        excerpt,
        content,
        status,
        postType: "POST"
      }
    });

    redirect("/admin/posts");
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto w-full">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Añadir Nueva Entrada</h1>
            <p className="text-gray-500 mt-2">Escribe y publica una noticia en el blog de {domain}.</p>
          </div>
          <Link href="/admin/posts" className="text-gray-500 hover:text-gray-700 font-medium bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm">
            Volver a entradas
          </Link>
        </header>

        <form action={createPost} className="space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
              Contenido del Artículo
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Título de la Entrada *</label>
                <input type="text" name="title" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium" placeholder="Ej: Las 10 tendencias de este año" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Enlace Permanente (Slug)</label>
                <input type="text" name="slug" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ej-enlace-amigable (Opcional)" />
                <p className="text-xs text-gray-400">Si lo dejas en blanco, se generará automáticamente desde el título.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select name="status" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="PUBLISHED">Publicado</option>
                  <option value="DRAFT">Borrador</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Extracto (Resumen corto)</label>
                <textarea name="excerpt" rows={2} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Opcional. Breve resumen que aparecerá en la lista del blog..."></textarea>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Contenido *</label>
                <textarea name="content" required rows={12} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" placeholder="Escribe el cuerpo de tu artículo aquí (puedes usar HTML si lo deseas)..."></textarea>
              </div>

            </div>
          </div>

          <div className="sticky bottom-4 bg-gray-900 rounded-xl p-4 shadow-xl flex justify-between items-center z-10">
            <p className="text-gray-300 text-sm">Al guardar, la entrada aparecerá en tu blog inmediatamente si está como Publicada.</p>
            <button type="submit" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-400 transition-colors shadow-lg">
              Guardar Entrada
            </button>
          </div>
          
        </form>
      </div>
    </main>
  );
}

import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TenantPostsPage({ params }: any) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tenant_session")?.value;
  if (!sessionId) redirect("/login");

  const prisma = getAdminClient();
  
  // Obtener las entradas del Blog estrictamente de esta tienda
  const posts = await prisma.blogPost.findMany({
    where: { tenantId: sessionId, postType: "POST" },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="flex-1 p-8 overflow-y-auto w-full">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Entradas del Blog</h1>
            <p className="text-gray-500 mt-2">Gestiona las noticias y artículos para {domain}.</p>
          </div>
          <Link href="/admin/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm inline-block">
            + Nueva Entrada
          </Link>
        </header>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✍️</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aún no hay entradas</h3>
              <p className="text-gray-500 mb-6">Empieza a escribir para atraer tráfico y conectar con tus clientes.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">Título</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium">Fecha</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{post.title}</p>
                      <p className="text-xs text-gray-500">/{post.slug}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(post.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/posts/edit/${post.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

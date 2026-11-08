import { getTenantClient, getAdminClient } from "@/lib/prisma";
import { createProduct, deleteProduct } from "./actions";
import { logoutAction } from "./login/actions";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function AdminPage({ params }: { params: Promise<{ domain: string }> }) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams.domain);
  
  const adminPrisma = getAdminClient();
  const tenantDomain = await adminPrisma.tenantDomain.findUnique({
    where: { domain },
    include: { tenant: true }
  });

  if (!tenantDomain) return notFound();

  const tenant = tenantDomain.tenant;
  
  // -- GUARDIÁN DE SEGURIDAD --
  const cookieStore = await cookies();
  const isAuth = cookieStore.get(`auth_${tenant.id}`);
  if (!isAuth || isAuth.value !== "true") {
    redirect(`/admin/login`);
  }
  // ---------------------------

  const tenantPrisma = getTenantClient(tenant.id);
  const products = await tenantPrisma.ecommerceProduct.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const createProductWithDomain = createProduct.bind(null, domain);
  const handleLogout = logoutAction.bind(null, tenant.id);

  return (
    <main className="min-h-screen p-8 bg-gray-100 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración - {tenant.name}</h1>
            <p className="text-gray-500 mt-1">Gestión de Catálogo Multi-Tenant</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href={`/admin/settings`} className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer flex items-center gap-1">
              ⚙️ Configuración
            </Link>
            <a href={`http://${domain}:3000`} target="_blank" className="text-blue-600 hover:underline text-sm font-medium cursor-pointer">
              Ver Tienda Pública ↗
            </a>
            <form action={handleLogout}>
              <button type="submit" className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer border border-red-100">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Añadir Producto</h2>
            <form action={createProductWithDomain} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input type="text" name="name" required className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500 outline-none cursor-text" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio ($)</label>
                <input type="number" step="0.01" name="price" required className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500 outline-none cursor-text" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU (Código)</label>
                <input type="text" name="sku" required className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500 outline-none cursor-text" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                <input type="file" name="image" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none cursor-pointer file:cursor-pointer" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer">
                Guardar Producto
              </button>
            </form>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Productos Registrados ({products.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((p) => {
                    const deleteAction = deleteProduct.bind(null, domain, p.id);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {p.imageUrl ? (
                            <img src={p.imageUrl.replace('/uploads/', '/api/images/')} alt={p.name} className="h-10 w-10 object-cover rounded-md border bg-gray-50" />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">N/A</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-bold">${p.price.toString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-4 h-full mt-2">
                          <Link href={`/admin/edit/${p.id}`} className="text-blue-600 hover:text-blue-900 font-medium cursor-pointer">
                            Editar
                          </Link>
                          <form action={deleteAction} className="inline">
                            <button type="submit" className="text-red-600 hover:text-red-900 font-medium cursor-pointer">Eliminar</button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
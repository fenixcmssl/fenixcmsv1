import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TenantProductsPage({ params }: any) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tenant_session")?.value;

  if (!sessionId) redirect("/login");

  const prisma = getAdminClient();
  const tenant = await prisma.tenant.findUnique({ where: { id: sessionId } });
  
  if (!tenant) redirect("/login");

  // Obtener los productos estrictamente de este Tenant
  const products = await prisma.ecommerceProduct.findMany({
    where: { tenantId: sessionId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold truncate">{tenant.name}</h2>
          <p className="text-xs text-slate-400 mt-1">{domain}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/admin" className="block p-3 hover:bg-slate-800 rounded-lg text-slate-300">Dashboard</a>
          <a href="/admin/products" className="block p-3 bg-blue-600 rounded-lg font-medium">Catálogo</a>
          <a href="#" className="block p-3 hover:bg-slate-800 rounded-lg text-slate-300">Pedidos</a>
          <a href="#" className="block p-3 hover:bg-slate-800 rounded-lg text-slate-300">Clientes</a>
          <a href="#" className="block p-3 hover:bg-slate-800 rounded-lg text-slate-300">Ajustes</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <a href="/login" className="block p-3 hover:bg-slate-800 rounded-lg text-red-400 text-center transition-colors">
            Cerrar Sesión
          </a>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
            <p className="text-gray-500 mt-2">Gestiona tu inventario y precios de {domain}.</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
            + Nuevo Producto
          </button>
        </header>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">+</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Tu catálogo está vacío</h3>
              <p className="text-gray-500 mb-6">Comienza a subir tus productos para vender online.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">Producto</th>
                  <th className="p-4 font-medium">Precio</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      {product.sku && <p className="text-xs text-gray-500">SKU: {product.sku}</p>}
                    </td>
                    <td className="p-4 text-gray-900">€{product.price.toFixed(2)}</td>
                    <td className="p-4 text-gray-900">{product.stock}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

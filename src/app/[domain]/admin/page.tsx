import { getTenantClient, getAdminClient } from "@/lib/prisma";
import { createProduct } from "./actions";
import { notFound } from "next/navigation";

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
  const tenantPrisma = getTenantClient(tenant.id);
  
  const products = await tenantPrisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const createProductWithDomain = createProduct.bind(null, domain);

  return (
    <main className="min-h-screen p-8 bg-gray-100 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold">Panel de Administración - {tenant.name}</h1>
          <p className="text-gray-500 mt-1">Gestión de Catálogo Multi-Tenant</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Formulario de Creación */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-semibold mb-4">Añadir Producto</h2>
            <form action={createProductWithDomain} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input type="text" name="name" required className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio ($)</label>
                <input type="number" step="0.01" name="price" required className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU (Código)</label>
                <input type="text" name="sku" required className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                Guardar Producto
              </button>
            </form>
          </section>

          {/* Lista de Productos */}
          <section className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Productos Registrados ({products.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-bold">${p.price.toString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
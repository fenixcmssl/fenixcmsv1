import { getTenantClient, getAdminClient } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function StorefrontPage({ params }: { params: Promise<{ domain: string }> }) {
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
  
  // Solo mostramos productos activos para los clientes
  const products = await tenantPrisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm border-b border-gray-200 py-6 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
          <Link href={`/admin`} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
            Acceso Administrador
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-12 px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Nuestro Catálogo</h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-12 text-lg">Aún no hay productos disponibles en esta tienda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-64 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl.replace('/uploads/', '/api/images/')} 
                      alt={p.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm font-medium">Sin imagen</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{p.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">SKU: {p.sku || 'N/A'}</p>
                  <p className="text-xl font-bold text-blue-600">${p.price.toString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
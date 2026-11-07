import { getTenantClient, getAdminClient } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function TenantPage({ params }: { params: Promise<{ domain: string }> }) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams.domain);
  
  // 1. Resolver el Inquilino (Modo Admin / Bypass)
  const adminPrisma = getAdminClient();
  const tenantDomain = await adminPrisma.tenantDomain.findUnique({
    where: { domain },
    include: { tenant: true }
  });

  if (!tenantDomain) return notFound();

  const tenant = tenantDomain.tenant;
  
  // 2. Extraer Catálogo protegido (Modo Tenant / RLS Activo)
  const tenantPrisma = getTenantClient(tenant.id);
  const products = await tenantPrisma.product.findMany({
    where: { isActive: true },
    include: { category: true }
  });

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 border-b pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">{tenant.name}</h1>
          <p className="text-gray-500 mt-2">Visión de cliente (RLS Activo) - {domain}</p>
        </header>
        
        <section>
          <h2 className="text-2xl font-bold mb-6">Nuestro Catálogo</h2>
          {products.length === 0 ? (
            <p className="text-gray-600 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              No hay productos disponibles en este momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <article key={product.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
                    {product.category?.name || "Sin categoría"}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">SKU: {product.sku}</p>
                  <div className="text-2xl font-black text-gray-900">
                    ${product.price.toString()}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
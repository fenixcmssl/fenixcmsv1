import { getTenantClient, getAdminClient } from "@/lib/prisma";
import { updateProduct } from "../../actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function EditProductPage({ params }: { params: Promise<{ domain: string, id: string }> }) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams.domain);
  const productId = resolvedParams.id;
  
  const adminPrisma = getAdminClient();
  const tenantDomain = await adminPrisma.tenantDomain.findUnique({
    where: { domain },
    include: { tenant: true }
  });

  if (!tenantDomain) return notFound();

  const tenant = tenantDomain.tenant;
  const tenantPrisma = getTenantClient(tenant.id);
  
  const product = await tenantPrisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) return notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateProduct(domain, productId, formData);
    // Redireccion corregida para el middleware
    redirect(`/admin`);
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100 text-gray-900 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Editar Producto</h1>
            <p className="text-gray-500 mt-1">Actualizando: {product.name}</p>
          </div>
          {/* Enlace de retroceso corregido */}
          <Link href={`/admin`} className="text-blue-600 hover:underline text-sm font-medium cursor-pointer">
            ← Volver al Panel
          </Link>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <form action={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
              <input type="text" name="name" defaultValue={product.name} required className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500 outline-none cursor-text" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio ($)</label>
              <input type="number" step="0.01" name="price" defaultValue={product.price.toString()} required className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500 outline-none cursor-text" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU (Código)</label>
              <input type="text" name="sku" defaultValue={product.sku || ''} required className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500 outline-none cursor-text" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Actual</label>
              {product.imageUrl ? (
                <div className="mb-4">
                  <img src={product.imageUrl.replace('/uploads/', '/api/images/')} alt={product.name} className="h-32 w-32 object-cover rounded-md border bg-gray-50" />
                  <p className="text-xs text-gray-500 mt-2">Sube un archivo nuevo solo si deseas reemplazar la imagen actual.</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">Este producto no tiene imagen.</p>
              )}
              
              <label className="block text-sm font-medium text-gray-700">Nueva Imagen</label>
              <input type="file" name="image" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none cursor-pointer file:cursor-pointer" />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer text-lg">
              Actualizar Producto
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewProductPage({ params }: any) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);

  // Lógica de servidor para guardar el producto
  async function createProduct(formData: FormData) {
    "use server";
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("tenant_session")?.value;
    if (!sessionId) redirect("/login");

    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string, 10) || 0;
    const sku = formData.get("sku") as string;
    const description = formData.get("description") as string;

    const prisma = getAdminClient();
    
    // Inserción segura con el Tenant ID forzado desde la sesión
    await prisma.ecommerceProduct.create({
      data: {
        tenantId: sessionId,
        name,
        price,
        stock,
        sku,
        description,
        isActive: true
      }
    });

    // Volver a la lista de productos tras guardar
    redirect("/admin/products");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Contenido Principal (Formulario a pantalla completa para el editor) */}
      <main className="flex-1 p-8 overflow-y-auto w-full max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Añadir Nuevo Producto</h1>
            <p className="text-gray-500 mt-2">Introduce los detalles del artículo para {domain}.</p>
          </div>
          <Link href="/admin/products" className="text-gray-500 hover:text-gray-700 font-medium">
            Cancelar
          </Link>
        </header>

        <form action={createProduct} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nombre del Producto *</label>
              <input type="text" name="name" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Ej: Camiseta de Algodón Orgánico" />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Precio (€) *</label>
              <input type="number" step="0.01" min="0" name="price" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Stock Inicial</label>
              <input type="number" min="0" name="stock" defaultValue="1" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Código SKU (Opcional)</label>
              <input type="text" name="sku" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Ej: CAM-ALG-001" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea name="description" rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Describe los detalles de tu producto..."></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Guardar Producto
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

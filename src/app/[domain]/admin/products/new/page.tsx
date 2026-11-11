import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewProductPage({ params }: any) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);

  // Lógica de servidor para guardar el producto con todos los campos WooCommerce
  async function createProduct(formData: FormData) {
    "use server";
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("tenant_session")?.value;
    if (!sessionId) redirect("/login");

    // Helper para parsear números o devolver nulo si está vacío
    const parseNum = (val: any) => val ? parseFloat(val) : null;
    const parseIntNum = (val: any, def: number) => val ? parseInt(val, 10) : def;

    // Extracción de Datos Generales
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseNum(formData.get("price")) || 0;
    const salePrice = parseNum(formData.get("salePrice"));
    const taxStatus = formData.get("taxStatus") as string || "TAXABLE";

    // Extracción de Inventario
    const sku = formData.get("sku") as string;
    const manageStock = formData.get("manageStock") === "on";
    const stock = parseIntNum(formData.get("stock"), 0);
    const lowStockAmount = parseIntNum(formData.get("lowStockAmount"), 2);
    const backorders = formData.get("backorders") as string || "NO";
    const stockStatus = formData.get("stockStatus") as string || "IN_STOCK";

    // Extracción de Envío
    const weight = parseNum(formData.get("weight"));
    const length = parseNum(formData.get("length"));
    const width = parseNum(formData.get("width"));
    const height = parseNum(formData.get("height"));

    const prisma = getAdminClient();
    
    // Inserción segura con el Tenant ID forzado desde la sesión
    await prisma.ecommerceProduct.create({
      data: {
        tenantId: sessionId,
        name,
        description,
        price,
        salePrice,
        taxStatus,
        sku,
        manageStock,
        stock,
        lowStockAmount,
        backorders,
        stockStatus,
        weight,
        length,
        width,
        height,
        isActive: true,
        status: "PUBLISHED"
      }
    });

    redirect("/admin/products");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 p-8 overflow-y-auto w-full max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Añadir Nuevo Producto</h1>
            <p className="text-gray-500 mt-2">Configura los datos del producto para {domain}.</p>
          </div>
          <Link href="/admin/products" className="text-gray-500 hover:text-gray-700 font-medium bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm">
            Volver al catálogo
          </Link>
        </header>

        <form action={createProduct} className="space-y-6">
          
          {/* SECCIÓN: GENERAL */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
              Datos Generales
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Nombre del Producto *</label>
                <input type="text" name="name" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej: Zapatillas Deportivas" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Precio Normal (€) *</label>
                <input type="number" step="0.01" min="0" name="price" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Precio Rebajado (€)</label>
                <input type="number" step="0.01" min="0" name="salePrice" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Opcional" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Estado del Impuesto</label>
                <select name="taxStatus" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="TAXABLE">Imponible (Sujeto a impuestos)</option>
                  <option value="SHIPPING">Solo envío</option>
                  <option value="NONE">Ninguno</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descripción Completa</label>
                <textarea name="description" rows={5} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe los detalles de tu producto..."></textarea>
              </div>
            </div>
          </div>

          {/* SECCIÓN: INVENTARIO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
              Inventario
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">SKU (Unidad de mantenimiento de existencias)</label>
                <input type="text" name="sku" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej: ZAP-001" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Estado del Stock</label>
                <select name="stockStatus" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="IN_STOCK">Hay existencias</option>
                  <option value="OUT_OF_STOCK">Agotado</option>
                  <option value="ON_BACKORDER">Se puede reservar</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2 flex items-center gap-2 mt-2">
                <input type="checkbox" name="manageStock" id="manageStock" className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <label htmlFor="manageStock" className="text-sm font-medium text-gray-700 cursor-pointer">Rastrear cantidad de inventario para este producto</label>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cantidad en Stock</label>
                <input type="number" name="stock" defaultValue="0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Umbral de pocas existencias</label>
                <input type="number" name="lowStockAmount" defaultValue="2" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">¿Permitir reservas?</label>
                <select name="backorders" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="NO">No permitir</option>
                  <option value="NOTIFY">Permitir, pero avisar al cliente</option>
                  <option value="YES">Permitir</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN: ENVÍO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
              Envío
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2 md:col-span-4">
                <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                <input type="number" step="0.01" name="weight" className="w-full md:w-1/4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Longitud (cm)</label>
                <input type="number" step="0.1" name="length" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Anchura (cm)</label>
                <input type="number" step="0.1" name="width" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
                <input type="number" step="0.1" name="height" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
              </div>
            </div>
          </div>

          {/* BARRA DE ACCIÓN INFERIOR */}
          <div className="sticky bottom-4 bg-gray-900 rounded-xl p-4 shadow-xl flex justify-between items-center">
            <p className="text-gray-300 text-sm">Revisa los datos antes de publicar.</p>
            <button type="submit" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-400 transition-colors shadow-lg">
              Publicar Producto
            </button>
          </div>
          
        </form>
      </main>
    </div>
  );
}

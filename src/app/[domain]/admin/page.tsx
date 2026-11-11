import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TenantAdminDashboard({ params }: any) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);
  
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tenant_session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const prisma = getAdminClient();
  const tenant = await prisma.tenant.findUnique({
    where: { id: sessionId },
    include: { tenantDomains: true }
  });

  if (!tenant) {
    redirect("/login");
  }

  return (
    <div className="w-full flex flex-col">
      {/* Barra Lateral (Sidebar) */}
      

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resumen del Negocio</h1>
          <p className="text-gray-500 mt-2">Bienvenido al panel de control de tu tienda interactiva.</p>
        </header>

        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Ventas Mes</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">€0.00</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pedidos Pendientes</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Productos Activos</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
        </div>

        {/* Panel de Acción Central */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            +
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Tu catálogo está vacío</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Comienza a subir tus productos para que tus clientes puedan comprar en {domain}.</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Añadir mi primer producto
          </button>
        </div>
      </main>
    </div>
  );
}

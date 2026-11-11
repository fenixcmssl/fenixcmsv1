import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TenantPluginsPage({ params }: any) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tenant_session")?.value;
  if (!sessionId) redirect("/login");

  const prisma = getAdminClient();
  
  // 1. Obtener todos los plugins creados por el SuperAdmin
  const availablePlugins = await prisma.application.findMany({
    where: { type: "PLUGIN", status: "ACTIVA" }
  });

  // 2. Obtener plugins adquiridos/instalados por este Tenant
  const installedExtensions = await prisma.tenantExtension.findMany({
    where: { tenantId: sessionId, type: "PLUGIN" }
  });

  // Mapa para búsqueda rápida de instalaciones
  const installedMap = new Map(installedExtensions.map(ext => [ext.applicationId, ext]));

  return (
    <main className="flex-1 p-8 overflow-y-auto w-full">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Plugins</h1>
          <p className="text-gray-500 mt-2">Descubre y administra módulos adicionales para potenciar {domain}.</p>
        </header>

        {availablePlugins.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔌</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Marketplace Vacío</h3>
            <p className="text-gray-500">Pronto añadiremos nuevas funcionalidades para tu tienda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlugins.map(plugin => {
              const isInstalled = installedMap.has(plugin.id);
              return (
                <div key={plugin.id} className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{plugin.name}</h3>
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full font-semibold">v{plugin.version}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{plugin.desc || "Sin descripción proporcionada."}</p>
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    {isInstalled ? (
                      <div className="flex items-center gap-2 w-full justify-center bg-green-50 border border-green-200 py-2 rounded-lg">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                        <span className="text-sm font-semibold text-green-700">Instalado y Activo</span>
                      </div>
                    ) : (
                      <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full shadow-sm">
                        Ver Detalles / Adquirir
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TenantAppearancePage({ params }: any) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tenant_session")?.value;
  if (!sessionId) redirect("/login");

  const prisma = getAdminClient();
  
  const availableThemes = await prisma.application.findMany({
    where: { type: "THEME", status: "ACTIVA" }
  });

  const installedExtensions = await prisma.tenantExtension.findMany({
    where: { tenantId: sessionId, type: "THEME" }
  });

  const installedMap = new Map(installedExtensions.map(ext => [ext.applicationId, ext]));

  return (
    <main className="flex-1 p-8 overflow-y-auto w-full">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apariencia y Temas</h1>
          <p className="text-gray-500 mt-2">Personaliza el diseño y la experiencia visual de {domain}.</p>
        </header>

        {availableThemes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎨</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay temas disponibles</h3>
            <p className="text-gray-500">Actualmente estás usando el motor visual por defecto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableThemes.map(theme => {
              const isInstalled = installedMap.has(theme.id);
              return (
                <div key={theme.id} className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-slate-100 flex items-center justify-center border-b border-gray-200">
                    <span className="text-4xl">🖼️</span>
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{theme.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{theme.desc || "Tema de diseño para FenixCMS."}</p>
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    {isInstalled ? (
                      <div className="flex items-center gap-2 w-full justify-center bg-green-50 border border-green-200 py-2 rounded-lg">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                        <span className="text-sm font-semibold text-green-700">Tema Activo</span>
                      </div>
                    ) : (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full shadow-sm">
                        Activar Tema
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

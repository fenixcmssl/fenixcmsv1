import { getAdminClient } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { updateBranding } from "./actions";
import Link from "next/link";

export default async function SettingsPage({ params }: { params: Promise<{ domain: string }> }) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams.domain);
  
  const adminPrisma = getAdminClient();
  const tenantDomain = await adminPrisma.tenantDomain.findUnique({
    where: { domain },
    include: { tenant: true }
  });

  if (!tenantDomain) return notFound();
  const tenant = tenantDomain.tenant;

  const cookieStore = await cookies();
  const isAuth = cookieStore.get(`auth_${tenant.id}`);
  if (!isAuth || isAuth.value !== "true") {
    return notFound(); // Gatekeeper simple
  }

  const handleUpdate = updateBranding.bind(null, domain, tenant.id);

  return (
    <main className="min-h-screen p-8 bg-gray-100 text-gray-900 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Configuración Visual</h1>
            <p className="text-gray-500 mt-1">Personaliza tu tienda pública</p>
          </div>
          <Link href={`/admin`} className="text-blue-600 hover:underline text-sm font-medium cursor-pointer">
            ← Volver al Panel
          </Link>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <form action={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Actual</label>
              {tenant.logoUrl ? (
                <div className="mb-4">
                  <img src={tenant.logoUrl.replace('/uploads/', '/api/images/')} alt="Logo" className="h-24 w-auto object-contain rounded-md border bg-gray-50 p-2" />
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No has subido ningún logo.</p>
              )}
              <label className="block text-sm font-medium text-gray-700">Subir Nuevo Logo</label>
              <input type="file" name="logo" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none cursor-pointer file:cursor-pointer" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Color Corporativo (Marca)</label>
              <div className="mt-2 flex items-center gap-4">
                <input type="color" name="themeColor" defaultValue={tenant.themeColor} className="h-10 w-20 cursor-pointer rounded-md border border-gray-300 p-1" />
                <span className="text-sm text-gray-500">Selecciona el color principal que se usará en botones y detalles.</span>
              </div>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer text-lg">
              Guardar Configuración
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
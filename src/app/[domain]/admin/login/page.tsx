import { getAdminClient } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { loginAction } from "./actions";

export default async function LoginPage({ params, searchParams }: { params: Promise<{ domain: string }>, searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const domain = decodeURIComponent(resolvedParams.domain);
  
  const adminPrisma = getAdminClient();
  const tenantDomain = await adminPrisma.tenantDomain.findUnique({
    where: { domain },
    include: { tenant: true }
  });

  if (!tenantDomain) return notFound();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Acceso Restringido</h1>
          <p className="text-gray-500 mt-2">{tenantDomain.tenant.name}</p>
        </div>
        
        {resolvedSearchParams.error === "invalid_password" && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium border border-red-100">
            Contraseña incorrecta. Inténtalo de nuevo.
          </div>
        )}

        <form action={loginAction} className="space-y-6">
          <input type="hidden" name="domain" value={domain} />
          <input type="hidden" name="tenantId" value={tenantDomain.tenant.id} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña de Administración</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full rounded-lg border-gray-300 border p-3 focus:border-blue-500 focus:ring-blue-500 outline-none transition-colors cursor-text" 
              placeholder="Introduce tu contraseña"
            />
          </div>
          
          <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer text-lg shadow-sm">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </main>
  );
}
import { headers } from "next/headers";
import { getProxyContext } from "@/core/tenancy/tenant-context";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const headerStore = await headers();
  const proxyContext = getProxyContext(headerStore);
  const isTenant = proxyContext.routeZone === "tenant_login" && Boolean(proxyContext.tenantId);

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl">
        <div className="mb-6">
          <span className="inline-block rounded-full bg-red-600/15 px-3 py-1 text-xs font-semibold text-red-400 border border-red-600/30">
            {isTenant
              ? "Zona 4 — Acceso Comprador de Tienda"
              : "Zona 2 — Portal de Clientes SaaS"}
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            {isTenant ? "Iniciar sesión en la tienda" : "FenixCMS — Portal SaaS"}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {isTenant
              ? `Contexto verificado de tenant (${proxyContext.tenantId})`
              : "Gestiona tus suscripciones, licencias, dominios y módulos contratados."}
          </p>
        </div>
      </div>
    </main>
  );
}

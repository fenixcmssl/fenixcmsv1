import { headers } from "next/headers";
import type { LoginContext } from "@/types";

/**
 * Ruta Universal de Acceso: /login
 * 
 * Determina en servidor si el acceso corresponde a:
 *  - "saas_customer": Clientes titulares de licencias y suscripciones SaaS.
 *  - "tenant_customer": Compradores y usuarios finales de una tienda/tenant específico.
 * 
 * La resolución se basa en el dominio y cabeceras inyectadas por el middleware de tenancy.
 */
export default async function LoginPage() {
  const headerStore = await headers();
  const contextHeader = headerStore.get("x-fenix-context") as LoginContext | null;
  const tenantId = headerStore.get("x-tenant-id");

  const isTenant = contextHeader === "tenant_customer" && !!tenantId;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500 ring-1 ring-red-500/30">
            <span className="text-2xl font-bold">F</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {isTenant ? "Acceso a la Tienda" : "Portal de Clientes FenixCMS"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {isTenant
              ? `Inicia sesión para gestionar tus compras en esta tienda.`
              : `Accede a la gestión de tus licencias, suscripciones y dominios.`}
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-4 text-xs text-zinc-400">
          <p className="font-mono text-zinc-300">
            <strong>Contexto resuelto:</strong> {isTenant ? `Tenant (${tenantId})` : "SaaS Global"}
          </p>
          <p className="mt-1">
            Ruta universal canónica <code className="text-red-400">/login</code> en espera de Fase 2 (Autenticación y Sesiones).
          </p>
        </div>
      </div>
    </div>
  );
}

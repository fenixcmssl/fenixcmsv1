/**
 * Zona 3: Administración Privada de Tenant (/admin)
 * 
 * Panel de control privado para el comerciante/propietario de la tienda o sitio.
 * Aislamiento estricto por tenant.
 */
export default function TenantAdminPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/60 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Panel de Administración</span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">Tenant</span>
          </div>
          <div className="text-xs text-zinc-400">
            Aislamiento estricto de datos
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-10">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8">
          <h1 className="text-xl font-bold text-white">Administración del Negocio</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Gestión de catálogo, productos, pedidos, inventario, blog y configuración del tenant.
          </p>
        </div>
      </main>
    </div>
  );
}

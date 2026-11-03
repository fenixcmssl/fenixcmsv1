/**
 * Zona 1: Superadministración (/superadmin)
 * 
 * Interfaz global reservada exclusivamente para la administración central de FenixCMS SaaS.
 * Estilo visual: Negro y Rojo, moderno, sin barra de búsqueda superior.
 */
export default function SuperadminPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-black-deep)] text-[var(--brand-text-primary)]">
      <header className="border-b border-[var(--brand-black-border)] bg-[var(--brand-black-surface)] px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-red)] font-bold text-white shadow-lg shadow-red-950/50">
              F
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider text-white">FENIX<span className="text-[var(--brand-red)]">CMS</span></span>
              <span className="ml-2 rounded bg-red-950/60 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-800/40">SUPERADMIN</span>
            </div>
          </div>
          <div className="text-xs text-[var(--brand-text-secondary)]">
            Fase 0: Estructura Preparada
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-10">
        <div className="rounded-xl border border-[var(--brand-black-border)] bg-[var(--brand-black-surface)] p-8">
          <h1 className="text-2xl font-bold text-white">Consola de Superadministración</h1>
          <p className="mt-2 text-sm text-[var(--brand-text-secondary)]">
            Módulo central para gobernanza de la plataforma, planes, clientes SaaS, tenants, licencias y auditoría.
          </p>
          <div className="mt-6 inline-flex items-center rounded-lg border border-[var(--brand-black-border)] bg-[var(--brand-black-card)] px-4 py-2 text-xs text-zinc-400">
            Identidad visual: Negro y Rojo configurada en tokens de marca.
          </div>
        </div>
      </main>
    </div>
  );
}

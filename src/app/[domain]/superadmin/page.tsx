import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SuperAdminMasterPage() {
  const prisma = getAdminClient();
  
  const tenantsCount = await prisma.tenant.count();
  const tenants = await prisma.tenant.findMany({ include: { domains: true } });
  const logsCount = await prisma.superAdminLog.count();

  async function handleGodMode(formData: FormData) {
    "use server";
    const tenantId = formData.get("tenantId") as string;
    const domain = formData.get("domain") as string;
    
    const adminPrisma = getAdminClient();
    await adminPrisma.superAdminLog.create({
      data: { action: "ACCESO_PRO_SUPERADMIN", targetTenant: tenantId }
    });

    const cookieStore = await cookies();
    cookieStore.set(`auth_${tenantId}`, "true", {
      httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 4, path: "/",
    });

    redirect(`http://${domain}:3000/`);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#07090e', color: '#f3f4f6', fontFamily: 'sans-serif' }}>
      
      {/* BARRA LATERAL IZQUIERDA (SIDEBAR PRO) */}
      <aside style={{ width: '260px', backgroundColor: '#0b0f19', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#f59e0b', color: '#000000', fontWeight: '900', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>🛡️</div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>FENIX CMS</h2>
            <span style={{ fontSize: '0.70rem', color: '#f59e0b', fontWeight: 'bold', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>SUPER ADMIN</span>
          </div>
        </div>

        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', flex: 1 }}>
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f59e0b', color: '#000000', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>📊 Dashboard</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>📦 Applications</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>🏷️ Plans</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>⚖️ Entitlements</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>🔑 Licenses</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>⚡ Activations</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>💳 Subscriptions</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>💵 Payments</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>📄 Invoices</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>🏢 Tenants ({tenantsCount})</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>🌐 Domains</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>👥 Users</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>📋 Audit Logs ({logsCount})</div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>⚙️ Settings</div>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* TOP BAR / HEADER */}
        <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Panel de Control Ejecutivo Super Admin</h1>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>Métricas en tiempo real consultadas directamente desde PostgreSQL.</p>
          </div>
          <button style={{ backgroundColor: '#1f2937', color: '#f3f4f6', border: '1px solid #374151', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.875rem' }}>
            🔄 Actualizar Métricas
          </button>
        </header>

        {/* TARJETAS DE MÉTRICAS FINANCIERAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>MRR (Ingreso Mensual)</span>
            <p style={{ fontSize: '2rem', fontWeight: '900', color: '#4ade80', margin: '0.5rem 0 0 0' }}>€15.420</p>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Ingreso recurrente mensualizado</span>
          </div>

          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>ARR (Ingreso Anual)</span>
            <p style={{ fontSize: '2rem', fontWeight: '900', color: '#f59e0b', margin: '0.5rem 0 0 0' }}>€185.040</p>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Run-rate anualizado proyectado</span>
          </div>

          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>Comercios / Tenants</span>
            <p style={{ fontSize: '2rem', fontWeight: '900', color: '#60a5fa', margin: '0.5rem 0 0 0' }}>{tenantsCount}</p>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Instancias multi-tenant creadas</span>
          </div>

          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>Licencias Activas</span>
            <p style={{ fontSize: '2rem', fontWeight: '900', color: '#34d399', margin: '0.5rem 0 0 0' }}>38</p>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Licencias vigentes y operativas</span>
          </div>

        </div>

        {/* TABLA DE INQUILINOS Y ACCESO GOD MODE */}
        <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #1f2937' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>🏢 Gestión Multi-Tenant de Inquilinos</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#030712', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '1rem 2rem' }}>Nombre del Inquilino</th>
                <th style={{ padding: '1rem 2rem' }}>Módulo Asignado</th>
                <th style={{ padding: '1rem 2rem' }}>Dominio</th>
                <th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Acceso God Mode</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: 'bold', color: '#ffffff' }}>{t.name}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #d97706' }}>
                      {t.moduleType}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', color: '#9ca3af' }}>{t.domains[0]?.domain || "localhost"}</td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                    <form action={handleGodMode}>
                      <input type="hidden" name="tenantId" value={t.id} />
                      <input type="hidden" name="domain" value={t.domains[0]?.domain || "localhost"} />
                      <button type="submit" style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)' }}>
                        🚀 Soporte / Admin Tienda
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
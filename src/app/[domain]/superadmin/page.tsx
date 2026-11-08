import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateGlobalBranding } from "./actions";

export default async function SuperAdminMasterPage() {
  const prisma = getAdminClient();
  const tenants = await prisma.tenant.findMany({
    include: { domains: true },
  });

  const logs = await prisma.superAdminLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  async function handleGodMode(formData: FormData) {
    "use server";
    const tenantId = formData.get("tenantId") as string;
    const domain = formData.get("domain") as string;
    
    const adminPrisma = getAdminClient();
    await adminPrisma.superAdminLog.create({
      data: { action: "ACCESO_TOTAL_SUPERADMIN", targetTenant: tenantId }
    });

    const cookieStore = await cookies();
    cookieStore.set(`auth_${tenantId}`, "true", {
      httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 4, path: "/",
    });

    redirect(`http://${domain}:3000/`);
  }

  const cacheBuster = Date.now();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#f3f4f6', padding: '2.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '85rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* CABECERA MAESTRA */}
        <header style={{ backgroundColor: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ height: '4rem', padding: '0.5rem', backgroundColor: '#030712', borderRadius: '0.75rem', border: '1px solid #374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={`/global-logo.png?v=${cacheBuster}`} alt="FenixCMS" style={{ maxHeight: '100%', maxWidth: '200px', objectFit: 'contain' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Centro de Control Maestro (God Mode)</h1>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>Gestión unificada global de todos los inquilinos y módulos del SaaS.</p>
            </div>
          </div>
          <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold', border: '1px solid #ef4444' }}>
            🔒 Acceso Global Autorizado
          </span>
        </header>

        {/* FORMULARIO DE BRANDING Y CONFIGURACIÓN */}
        <div style={{ backgroundColor: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1rem' }}>🎨 Identidad Visual Global</h2>
          <form action={updateGlobalBranding} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Logo Principal del Panel</label>
              <input type="file" name="logo" accept="image/*" style={{ width: '100%', color: '#9ca3af', backgroundColor: '#030712', border: '1px solid #374151', padding: '0.5rem', borderRadius: '0.5rem' }} />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Favicon Global (.ico / .png)</label>
              <input type="file" name="favicon" accept=".ico,image/png" style={{ width: '100%', color: '#9ca3af', backgroundColor: '#030712', border: '1px solid #374151', padding: '0.5rem', borderRadius: '0.5rem' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Actualizar Identidad
            </button>
          </form>
        </div>

        {/* TABLA GLOBAL DE INQUILINOS */}
        <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #1f2937' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>🏢 Inquilinos (Tenants) Registrados en el Sistema</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#030712', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '1rem 2rem' }}>Nombre del Inquilino</th>
                <th style={{ padding: '1rem 2rem' }}>Módulo de Negocio</th>
                <th style={{ padding: '1rem 2rem' }}>Dominio Asignado</th>
                <th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Control Total (God Mode)</th>
              </tr>
            </thead>
            <tbody style={{ divideStyle: 'solid', divideColor: '#1f2937' }}>
              {tenants.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: 'bold', color: '#ffffff' }}>{t.name}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)', color: '#93c5fd', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #1d4ed8' }}>
                      {t.moduleType}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', color: '#9ca3af' }}>{t.domains[0]?.domain || "localhost"}</td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                    <form action={handleGodMode}>
                      <input type="hidden" name="tenantId" value={t.id} />
                      <input type="hidden" name="domain" value={t.domains[0]?.domain || "localhost"} />
                      <button type="submit" style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)' }}>
                        🚀 Gestionar como Superadmin
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
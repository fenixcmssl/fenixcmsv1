// @ts-nocheck
import { getTenantClient } from "@/lib/prisma";

export default async function TiendaInmobiliariaView({ tenant }: { tenant: any }) {
  const tenantPrisma = getTenantClient(tenant.id);
  let properties = [];
  try {
    properties = await tenantPrisma.property.findMany({
      take: 10,
      orderBy: { createdAt: "desc" }
    });
  } catch (e) {
    console.error("Error al cargar propiedades:", e);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fbbf24' }}>{tenant.name} - Inmobiliaria Exclusiva</h1>
        <span style={{ backgroundColor: 'rgba(180, 83, 9, 0.3)', color: '#fcd34d', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', border: '1px solid #d97706' }}>Modo Inmobiliario</span>
      </header>

      <main style={{ maxWidth: '80rem', margin: '3rem auto 0' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f1f5f9' }}>🏠 Propiedades Disponibles</h2>
        
        {properties.length === 0 ? (
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '3rem', borderRadius: '1rem', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '1.125rem' }}>No hay propiedades listadas en este momento.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {properties.map((prop: any) => (
              <div key={prop.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ height: '12rem', backgroundColor: '#1e293b', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  {prop.image ? <img src={prop.image} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>Sin Imagen</span>}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ffffff' }}>{prop.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>{prop.location || 'Ubicación estándar'}</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fbbf24' }}>
                    {Number(prop.price).toFixed(2)} {tenant.currency || 'EUR'}
                  </span>
                  <button style={{ backgroundColor: '#d97706', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    Consultar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
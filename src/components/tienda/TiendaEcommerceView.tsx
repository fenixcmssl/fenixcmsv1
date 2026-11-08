import { getTenantClient } from "@/lib/prisma";

export default async function TiendaEcommerceView({ tenant }: { tenant: any }) {
  // Obtenemos el cliente de base de datos específico para este inquilino (aislado por esquema/tenantId)
  const tenantPrisma = getTenantClient(tenant.id);
  
  // Consultamos los productos reales de la base de datos
  let products = [];
  try {
    products = await tenantPrisma.product.findMany({
      take: 10,
      orderBy: { createdAt: "desc" }
    });
  } catch (e) {
    console.error("Error al cargar productos del tenant:", e);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#f3f4f6', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #1f2937' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#60a5fa' }}>{tenant.name} - Tienda Online</h1>
        <span style={{ backgroundColor: 'rgba(30, 58, 138, 0.5)', color: '#93c5fd', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', border: '1px solid #1d4ed8' }}>Modo E-Commerce</span>
      </header>

      <main style={{ maxWidth: '80rem', margin: '3rem auto 0' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#e5e7eb' }}>📦 Catálogo de Productos</h2>
        
        {products.length === 0 ? (
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '3rem', borderRadius: '1rem', textAlign: 'center', color: '#9ca3af' }}>
            <p style={{ fontSize: '1.125rem' }}>No hay productos registrados todavía en este catálogo.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Entra al panel de Superadmin y accede como Admin para agregar tu primer producto.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {products.map((p: any) => (
              <div key={p.id} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '12rem', backgroundColor: '#1f2937', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', overflow: 'hidden' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>Sin Imagen</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ffffff' }}>{p.name}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>{p.description || 'Sin descripción disponible.'}</p>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#4ade80' }}>
                    {Number(p.price).toFixed(2)} {tenant.currency || 'EUR'}
                  </span>
                  <button style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    Ver Detalles
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
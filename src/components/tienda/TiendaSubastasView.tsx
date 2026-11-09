// @ts-nocheck
import { getTenantClient } from "@/lib/prisma";

export default async function TiendaSubastasView({ tenant }: { tenant: any }) {
  const tenantPrisma = getTenantClient(tenant.id);
  let auctions = [];
  try {
    auctions = await tenantPrisma.auctionItem.findMany({
      take: 10,
      orderBy: { createdAt: "desc" }
    });
  } catch (e) {
    console.error("Error al cargar subastas:", e);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fafafa', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #27272a' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#c084fc' }}>{tenant.name} - Sala de Subastas</h1>
        <span style={{ backgroundColor: 'rgba(107, 33, 168, 0.3)', color: '#d8b4fe', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', border: '1px solid #9333ea' }}>Modo Subasta</span>
      </header>

      <main style={{ maxWidth: '80rem', margin: '3rem auto 0' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f4f4f5' }}>⚡ Lotes en Puja Activa</h2>
        
        {auctions.length === 0 ? (
          <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '3rem', borderRadius: '1rem', textAlign: 'center', color: '#a1a1aa' }}>
            <p style={{ fontSize: '1.125rem' }}>No hay subastas activas en este momento.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {auctions.map((auc: any) => (
              <div key={auc.id} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ height: '12rem', backgroundColor: '#27272a', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>
                  {auc.image ? <img src={auc.image} alt={auc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>Sin Imagen</span>}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ffffff' }}>{auc.title}</h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginTop: '0.25rem' }}>Puja actual registrada.</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#c084fc' }}>
                    {Number(auc.currentBid || auc.startPrice || 0).toFixed(2)} {tenant.currency || 'EUR'}
                  </span>
                  <button style={{ backgroundColor: '#9333ea', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    Pujar Ahora
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
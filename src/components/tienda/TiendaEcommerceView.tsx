export default function TiendaEcommerceView({ tenant }: { tenant: any }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#f3f4f6', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #1f2937' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#60a5fa' }}>{tenant.name} - Tienda Online</h1>
        <span style={{ backgroundColor: 'rgba(30, 58, 138, 0.5)', color: '#93c5fd', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', border: '1px solid #1d4ed8' }}>Modo E-Commerce</span>
      </header>
      <main style={{ maxWidth: '80rem', margin: '3rem auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ height: '12rem', backgroundColor: '#1f2937', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Sin Imagen</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Producto de Demostración</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25srem' }}>Catálogo sincronizado desde FenixCMS.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#4ade80' }}>0.00 {tenant.currency || 'EUR'}</span>
            <button style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 'bold', cursor: 'pointer' }}>Ver Detalles</button>
          </div>
        </div>
      </main>
    </div>
  );
}
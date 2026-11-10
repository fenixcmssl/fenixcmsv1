import Link from "next/link";
import PaypalCheckout from "@/components/PaypalCheckout";

export default function GlobalLandingPage() {
  return (
    <div style={{ backgroundColor: '#07090e', color: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVEGACIÓN */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 4rem', borderBottom: '1px solid #1f2937', backgroundColor: '#0b0f19' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#f59e0b', color: '#000', fontWeight: '900', padding: '0.5rem', borderRadius: '0.5rem', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '0.05em' }}>FENIX CMS</h1>
        </div>
        <div>
          <Link href="/superadmin/login">
            <button style={{ backgroundColor: 'transparent', color: '#d1d5db', border: '1px solid #374151', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', marginRight: '1rem' }}>
              Acceso SuperAdmin
            </button>
          </Link>
          <Link href="/login">
            <button style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Login Tiendas
            </button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <main style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Lanza tu E-commerce Pro <br/><span style={{ color: '#f59e0b' }}>en cuestión de minutos</span>
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
          Plataforma multi-tenant de alto rendimiento. Selecciona tu plan, realiza el pago seguro y obtén tu tienda desplegada instantáneamente.
        </p>

        {/* TABLA DE PRECIOS CON PAYPAL */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
          
          {/* PLAN 1 */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '1rem', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: '0 0 0.5rem 0' }}>Starter Merchant</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>Ideal para emprendedores y nuevos negocios.</p>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', marginBottom: '1.5rem' }}>
              €29<span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 'normal' }}>/mes</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#d1d5db', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>✓ Hasta 100 productos</li>
              <li>✓ Subdominio gratuito (.fenixcms.es)</li>
              <li>✓ Soporte por email</li>
              <li>✓ Pasarelas de pago básicas</li>
            </ul>
            <div style={{ marginTop: 'auto' }}>
              <PaypalCheckout planName="Starter Merchant" price="29.00" />
            </div>
          </div>

          {/* PLAN 2 (DESTACADO) */}
          <div style={{ backgroundColor: '#111827', border: '2px solid #3b82f6', borderRadius: '1rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', transform: 'scale(1.05)' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#3b82f6', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 1rem', borderRadius: '9999px' }}>
              MÁS POPULAR
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: '0 0 0.5rem 0' }}>Professional Store</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>Para negocios en crecimiento y alto tráfico.</p>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', marginBottom: '1.5rem' }}>
              €79<span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 'normal' }}>/mes</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#d1d5db', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>✓ Productos ilimitados</li>
              <li>✓ Conexión de Dominio Propio</li>
              <li>✓ Soporte prioritario 24/7</li>
              <li>✓ API y Webhooks avanzados</li>
            </ul>
            <div style={{ marginTop: 'auto' }}>
              <PaypalCheckout planName="Professional Store" price="79.00" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

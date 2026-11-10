"use client";
import Link from 'next/link';

export default function LandingPage() {
  const handleScroll = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: '#07090e', color: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* NAVEGACIÓN SUPERIOR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 5%', backgroundColor: 'rgba(11, 15, 25, 0.9)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#f59e0b', color: '#000', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '0.05em' }}>FENIX CMS</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/" onClick={(e) => handleScroll(e, 'caracteristicas')} style={{ color: '#d1d5db', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer' }}>Características</a>
          <a href="/" onClick={(e) => handleScroll(e, 'planes')} style={{ color: '#d1d5db', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer' }}>Planes y Precios</a>
          <Link href="/superadmin/login">
            <button style={{ backgroundColor: '#1f2937', color: '#fff', border: '1px solid #374151', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
              Acceso Clientes
            </button>
          </Link>
          <button onClick={(e) => handleScroll(e, 'planes')} style={{ backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)' }}>
            Comenzar Ahora
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header style={{ padding: '8rem 5%', textAlign: 'center', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(31, 41, 55, 0.6) 0%, transparent 70%)' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
          Escala tu negocio con el motor <span style={{ color: '#f59e0b' }}>SaaS Multi-Tenant</span> definitivo.
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#9ca3af', maxWidth: '700px', margin: '1.5rem auto 3rem auto', lineHeight: '1.6' }}>
          Despliega tiendas online, plataformas inmobiliarias y sistemas de subastas en segundos. Arquitectura de bases de datos independientes, máxima velocidad con Next.js 16 y seguridad nivel empresarial.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={(e) => handleScroll(e, 'planes')} style={{ backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)' }}>
            Ver Planes y Licencias
          </button>
          <button onClick={(e) => handleScroll(e, 'caracteristicas')} style={{ backgroundColor: '#111827', color: '#fff', border: '1px solid #374151', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Descubrir Motor
          </button>
        </div>
      </header>

      {/* CARACTERÍSTICAS */}
      <section id="caracteristicas" style={{ padding: '6rem 5%', backgroundColor: '#0b0f19' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Tecnología de Vanguardia</h2>
          <p style={{ color: '#9ca3af', marginTop: '1rem' }}>Todo lo que necesitas para operar múltiples negocios desde un solo núcleo.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid #1f2937' }}>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: '50px', height: '50px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Bases de Datos Aisladas</h3>
            <p style={{ color: '#9ca3af', lineHeight: '1.5', fontSize: '0.875rem' }}>Cada cliente (Tenant) opera en su propia tabla PostgreSQL. Máxima seguridad, cumplimiento RGPD y cero filtraciones entre tiendas.</p>
          </div>
          <div style={{ backgroundColor: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid #1f2937' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '50px', height: '50px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Multi-Idioma Nativo</h3>
            <p style={{ color: '#9ca3af', lineHeight: '1.5', fontSize: '0.875rem' }}>Motor de internacionalización integrado por Cookies. Vende en España, Reino Unido, Francia, Italia, Portugal y Alemania sin duplicar código.</p>
          </div>
          <div style={{ backgroundColor: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid #1f2937' }}>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: '50px', height: '50px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Rendimiento Turbopack</h3>
            <p style={{ color: '#9ca3af', lineHeight: '1.5', fontSize: '0.875rem' }}>Construido sobre Next.js 16 con renderizado híbrido. Tiempos de carga ultrarrápidos para maximizar tus conversiones y SEO.</p>
          </div>
        </div>
      </section>

      {/* PLANES Y PRECIOS */}
      <section id="planes" style={{ padding: '6rem 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Licencias Transparentes</h2>
          <p style={{ color: '#9ca3af', marginTop: '1rem' }}>Elige el plan que mejor se adapte al tamaño de tu negocio.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ flex: '1 1 300px', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '1rem', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Starter Merchant</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem', minHeight: '40px' }}>Ideal para emprendedores y nuevas tiendas.</p>
            <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '3rem', fontWeight: '900' }}>€29</span><span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>/mes</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> 1 Instancia de Tienda</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Hasta 500 productos</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> 2 Idiomas activos</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Soporte por Email</li>
            </ul>
            <button style={{ width: '100%', backgroundColor: '#1f2937', color: '#fff', border: '1px solid #374151', padding: '1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Contratar Starter</button>
          </div>
          <div style={{ flex: '1 1 300px', backgroundColor: '#07090e', border: '2px solid #f59e0b', borderRadius: '1rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', transform: 'scale(1.05)', zIndex: 10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#f59e0b', color: '#000', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase' }}>Más Popular</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>Professional Store</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem', minHeight: '40px' }}>Para negocios en crecimiento y consolidación.</p>
            <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '3rem', fontWeight: '900' }}>€79</span><span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>/mes</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#f59e0b' }}>✓</span> Instancias Ilimitadas</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#f59e0b' }}>✓</span> Productos Ilimitados</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#f59e0b' }}>✓</span> 6 Idiomas simultáneos</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#f59e0b' }}>✓</span> Motor de Inmobiliaria y Subastas</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#f59e0b' }}>✓</span> Soporte Prioritario 24/7</li>
            </ul>
            <button style={{ width: '100%', backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '1rem', borderRadius: '0.5rem', fontWeight: '900', cursor: 'pointer' }}>Contratar Pro</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0b0f19', borderTop: '1px solid #1f2937', padding: '3rem 5%', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ backgroundColor: '#f59e0b', color: '#000', padding: '0.25rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span style={{ fontWeight: 'bold', color: '#d1d5db' }}>FENIX CMS S.L.</span>
        </div>
        <p>© 2026 FenixCMS. Todos los derechos reservados. Desarrollado en España para el mundo.</p>
      </footer>
    </div>
  );
}

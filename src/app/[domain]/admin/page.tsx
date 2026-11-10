import { getAdminClient } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function TenantAdminDashboard({ params }: any) {
  // Soporte universal para Next.js 14 (objeto sincrónico) y 15 (promesa)
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);
  const prisma = getAdminClient();

  // Buscar a qué Tenant (Tienda) pertenece este dominio
  const domainRecord = await prisma.tenantDomain.findUnique({
    where: { domain: domain },
    include: { tenant: true }
  });

  if (!domainRecord || !domainRecord.tenant) {
    return notFound();
  }

  const tenant = domainRecord.tenant;

  // Verificación básica de sesión (cookie)
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tenant_session")?.value;
  
  if (!sessionId || sessionId !== tenant.id) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#07090e', color: '#f3f4f6', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', backgroundColor: '#111827', padding: '3rem', borderRadius: '1rem', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#ef4444' }}>Acceso Denegado</h2>
          <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Debes iniciar sesión para acceder al panel de esta tienda.</p>
          <Link href="/login">
            <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Ir al Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Si está logueado, mostrar el Dashboard real
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#07090e', color: '#f3f4f6', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR DEL CLIENTE */}
      <aside style={{ width: '250px', backgroundColor: '#111827', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#3b82f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
            {tenant.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {tenant.name}
          </div>
        </div>
        
        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>
            Inicio (Dashboard)
          </div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer' }}>
            Catálogo de Productos
          </div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer' }}>
            Ventas y Pedidos
          </div>
          <div style={{ padding: '0.75rem 1rem', color: '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer' }}>
            Ajustes de Tienda
          </div>
        </nav>
        
        <div style={{ marginTop: 'auto', padding: '1.5rem 1rem', borderTop: '1px solid #1f2937' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Suscripción</div>
          <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.875rem' }}>Plan Activo</div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', margin: '0 0 0.5rem 0' }}>¡Bienvenido a tu panel, {tenant.name}!</h1>
            <p style={{ color: '#9ca3af', margin: 0 }}>Gestiona tu catálogo, ventas y configuración desde aquí.</p>
          </div>
          <Link href={`http://${domain}`} target="_blank">
            <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#111827', color: '#3b82f6', border: '1px solid #1f2937', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Ver mi Tienda Online
            </button>
          </Link>
        </header>

        {/* MÉTRICAS RÁPIDAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #1f2937' }}>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Ventas del Mes</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>€0.00</div>
          </div>
          <div style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #1f2937' }}>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pedidos Pendientes</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>0</div>
          </div>
          <div style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #1f2937' }}>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Productos Activos</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>0</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#111827', padding: '3rem', borderRadius: '1rem', border: '1px dashed #374151', textAlign: 'center', marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>Tu tienda está vacía</h3>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Empieza añadiendo tu primer producto al catálogo para que tus clientes puedan comprar.</p>
          <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
            + Añadir Producto
          </button>
        </div>
      </main>
    </div>
  );
}

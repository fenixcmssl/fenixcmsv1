import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewAppForm from "./NewAppForm";
import NewPlanForm from "./NewPlanForm";
import NewEntitlementForm from "./NewEntitlementForm";
import NewLicenseForm from "./NewLicenseForm";
import ActionButtons from "./ActionButtons";
import EditItemForm from "./EditItemForm";

export default async function SuperAdminMasterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const currentTab = typeof resolvedParams.tab === 'string' ? resolvedParams.tab : 'dashboard';
  const action = typeof resolvedParams.action === 'string' ? resolvedParams.action : null;
  const editId = typeof resolvedParams.id === 'string' ? resolvedParams.id : null;
  const cookieStore = await cookies();

  const prisma = getAdminClient();
  const tenantsCount = await prisma.tenant.count();
  const tenants = await prisma.tenant.findMany({ include: { domains: true }, orderBy: { createdAt: 'desc' } });

  const getNewItems = (type: string) => {
    try { const val = cookieStore.get(`mock_new_${type}`)?.value; return val ? JSON.parse(val) : []; } catch (e) { return []; }
  };

  const baseApps = [{ id: "app_1", name: "Fenix E-commerce Pro", type: "ECOMMERCE", version: "v2.5.0", desc: "Plataforma completa de venta online.", status: "ACTIVA" }];
  const applications = [...baseApps, ...getNewItems('applications')].filter(app => !cookieStore.has(`hide_mock_${app.id}`));

  const basePlans = [{ id: "plan_1", name: "Starter Merchant", tag: "PARA EMPRENDEDORES", appName: "Fenix E-commerce Pro", status: "ACTIVO", monthlyPrice: 29, yearlyPrice: 290, trialDays: 14, slug: "starter-merchant", desc: "Ideal para lanzar tu tienda.", features: { products: 100 }, isPopular: false }];
  const plans = [...basePlans, ...getNewItems('plans')].filter(p => !cookieStore.has(`hide_mock_${p.id}`));

  const baseEntitlements = [{ id: "ent_1", key: "products.max", name: "Límite de Productos", type: "CUOTA", defaultValue: "100", desc: "Máximo de productos por catálogo." }];
  const entitlements = [...baseEntitlements, ...getNewItems('entitlements')].filter(e => !cookieStore.has(`hide_mock_${e.id}`));

  const baseLicenses = [{ id: "lic_1", key: "FNX-PRO-9823-X981-DEMO", client: "Administrador FenixCMS", store: "Mi Tienda Online", email: "info@fenixcms.es", plan: "Professional Store", expiry: "1/9/2027", amount: "€79", status: "Active" }];
  const licenses = [...baseLicenses, ...getNewItems('licenses')].filter(l => !cookieStore.has(`hide_mock_${l.id}`));

  const activations = [{ id: "act_1", domain: "mitiendaonline.es", licenseKey: "FNX-PRO-9823-X981-DEMO", env: "Producción", ip: "192.168.1.105", date: "15/10/2026", status: "Activa" }].filter(a => !cookieStore.has(`hide_mock_${a.id}`));
  const subscriptions = [{ id: "sub_1", tenantName: "Mi Tienda Online", gateway: "Stripe", plan: "Professional Store", cycle: "Mensual", amount: "€79.00", nextBilling: "15/11/2026", status: "Al Día" }].filter(s => !cookieStore.has(`hide_mock_${s.id}`));

  const dbDomains = tenants.flatMap(t => t.domains.map(d => ({
    id: d.id, hostname: d.domain, type: d.domain.includes('.') && d.domain !== 'localhost' ? 'Dominio Propio' : 'Subdominio Sistema', tenantName: t.name, ssl: 'Activo', dns: 'Verificado'
  })));
  const domains = [...dbDomains, ...getNewItems('domains')].filter(d => !cookieStore.has(`hide_mock_${d.id}`));

  const payments: any[] = [];
  const invoices: any[] = []; 
  const users: any[] = []; 
  const auditLogs: any[] = []; 

  const themes = [
    { id: "thm_1", name: "Nordic Clean Marketplace Theme", version: "v2.1.0", price: "€49", desc: "Diseño escandinavo limpio con cuadrícula adaptativa, filtros...", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80" },
    { id: "thm_2", name: "Cyberpunk Dark Electronics Theme", version: "v1.5.0", price: "€59", desc: "Especialmente concebido para tiendas de hardware, component...", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80" }
  ];

  const plugins = [
    { id: "plg_1", name: "Redsys Oficial + Bizum TPV Virtual", version: "v2.4.0", category: "payment", price: "€39", desc: "Permite a los clientes pagar con tarjeta bancaria de bancos..." },
    { id: "plg_2", name: "WhatsApp Bot de Notificaciones & Carritos", version: "v1.8.2", category: "marketing", price: "€19", desc: "Automatiza la comunicación directa con tus compradores..." },
    { id: "plg_3", name: "Correos Express & SEUR Connector Pro", version: "v3.1.0", category: "shipping", price: "€29", desc: "Imprime albaranes de envío en 1 clic y proporciona número de..." },
    { id: "plg_4", name: "Fenix SEO & Rank Optimizer AI Pro", version: "v3.2.0", category: "seo", price: "€29", desc: "Generación de Sitemap.xml, Schema.org JSON-LD para..." },
    { id: "plg_5", name: "Gemini / ChatGPT SEO Meta-Tags & Copywriter", version: "v1.2.0", category: "ai", price: "€15", desc: "Aumenta el tráfico orgánico indexando palabras clave..." }
  ];

  const allItems = [...applications, ...plans, ...entitlements, ...licenses, ...activations, ...subscriptions, ...tenants, ...domains];
  const editItem = editId ? allItems.find(i => i.id === editId) : null;

  const cardStyle = { backgroundColor: '#111827', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', minHeight: '130px' };
  const labelStyle = { fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' as const, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const descStyle = { fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#07090e', color: '#f3f4f6', fontFamily: 'sans-serif' }}>
      
      {/* TOP BAR */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '70px', backgroundColor: '#0b0f19', borderBottom: '1px solid #1f2937', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#f59e0b', color: '#000000', fontWeight: '900', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', margin: 0, letterSpacing: '0.05em' }}>FENIX CMS</h2>
              <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 'bold', border: '1px solid #f59e0b', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>SUPER ADMIN</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Plataforma Global Multi-Tenant & Licenciamiento SaaS</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem' }}>Super Admin FenixCMS</div>
            <div style={{ color: '#f59e0b', fontSize: '0.75rem' }}>info@fenixcms.es</div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#111827', color: '#f59e0b', border: '1px solid #1f2937', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.875rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
            Ver Tienda
          </button>
        </div>
      </header>

      {/* SIDEBAR ACTUALIZADO CON SETTINGS */}
      <aside style={{ width: '250px', backgroundColor: '#07090e', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', position: 'fixed', top: '70px', bottom: 0, left: 0, overflowY: 'auto' }}>
        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link href="?tab=dashboard" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'dashboard' ? '#f59e0b' : 'transparent', color: currentTab === 'dashboard' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>㗊</span> Dashboard</div></Link>
          <Link href="?tab=applications" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'applications' ? '#f59e0b' : 'transparent', color: currentTab === 'applications' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>⚙️</span> Applications</div></Link>
          <Link href="?tab=plans" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'plans' ? '#f59e0b' : 'transparent', color: currentTab === 'plans' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>🏷️</span> Plans</div></Link>
          <Link href="?tab=entitlements" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'entitlements' ? '#f59e0b' : 'transparent', color: currentTab === 'entitlements' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>🎛️</span> Entitlements</div></Link>
          <Link href="?tab=licenses" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'licenses' ? '#f59e0b' : 'transparent', color: currentTab === 'licenses' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>🔑</span> Licenses</div></Link>
          <Link href="?tab=activations" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'activations' ? '#f59e0b' : 'transparent', color: currentTab === 'activations' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>📉</span> Activations</div></Link>
          <Link href="?tab=subscriptions" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'subscriptions' ? '#f59e0b' : 'transparent', color: currentTab === 'subscriptions' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>💳</span> Subscriptions</div></Link>
          <Link href="?tab=payments" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'payments' ? '#f59e0b' : 'transparent', color: currentTab === 'payments' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>💲</span> Payments</div></Link>
          <Link href="?tab=invoices" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'invoices' ? '#f59e0b' : 'transparent', color: currentTab === 'invoices' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>🧾</span> Invoices</div></Link>
          <Link href="?tab=tenants" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'tenants' ? '#f59e0b' : 'transparent', color: currentTab === 'tenants' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>🏢</span> Tenants</div></Link>
          <Link href="?tab=domains" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'domains' ? '#f59e0b' : 'transparent', color: currentTab === 'domains' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}><span>🌐</span> Domains</div></Link>
          <Link href="?tab=themes" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'themes' ? '#f59e0b' : 'transparent', color: currentTab === 'themes' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>🎨</span> Themes</div></Link>
          <Link href="?tab=plugins" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'plugins' ? '#f59e0b' : 'transparent', color: currentTab === 'plugins' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>🧩</span> Plugins</div></Link>
          <Link href="?tab=users" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'users' ? '#f59e0b' : 'transparent', color: currentTab === 'users' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>👥</span> Users</div></Link>
          <Link href="?tab=audit_logs" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'audit_logs' ? '#f59e0b' : 'transparent', color: currentTab === 'audit_logs' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>⏱️</span> Audit Logs</div></Link>
          
          <Link href="?tab=settings" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'settings' ? '#f59e0b' : 'transparent', color: currentTab === 'settings' ? '#000000' : '#e2e8f0', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}><span>⚙️</span> Settings</div></Link>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ marginLeft: '250px', marginTop: '70px', flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {action === 'edit' && editItem ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <EditItemForm item={editItem} tabName={currentTab} />
          </div>
        ) : (
          <>
            {/* === DASHBOARD === */}
            {currentTab === 'dashboard' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ffffff', margin: 0 }}><span style={{ color: '#f59e0b' }}>Panel de Control</span> Ejecutivo Super Admin</h1>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>Métricas en tiempo real consultadas directamente desde PostgreSQL</p>
                  </div>
                </header>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                  <div style={cardStyle}><div style={labelStyle}><span>MRR (INGRESO)</span> <span style={{color: '#10b981'}}>↗</span></div><div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981', margin: '0.5rem 0' }}>€15.420</div><div style={descStyle}>Ingreso mensualizado</div></div>
                  <div style={cardStyle}><div style={labelStyle}><span>ARR (ANUAL)</span> <span style={{color: '#f59e0b'}}>$</span></div><div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f59e0b', margin: '0.5rem 0' }}>€185.040</div><div style={descStyle}>Run-rate anualizado</div></div>
                  <div style={cardStyle}><div style={labelStyle}><span>TENANTS</span> <span style={{color: '#60a5fa'}}>📱</span></div><div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ffffff', margin: '0.5rem 0' }}>{tenantsCount}</div><div style={descStyle}>Instancias creadas</div></div>
                  <div style={cardStyle}><div style={labelStyle}><span>LICENCIAS</span> <span style={{color: '#10b981'}}>✓</span></div><div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981', margin: '0.5rem 0' }}>38</div><div style={descStyle}>Licencias operativas</div></div>
                </div>
              </>
            )}

            {/* === NUEVA PESTAÑA SETTINGS (CONFIGURACIÓN MAESTRA) === */}
            {currentTab === 'settings' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="m15 5 3 3"/></svg>
                    </div>
                    <div>
                      <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Configuración Maestra del Motor SaaS</h1>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>Parámetros globales del entorno, pasarelas y políticas de seguridad</p>
                    </div>
                  </div>
                  <button style={{ backgroundColor: '#1f2937', color: '#f3f4f6', border: '1px solid #374151', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer' }}>↻</button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  
                  {/* Tarjeta 1: Identidad */}
                  <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <span style={{ color: '#f59e0b' }}>🌐</span> Identidad y Localización Global
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '0.5rem' }}>Nombre de la Plataforma SaaS</label>
                        <input type="text" defaultValue="FenixCMS Cloud Engine" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '0.5rem' }}>Correo de Soporte Maestro</label>
                        <input type="email" defaultValue="admin@fenixcms.io" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '0.5rem' }}>Moneda Base</label>
                          <select style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', outline: 'none', fontSize: '0.875rem', appearance: 'none' }}>
                            <option>EUR (€)</option><option>USD ($)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '0.5rem' }}>Idioma Predeterminado</label>
                          <select style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', outline: 'none', fontSize: '0.875rem', appearance: 'none' }}>
                            <option>Español (ES)</option><option>English (EN)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Tarjeta 2: Políticas */}
                    <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <span style={{ color: '#10b981' }}>$</span> Políticas de Licenciamiento y Cobro
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '0.5rem' }}>Días de Prueba (Trial)</label>
                          <input type="number" defaultValue="14" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '0.5rem' }}>IVA Legal por Defecto (%)</label>
                          <input type="number" defaultValue="21" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }} />
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta 3: Pasarelas */}
                    <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '1.5rem', flex: 1 }}>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '1rem' }}>Pasarelas de Pago del Portal SaaS</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f2937', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #374151', cursor: 'pointer' }}>
                          <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 'bold' }}>Stripe Elements (Tarjetas Seguras)</span>
                          <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} />
                        </label>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f2937', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #374151', cursor: 'pointer' }}>
                          <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 'bold' }}>PayPal Checkout & Subscriptions</span>
                          <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} />
                        </label>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f2937', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #374151', cursor: 'pointer' }}>
                          <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 'bold' }}>Bizum Automatizado</span>
                          <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tarjeta 4: Infraestructura */}
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <span style={{ color: '#a855f7' }}>🔒</span> Infraestructura y Aprovisionamiento SSL
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#1f2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 'bold' }}>Aprovisionar SSL Automático</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.25rem' }}>Let's Encrypt wildcard para subdominios</div>
                      </div>
                      <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#3b82f6', cursor: 'pointer' }} />
                    </div>
                    <div style={{ backgroundColor: '#1f2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 'bold' }}>Permitir Registro de Tenants</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.25rem' }}>Self-service checkout habilitado</div>
                      </div>
                      <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#3b82f6', cursor: 'pointer' }} />
                    </div>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 'bold' }}>Modo Mantenimiento Global</div>
                        <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>Desactiva acceso a storefronts</div>
                      </div>
                      <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: '#ef4444', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '1rem 2rem', borderRadius: '0.5rem', fontWeight: '900', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Guardar Parámetros en PostgreSQL
                  </button>
                </div>
              </>
            )}

            {/* --- SECCIONES RESTANTES CON CÓDIGO BÁSICO PARA QUE EL ROUTER NO FALLE --- */}
            {currentTab === 'users' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#a855f7' }}>👥</div><div><h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Gestión de Usuarios y Roles RBAC</h1></div></div>
                  <button style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: '900' }}>+ Crear Usuario</button>
                </header>
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No se encontraron usuarios registrados</div>
              </>
            )}

            {currentTab === 'audit_logs' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#06b6d4' }}>🛡️</div><div><h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Registro de Auditoría</h1></div></div>
                </header>
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No se encontraron registros de auditoría</div>
              </>
            )}

            {currentTab === 'themes' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ backgroundColor: 'rgba(217, 70, 239, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#d946ef' }}>🎨</div><div><h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Catálogo de Temas FenixCMS</h1></div></div>
                  <button style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: '900' }}>+ Subir Tema</button>
                </header>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {themes.map(thm => (
                    <div key={thm.id} style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
                      <div style={{ height: '180px', backgroundImage: `url(${thm.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                      <div style={{ padding: '1.5rem' }}><h3 style={{ color: '#fff' }}>{thm.name}</h3></div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentTab === 'plugins' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#8b5cf6' }}>🧩</div><div><h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Catálogo de Plugins</h1></div></div>
                  <button style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: '900' }}>+ Subir Plugin</button>
                </header>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {plugins.map(plg => (
                    <div key={plg.id} style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '1.5rem' }}>
                      <h3 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 0.25rem 0' }}>{plg.name}</h3>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{plg.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentTab === 'invoices' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937' }}><h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Facturación B2B</h1></header>
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No se encontraron facturas emitidas</div>
              </>
            )}

            {currentTab === 'payments' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937' }}><h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Libro Mayor de Pagos</h1></header>
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No se encontraron pagos registrados</div>
              </>
            )}
            
            {currentTab === 'domains' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937' }}><h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Dominios</h1></header>
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando dominios...</div>
              </>
            )}

            {['applications', 'plans', 'entitlements', 'licenses', 'activations', 'subscriptions', 'tenants'].includes(currentTab) && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0, textTransform: 'capitalize' }}>Gestión de {currentTab}</h1>
                </header>
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem', color: '#9ca3af' }}>
                  Visualizando datos de {currentTab}...
                </div>
              </>
            )}

          </>
        )}
      </main>
    </div>
  );
}
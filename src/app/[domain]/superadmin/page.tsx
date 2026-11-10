// @ts-nocheck
import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewAppForm from "./NewAppForm";
import NewPlanForm from "./NewPlanForm";
import NewEntitlementForm from "./NewEntitlementForm";
import NewLicenseForm from "./NewLicenseForm";
import EditItemForm from "./EditItemForm";
import { updateSuperAdminPassword } from './accountActions';

export default async function SuperAdminMasterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const currentTab = typeof resolvedParams.tab === 'string' ? resolvedParams.tab : 'dashboard';
  const action = typeof resolvedParams.action === 'string' ? resolvedParams.action : null;
  const editId = typeof resolvedParams.id === 'string' ? resolvedParams.id : null;
  const msg = typeof resolvedParams.msg === 'string' ? resolvedParams.msg : null;
  const cookieStore = await cookies();

  const prisma = getAdminClient();
  const tenantsCount = await prisma.tenant.count();
  const tenants = await prisma.tenant.findMany({ include: { tenantDomains: true }, orderBy: { createdAt: 'desc' } });

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

  const dbDomains = tenants.flatMap(t => t.tenantDomains.map(d => ({
    id: d.id, hostname: d.domain, type: d.domain.includes('.') && d.domain !== 'localhost' ? 'Dominio Propio' : 'Subdominio Sistema', tenantName: t.name, ssl: 'Activo', dns: 'Verificado'
  })));
  const domains = [...dbDomains, ...getNewItems('domains')].filter(d => !cookieStore.has(`hide_mock_${d.id}`));

  const allItems = [...applications, ...plans, ...entitlements, ...licenses, ...activations, ...subscriptions, ...tenants, ...domains];
  const editItem = editId ? allItems.find(i => i.id === editId) : null;

  const cardStyle = { backgroundColor: '#111827', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', minHeight: '130px' };
  const labelStyle = { fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' as const, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const descStyle = { fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' };
  
  const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', outline: 'none', fontSize: '0.875rem' };
  const labelText = { display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '0.5rem' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#07090e', color: '#f3f4f6', fontFamily: 'sans-serif' }}>
      
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#111827', color: '#f59e0b', border: '1px solid #1f2937', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.875rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
              Ver Tienda
            </button>

            <Link href="?tab=account" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: currentTab === 'account' ? '#1f2937' : 'transparent', color: '#ffffff', border: '1px solid #374151', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Mi Cuenta
              </button>
            </Link>
            
            <form action={async () => {
              "use server";
              const cookieStore = await cookies();
              cookieStore.delete('superadmin_auth');
              redirect('/superadmin/login');
            }}>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

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

      <main style={{ marginLeft: '250px', marginTop: '70px', flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {action === 'edit' && editItem ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <EditItemForm item={editItem} tabName={currentTab} />
          </div>
        ) : (
          <>
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

            {currentTab === 'account' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Mi Cuenta y Perfil Administrativo</h1>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>Gestión de datos fiscales, imagen corporativa y seguridad de acceso.</p>
                    </div>
                  </div>
                  <button style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '900', cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    Guardar Perfil
                  </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><span style={{ color: '#3b82f6' }}>📋</span> Datos Personales y Fiscales</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div><label style={labelText}>Nombre</label><input type="text" placeholder="Tu nombre" defaultValue="Super" style={inputStyle} /></div>
                        <div><label style={labelText}>Apellidos</label><input type="text" placeholder="Tus apellidos" defaultValue="Admin FenixCMS" style={inputStyle} /></div>
                        <div><label style={labelText}>Teléfono de Contacto</label><input type="tel" placeholder="+34 600 000 000" style={inputStyle} /></div>
                        <div><label style={labelText}>NIE / DNI</label><input type="text" placeholder="Y1234567Z" style={inputStyle} /></div>
                        <div style={{ gridColumn: 'span 2' }}><label style={labelText}>CIF (Empresa / Autónomo)</label><input type="text" placeholder="B12345678" style={inputStyle} /></div>
                        <div style={{ gridColumn: 'span 2' }}><label style={labelText}>Dirección de Facturación Completa</label><input type="text" placeholder="Calle Ejemplo 123, 28001 Madrid, España" style={inputStyle} /></div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><span style={{ color: '#a855f7' }}>✨</span> Imagen Corporativa</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1f2937', padding: '1rem', borderRadius: '0.75rem', border: '1px dashed #4b5563' }}>
                          <div><div style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 'bold' }}>Logo Principal</div><div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.25rem' }}>PNG, JPG (Max. 2MB)</div></div>
                          <button style={{ backgroundColor: '#374151', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Subir Logo</button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1f2937', padding: '1rem', borderRadius: '0.75rem', border: '1px dashed #4b5563' }}>
                          <div><div style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 'bold' }}>Icono (Favicon)</div><div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.25rem' }}>Formato ICO o PNG 32x32</div></div>
                          <button style={{ backgroundColor: '#374151', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Subir Favicon</button>
                        </div>
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem', flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><span style={{ color: '#ef4444' }}>🔒</span> Seguridad de Acceso</h3>
                      
                      {msg === 'success' && <div style={{ color: '#10b981', marginBottom: '1rem', fontSize: '0.875rem' }}>✓ Contraseña actualizada correctamente en PostgreSQL.</div>}
                      {msg === 'mismatch' && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>⚠ Las contraseñas nuevas no coinciden.</div>}
                      {msg === 'invalid' && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>⚠ La contraseña actual es incorrecta.</div>}
                      {msg === 'empty' && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>⚠ Por favor, rellena todos los campos.</div>}

                      <form action={updateSuperAdminPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div><label style={labelText}>Contraseña Actual</label><input type="password" name="currentPassword" placeholder="••••••••" style={inputStyle} required /></div>
                        <div style={{ borderTop: '1px solid #1f2937', margin: '0.5rem 0' }}></div>
                        <div><label style={labelText}>Nueva Contraseña</label><input type="password" name="newPassword" placeholder="Escribe tu nueva clave" style={inputStyle} required /></div>
                        <div><label style={labelText}>Repetir Nueva Contraseña</label><input type="password" name="confirmPassword" placeholder="Confirma la nueva clave" style={inputStyle} required /></div>
                        <button type="submit" style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.875rem', marginTop: '0.5rem' }}>Actualizar Contraseña</button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}

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
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem', color: '#9ca3af' }}>Visualizando Settings...</div>
              </>
            )}
            
            {['applications', 'plans', 'entitlements', 'licenses', 'activations', 'subscriptions', 'tenants', 'payments', 'invoices', 'domains', 'themes', 'plugins', 'users', 'audit_logs'].includes(currentTab) && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0, textTransform: 'capitalize' }}>Gestión de {currentTab.replace('_', ' ')}</h1>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>Estructura lista para inyectar datos reales desde PostgreSQL.</p>
                  </div>
                  <button style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: '900', cursor: 'pointer' }}>
                    + Nuevo Registro
                  </button>
                </header>

                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#1f2937', borderBottom: '1px solid #374151' }}>
                        <th style={{ padding: '1rem 1.5rem', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID / Referencia</th>
                        <th style={{ padding: '1rem 1.5rem', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
                        <th style={{ padding: '1rem 1.5rem', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha de Creación</th>
                        <th style={{ padding: '1rem 1.5rem', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((row) => (
                        <tr key={row} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td style={{ padding: '1rem 1.5rem', color: '#ffffff', fontSize: '0.875rem', fontWeight: 'bold' }}>{currentTab.substring(0,3).toUpperCase()}-00{row}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                              Esperando BD
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>-</td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                            <button style={{ backgroundColor: 'transparent', color: '#3b82f6', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold' }}>Editar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                    Los datos reales se mostrarán aquí una vez completada la conexión con Prisma.
                  </div>
                </div>
              </>
            )}

          </>
        )}
      </main>
    </div>
  );
}

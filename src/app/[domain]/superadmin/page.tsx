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

  // 🛠️ LÓGICA DE EDICIÓN: Buscamos el elemento exacto en todas las listas
  const allItems = [...applications, ...plans, ...entitlements, ...licenses, ...activations, ...subscriptions, ...tenants];
  const editItem = editId ? allItems.find(i => i.id === editId) : null;

  async function handleGodMode(formData: FormData) {
    "use server";
    const tenantId = formData.get("tenantId") as string;
    const domain = formData.get("domain") as string;
    const adminPrisma = getAdminClient();
    await adminPrisma.superAdminLog.create({ data: { action: "ACCESO_PRO_SUPERADMIN", targetTenant: tenantId } });
    cookieStore.set(`auth_${tenantId}`, "true", { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 4, path: "/" });
    redirect(`http://${domain}:3000/`);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#07090e', color: '#f3f4f6', fontFamily: 'sans-serif' }}>
      
      <aside style={{ width: '260px', backgroundColor: '#0b0f19', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#f59e0b', color: '#000000', fontWeight: '900', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>🛡️</div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>FENIX CMS</h2>
            <span style={{ fontSize: '0.70rem', color: '#f59e0b', fontWeight: 'bold', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>SUPER ADMIN</span>
          </div>
        </div>
        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', flex: 1 }}>
          <Link href="?tab=dashboard" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'dashboard' ? '#f59e0b' : 'transparent', color: currentTab === 'dashboard' ? '#000000' : '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>📊 Dashboard</div></Link>
          <Link href="?tab=applications" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'applications' ? '#f59e0b' : 'transparent', color: currentTab === 'applications' ? '#000000' : '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>📦 Applications</div></Link>
          <Link href="?tab=plans" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'plans' ? '#f59e0b' : 'transparent', color: currentTab === 'plans' ? '#000000' : '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>🏷️ Plans</div></Link>
          <Link href="?tab=entitlements" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'entitlements' ? '#f59e0b' : 'transparent', color: currentTab === 'entitlements' ? '#000000' : '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>🎛️ Entitlements</div></Link>
          <Link href="?tab=licenses" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'licenses' ? '#f59e0b' : 'transparent', color: currentTab === 'licenses' ? '#000000' : '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>🔑 Licenses</div></Link>
          <Link href="?tab=activations" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'activations' ? '#f59e0b' : 'transparent', color: currentTab === 'activations' ? '#000000' : '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>📉 Activations</div></Link>
          <Link href="?tab=subscriptions" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'subscriptions' ? '#f59e0b' : 'transparent', color: currentTab === 'subscriptions' ? '#000000' : '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>💳 Subscriptions</div></Link>
          <Link href="?tab=tenants" style={{ textDecoration: 'none' }}><div style={{ padding: '0.75rem 1rem', backgroundColor: currentTab === 'tenants' ? '#f59e0b' : 'transparent', color: currentTab === 'tenants' ? '#000000' : '#9ca3af', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>🏢 Tenants ({tenantsCount})</div></Link>
        </nav>
      </aside>

      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* INTERCEPTOR DE EDICIÓN: Si estamos en modo "edit", ocultamos las tablas y mostramos el formulario */}
        {action === 'edit' && editItem ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <EditItemForm item={editItem} tabName={currentTab} />
          </div>
        ) : (
          <>
            {/* AQUÍ COMIENZA EL RENDERIZADO NORMAL DE TODAS LAS PESTAÑAS CUANDO NO SE ESTÁ EDITANDO */}
            
            {currentTab === 'dashboard' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937' }}><h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Panel de Control Ejecutivo Super Admin</h1></header>
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#030712', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <tr><th style={{ padding: '1rem 2rem' }}>Nombre</th><th style={{ padding: '1rem 2rem' }}>Módulo</th><th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {tenants.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td style={{ padding: '1.25rem 2rem', fontWeight: 'bold', color: '#ffffff' }}>{t.name}</td>
                          <td style={{ padding: '1.25rem 2rem', color: '#fcd34d' }}>{t.moduleType}</td>
                          <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}><ActionButtons id={t.id} type="tenant" itemName={t.name} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {currentTab === 'applications' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Application Manager</h1>
                  <Link href="?tab=applications&action=new" style={{ textDecoration: 'none' }}><button style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: '900', cursor: 'pointer', fontSize: '0.875rem' }}>+ Crear Nueva Aplicación</button></Link>
                </header>
                {action === 'new' ? (<div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}><NewAppForm/></div>) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {applications.map(app => (
                      <div key={app.id} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #059669', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold' }}>{app.status || "NUEVO"}</div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{app.name}</h3>
                        <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>{app.desc}</p>
                        <div style={{ marginTop: '1rem' }}><ActionButtons id={app.id} type="app" itemName={app.name} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {currentTab === 'plans' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Plan Manager</h1>
                  <Link href="?tab=plans&action=new" style={{ textDecoration: 'none' }}><button style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: '900', cursor: 'pointer', fontSize: '0.875rem' }}>+ Crear Nuevo Plan</button></Link>
                </header>
                {action === 'new' ? (<div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}><NewPlanForm/></div>) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {plans.map(plan => (
                      <div key={plan.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', margin: '0 0 1rem 0' }}>{plan.name}</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', flex: 1 }}>{plan.desc}</p>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f59e0b', marginTop: '1rem' }}>{plan.monthlyPrice} €</div>
                        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}><ActionButtons id={plan.id} type="plan" itemName={plan.name} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {currentTab === 'entitlements' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Matriz de Entitlements</h1>
                  <Link href="?tab=entitlements&action=new" style={{ textDecoration: 'none' }}><button style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: '900', cursor: 'pointer', fontSize: '0.875rem' }}>+ Nuevo Entitlement</button></Link>
                </header>
                {action === 'new' ? (<div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}><NewEntitlementForm /></div>) : (
                  <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead style={{ backgroundColor: '#030712', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <tr><th style={{ padding: '1rem 2rem' }}>Clave</th><th style={{ padding: '1rem 2rem' }}>Nombre</th><th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Acciones</th></tr>
                      </thead>
                      <tbody>
                        {entitlements.map(ent => (
                          <tr key={ent.id} style={{ borderBottom: '1px solid #1f2937' }}>
                            <td style={{ padding: '1.25rem 2rem', color: '#f59e0b', fontFamily: 'monospace' }}>{ent.key}</td>
                            <td style={{ padding: '1.25rem 2rem', color: '#ffffff' }}>{ent.name}</td>
                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}><ActionButtons id={ent.id} type="entitlement" itemName={ent.name} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {currentTab === 'licenses' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Control de Licencias</h1>
                  <Link href="?tab=licenses&action=new" style={{ textDecoration: 'none' }}><button style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: '900', cursor: 'pointer', fontSize: '0.875rem' }}>+ Emitir Nueva Licencia</button></Link>
                </header>
                {action === 'new' ? (<div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}><NewLicenseForm /></div>) : (
                  <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead style={{ backgroundColor: '#030712', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <tr><th style={{ padding: '1rem 2rem' }}>Clave</th><th style={{ padding: '1rem 2rem' }}>Cliente</th><th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Acciones</th></tr>
                      </thead>
                      <tbody>
                        {licenses.map(lic => (
                          <tr key={lic.id} style={{ borderBottom: '1px solid #1f2937' }}>
                            <td style={{ padding: '1.25rem 2rem', color: '#f59e0b', fontFamily: 'monospace' }}>{lic.key}</td>
                            <td style={{ padding: '1.25rem 2rem', color: '#ffffff' }}>{lic.client}</td>
                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}><ActionButtons id={lic.id} type="license" itemName={lic.key} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {currentTab === 'activations' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Monitor de Activaciones</h1>
                </header>
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#030712', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <tr><th style={{ padding: '1rem 2rem' }}>Dominio</th><th style={{ padding: '1rem 2rem' }}>Clave</th><th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {activations.map(act => (
                        <tr key={act.id} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td style={{ padding: '1.25rem 2rem', fontWeight: 'bold', color: '#ffffff' }}>{act.domain}</td>
                          <td style={{ padding: '1.25rem 2rem', color: '#f59e0b', fontFamily: 'monospace' }}>{act.licenseKey}</td>
                          <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}><ActionButtons id={act.id} type="activation" itemName={`Activación de ${act.domain}`} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {currentTab === 'subscriptions' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Gestión de Suscripciones (Facturación)</h1>
                </header>
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#030712', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <tr><th style={{ padding: '1rem 2rem' }}>Tienda / Inquilino</th><th style={{ padding: '1rem 2rem' }}>Plan Facturado</th><th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {subscriptions.map(sub => (
                        <tr key={sub.id} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td style={{ padding: '1.25rem 2rem', fontWeight: 'bold', color: '#ffffff' }}>{sub.tenantName}</td>
                          <td style={{ padding: '1.25rem 2rem', color: '#e2e8f0', fontSize: '0.875rem' }}>{sub.plan}</td>
                          <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}><ActionButtons id={sub.id} type="subscription" itemName={`Suscripción de ${sub.tenantName}`} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {currentTab === 'tenants' && (
              <>
                <header style={{ backgroundColor: '#111827', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>Gestión de Tenants</h1>
                </header>
                <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#030712', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <tr><th style={{ padding: '1rem 2rem' }}>Nombre</th><th style={{ padding: '1rem 2rem' }}>Módulo</th><th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Acciones Completas</th></tr>
                    </thead>
                    <tbody>
                      {tenants.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td style={{ padding: '1.25rem 2rem', fontWeight: 'bold', color: '#ffffff' }}>{t.name}</td>
                          <td style={{ padding: '1.25rem 2rem', color: '#fcd34d' }}>{t.moduleType}</td>
                          <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}><ActionButtons id={t.id} type="tenant" itemName={t.name} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

      </main>
    </div>
  );
}
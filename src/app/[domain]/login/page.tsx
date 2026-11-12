import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TenantLoginPage({ params }: any) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);
  
  // Server Action para procesar el login directamente en el subdominio de la tienda
  async function handleLogin(formData: FormData) {
    "use server";
    
    const prisma = getAdminClient();
    const domainRecord = await prisma.tenantDomain.findUnique({
      where: { domain: domain },
      include: { tenant: true }
    });

    if (domainRecord && domainRecord.tenant) {
       // NOTA: Para validar el flujo arquitectónico ahora mismo, forzamos la sesión si la tienda existe.
       // En el futuro conectaremos esto a la verificación de la contraseña real de tu base de datos.
       const cookieStore = await cookies();
       cookieStore.set("tenant_session", domainRecord.tenant.id, {
         path: "/",
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "lax",
         maxAge: 60 * 60 * 24 * 7 // 1 semana de sesión
       });
       
       // Una vez creada la cookie de sesión, redirigir al dashboard protegido
       redirect("/admin");
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#07090e', color: '#f3f4f6', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#111827', padding: '3rem', borderRadius: '1rem', border: '1px solid #1f2937', width: '400px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#3b82f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', margin: '0 auto 1.5rem auto', fontSize: '1.5rem' }}>
                {domain.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>Login de Tienda</h2>
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Accediendo al panel de {domain}</p>
            
            <form action={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Contraseña de administrador" 
                  style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white', width: '100%', boxSizing: 'border-box' }} 
                  required 
                />
                <button 
                  type="submit" 
                  style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
                  Entrar al Panel
                </button>
            </form>
            
            <div style={{ marginTop: '1.5rem' }}>
                <Link href="/" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                    Volver a la tienda
                </Link>
            </div>
        </div>
    </div>
  );
}

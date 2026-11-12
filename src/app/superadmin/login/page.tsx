import { handleSuperAdminLogin } from "./actions";

export default async function SuperAdminLoginPage({
  searchParams,
  params
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ domain: string }>;
}) {
  const resolvedSearch = await searchParams;
  const resolvedParams = await params;
  const hasError = resolvedSearch.error === "credenciales";

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#07090e', 
      color: '#f3f4f6', 
      fontFamily: 'sans-serif',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'radial-gradient(circle at 50% 0%, #1f2937 0%, transparent 50%)'
    }}>
      
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '1rem',
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        {/* LOGO Y TITULO */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            backgroundColor: '#f59e0b', 
            color: '#000000', 
            width: '56px', 
            height: '56px', 
            borderRadius: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: '0 0 0.25rem 0', letterSpacing: '0.05em' }}>
            FENIX CMS
          </h1>
          <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold', border: '1px solid #f59e0b', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
            ACCESO SUPER ADMIN
          </span>
        </div>

        {/* MENSAJE DE ERROR */}
        {hasError && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            color: '#ef4444', 
            padding: '0.75rem', 
            borderRadius: '0.5rem', 
            fontSize: '0.875rem', 
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontWeight: 'bold'
          }}>
            Correo electrónico o contraseña incorrectos.
          </div>
        )}

        {/* FORMULARIO */}
        <form action={handleSuperAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="domain" value={resolvedParams.domain} />
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '0.5rem' }}>
              Correo de Soporte Maestro
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>✉️</span>
              <input 
                type="email" 
                name="email" 
                placeholder="admin@fenixcms.io"
                required 
                style={{ 
                  width: '100%', 
                  padding: '0.875rem 1rem 0.875rem 3rem', 
                  borderRadius: '0.5rem', 
                  backgroundColor: '#07090e', 
                  border: '1px solid #374151', 
                  color: '#ffffff', 
                  outline: 'none', 
                  fontSize: '0.875rem' 
                }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '0.5rem' }}>
              <span>Contraseña</span>
              <span style={{ color: '#f59e0b', cursor: 'pointer', fontSize: '0.75rem' }}>¿Olvidaste tu clave?</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>🔒</span>
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••••••"
                required 
                style={{ 
                  width: '100%', 
                  padding: '0.875rem 1rem 0.875rem 3rem', 
                  borderRadius: '0.5rem', 
                  backgroundColor: '#07090e', 
                  border: '1px solid #374151', 
                  color: '#ffffff', 
                  outline: 'none', 
                  fontSize: '0.875rem' 
                }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              backgroundColor: '#f59e0b', 
              color: '#000000', 
              border: 'none', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              fontWeight: '900', 
              cursor: 'pointer', 
              fontSize: '1rem', 
              marginTop: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            Acceder al Motor SaaS
          </button>
        </form>

      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import { loginTenant } from "@/app/actions/tenantAuthActions";
import Link from "next/link";

export default function TenantLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginTenant(formData);
    
    if (result.success) {
      // Redirigir al cliente al panel de administración de su propio subdominio
      window.location.href = `http://${result.domain}/admin`;
    } else {
      setError(result.error || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#07090e', color: '#f3f4f6', fontFamily: 'sans-serif', padding: '1rem' }}>
      <div style={{ backgroundColor: '#111827', padding: '3rem', borderRadius: '1rem', border: '1px solid #1f2937', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        
        <div style={{ backgroundColor: '#f59e0b', color: '#000', fontWeight: '900', padding: '0.5rem', borderRadius: '0.5rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem', color: '#fff' }}>Login de Tiendas</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '2rem' }}>Accede al panel de administración de tu E-commerce</p>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Correo Electrónico</label>
            <input name="email" type="email" required placeholder="tu@email.com" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Contraseña</label>
            <input name="password" type="password" required placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: '1rem', padding: '0.875rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
            {loading ? 'Verificando...' : 'Entrar a mi Panel'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #1f2937', fontSize: '0.875rem' }}>
          <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Volver a la web principal</Link>
        </div>
        
      </div>
    </div>
  );
}

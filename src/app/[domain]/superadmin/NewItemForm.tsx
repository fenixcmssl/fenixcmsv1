"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSuperAdminItem } from "@/app/actions/superadminActions";

export default function NewItemForm({ tabName }: { tabName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const result = await createSuperAdminItem(tabName, data);
    
    if (result.success) {
      router.push(/superadmin?tab=${tabName});
      router.refresh();
    } else {
      setError(result.error || "Error al guardar en base de datos");
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff', marginBottom: '1rem' };
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' as const };

  return (
    <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2rem', width: '100%', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1.5rem', textTransform: 'capitalize' }}>
        Añadir a Base de Datos: {tabName}
      </h2>
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Nombre</label>
        <input name="name" type="text" required style={inputStyle} placeholder="Ej: Nuevo Elemento" />
        
        {tabName === 'applications' && (
          <>
            <label style={labelStyle}>Tipo de Módulo</label>
            <select name="type" style={inputStyle}>
              <option value="ECOMMERCE">E-commerce</option>
              <option value="REAL_ESTATE">Inmobiliaria</option>
            </select>
            <label style={labelStyle}>Versión</label>
            <input name="version" type="text" style={inputStyle} defaultValue="1.0.0" />
          </>
        )}

        {tabName === 'plans' && (
          <>
            <label style={labelStyle}>Precio Mensual (€)</label>
            <input name="price" type="number" step="0.01" required style={inputStyle} placeholder="29.99" />
            <label style={labelStyle}>Etiqueta (Opcional)</label>
            <input name="tag" type="text" style={inputStyle} placeholder="Ej: Popular, Nuevo..." />
          </>
        )}

        <label style={labelStyle}>Descripción</label>
        <textarea name="desc" style={{...inputStyle, minHeight: '100px'}} placeholder="Detalles internos..."></textarea>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" onClick={() => router.push(/superadmin?tab=${tabName})} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: 'transparent', color: '#fff', border: '1px solid #374151', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: '#f59e0b', color: '#000', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Procesando...' : 'Guardar en PostgreSQL'}
          </button>
        </div>
      </form>
    </div>
  );
}

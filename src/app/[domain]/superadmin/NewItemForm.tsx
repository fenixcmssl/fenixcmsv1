"use client";
import Link from 'next/link';

export default function NewItemForm({ tabName }: { tabName: string }) {
  const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', outline: 'none', fontSize: '0.875rem' };
  const labelText = { display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '0.5rem' };

  // Motor de campos dinámicos según la pestaña activa
  const renderFields = () => {
    switch(tabName) {
      case 'applications': 
        return (
          <>
            <div style={{gridColumn:'span 2'}}><label style={labelText}>Nombre de la Aplicación</label><input type="text" placeholder="Ej: Motor Inmobiliario" style={inputStyle} required /></div>
            <div><label style={labelText}>Tipo de Aplicación</label><select style={inputStyle}><option>ECOMMERCE</option><option>REAL_ESTATE</option><option>AUCTION</option></select></div>
            <div><label style={labelText}>Versión Inicial</label><input type="text" placeholder="v1.0.0" style={inputStyle} required /></div>
            <div style={{gridColumn:'span 2'}}><label style={labelText}>Descripción Breve</label><textarea placeholder="Descripción del módulo..." style={{...inputStyle, minHeight:'80px'}}></textarea></div>
          </>
        );
      case 'plans': 
        return (
          <>
            <div><label style={labelText}>Nombre del Plan</label><input type="text" placeholder="Ej: Profesional" style={inputStyle} required /></div>
            <div><label style={labelText}>Aplicación Vinculada</label><select style={inputStyle}><option>Fenix E-commerce Pro</option></select></div>
            <div><label style={labelText}>Precio Mensual (€)</label><input type="number" placeholder="29" style={inputStyle} required /></div>
            <div><label style={labelText}>Precio Anual (€)</label><input type="number" placeholder="290" style={inputStyle} required /></div>
          </>
        );
      case 'tenants': 
        return (
          <>
            <div style={{gridColumn:'span 2'}}><label style={labelText}>Nombre de la Tienda / Negocio</label><input type="text" placeholder="Ej: Mi Tienda Online" style={inputStyle} required /></div>
            <div><label style={labelText}>Dominio Principal</label><input type="text" placeholder="mitienda.com" style={inputStyle} required /></div>
            <div><label style={labelText}>Plan Asignado</label><select style={inputStyle}><option>Starter Merchant</option></select></div>
          </>
        );
      case 'users': 
        return (
          <>
            <div><label style={labelText}>Nombre</label><input type="text" style={inputStyle} required /></div>
            <div><label style={labelText}>Apellidos</label><input type="text" style={inputStyle} required /></div>
            <div style={{gridColumn:'span 2'}}><label style={labelText}>Correo Electrónico</label><input type="email" style={inputStyle} required /></div>
            <div><label style={labelText}>Rol de Acceso</label><select style={inputStyle}><option>ADMIN</option><option>MANAGER</option></select></div>
            <div><label style={labelText}>Contraseña Temporal</label><input type="password" style={inputStyle} required /></div>
          </>
        );
      default: 
        return (
          <>
            <div style={{gridColumn:'span 2'}}><label style={labelText}>Identificador / Referencia</label><input type="text" placeholder={`Nuevo registro para ${tabName}`} style={inputStyle} required /></div>
            <div><label style={labelText}>Estado Inicial</label><select style={inputStyle}><option>ACTIVO</option><option>INACTIVO</option><option>PENDIENTE</option></select></div>
          </>
        );
    }
  };

  return (
    <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid #1f2937', padding: '2.5rem', width: '100%', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ borderBottom: '1px solid #1f2937', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0, textTransform: 'capitalize' }}>Registrar Nuevo: {tabName.replace('_', ' ')}</h2>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>Completa los datos para inyectar este registro en PostgreSQL.</p>
      </div>
      
      <form action={`/superadmin`} method="GET" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <input type="hidden" name="tab" value={tabName} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {renderFields()}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #1f2937', paddingTop: '1.5rem' }}>
          <Link href={`?tab=${tabName}`}>
            <button type="button" style={{ backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancelar
            </button>
          </Link>
          <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '900', cursor: 'pointer' }}>
            Guardar en BD
          </button>
        </div>
      </form>
    </div>
  );
}

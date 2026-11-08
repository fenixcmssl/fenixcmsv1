"use client";
import Link from "next/link";
import { saveItemAction } from "./actions";

export default function EditItemForm({ item, tabName }: { item: any; tabName: string }) {
  // Ocultamos los campos técnicos que no se deben editar manualmente
  const hiddenFields = ['id', 'status', 'features', 'domains', 'createdAt', 'updatedAt', 'moduleType']; 
  
  return (
    <div style={{ backgroundColor: '#0b1121', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #1e293b', width: '100%', maxWidth: '750px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '2rem' }}>
        <span style={{ color: '#3b82f6' }}>✏️</span> Editar Registro
      </h2>
      <form action={saveItemAction}>
        <input type="hidden" name="tabName" value={tabName} />
        <input type="hidden" name="itemType" value={tabName} />
        <input type="hidden" name="id" value={item.id} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {Object.entries(item).map(([key, value]) => {
            if (hiddenFields.includes(key) || typeof value === 'object') return null;
            return (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#f1f5f9', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{key}</label>
                <input 
                  type="text" name={key} defaultValue={String(value)} required 
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', backgroundColor: '#07090e', border: '1px solid #334155', color: '#fff', outline: 'none' }} 
                />
              </div>
            );
          })}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Link href={`?tab=${tabName}`}>
              <button type="button" style={{ backgroundColor: 'transparent', color: '#cbd5e1', border: '1px solid #334155', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancelar</button>
            </Link>
            <button type="submit" style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}
import Link from "next/link";
import { saveItemAction } from "./actions";

export default function NewPlanForm() {
  return (
    <div style={{ backgroundColor: '#0b1121', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #1e293b', width: '100%', maxWidth: '750px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '2rem' }}><span style={{ color: '#f59e0b' }}>+</span> Crear Nuevo Plan</h2>
      <form action={saveItemAction}>
        <input type="hidden" name="itemType" value="plans" />
        <input type="hidden" name="tabName" value="plans" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div><label style={{ display: 'block', fontSize: '0.875rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>Nombre del Plan</label><input type="text" name="name" required style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', backgroundColor: '#07090e', border: '1px solid #334155', color: '#fff', outline: 'none' }} /></div>
          <div><label style={{ display: 'block', fontSize: '0.875rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>Precio Mensual (€)</label><input type="number" name="monthlyPrice" required style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', backgroundColor: '#07090e', border: '1px solid #334155', color: '#fff', outline: 'none' }} /></div>
        </div>
        <div style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>Descripción</label><input type="text" name="desc" required style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', backgroundColor: '#07090e', border: '1px solid #334155', color: '#fff', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="?tab=plans"><button type="button" style={{ backgroundColor: 'transparent', color: '#cbd5e1', border: '1px solid #334155', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancelar</button></Link>
            <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Guardar Plan</button>
        </div>
      </form>
    </div>
  );
}
import Link from "next/link";
import { saveItemAction } from "./actions";

export default function NewLicenseForm() {
  return (
    <div style={{ backgroundColor: '#0b1121', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #1e293b', width: '100%', maxWidth: '750px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '2rem' }}><span style={{ color: '#f59e0b' }}>+</span> Emitir Nueva Licencia</h2>
      <form action={saveItemAction}>
        <input type="hidden" name="itemType" value="licenses" />
        <input type="hidden" name="tabName" value="licenses" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div><label style={{ display: 'block', fontSize: '0.875rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>Clave de Licencia (Generada)</label><input type="text" name="key" placeholder="FNX-..." required style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', backgroundColor: '#07090e', border: '1px solid #334155', color: '#fff', outline: 'none' }} /></div>
          <div><label style={{ display: 'block', fontSize: '0.875rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>Cliente / Tienda</label><input type="text" name="client" required style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', backgroundColor: '#07090e', border: '1px solid #334155', color: '#fff', outline: 'none' }} /></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="?tab=licenses"><button type="button" style={{ backgroundColor: 'transparent', color: '#cbd5e1', border: '1px solid #334155', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancelar</button></Link>
            <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Generar Licencia</button>
        </div>
      </form>
    </div>
  );
}
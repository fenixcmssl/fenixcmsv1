"use client";
import { useTransition } from "react";

export default function ActionButtons({ id, type, itemName }: { id: string; type: string; itemName: string }) {
  const [isPending, startTransition] = useTransition();

  const tabMap: Record<string, string> = { 
    tenant: "tenants", app: "applications", plan: "plans", 
    entitlement: "entitlements", license: "licenses", 
    activation: "activations", subscription: "subscriptions" 
  };
  const tabName = tabMap[type] || type;

  const handleEdit = () => {
    window.location.href = `?tab=${tabName}&action=edit&id=${id}`;
  };

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar permanentemente "${itemName}"?`)) {
      startTransition(async () => {
        try {
          const res = await fetch(`/api/superadmin/delete?id=${id}&type=${type}`, { method: 'DELETE' });
          const data = await res.json();
          if (res.ok && data.success) {
            alert(`"${itemName}" eliminado correctamente.`);
            window.location.reload();
          } else {
            alert(`Error: ${data.error}`);
          }
        } catch (error) {
          alert("Error de conexión al procesar la solicitud.");
        }
      });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
      <button onClick={handleEdit} disabled={isPending} style={{ backgroundColor: '#374151', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>✏️ Editar</button>
      <button onClick={handleDelete} disabled={isPending} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>{isPending ? "⏳" : "🗑️ Eliminar"}</button>
    </div>
  );
}
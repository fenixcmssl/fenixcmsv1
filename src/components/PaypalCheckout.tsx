"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { createTenantAfterPayment } from "@/app/actions/tenantActions";
import Link from "next/link";

export default function PaypalCheckout({ planName, price }: { planName: string, price: string }) {
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDomain, setGeneratedDomain] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{email: string, pass: string} | null>(null);
  const [loading, setLoading] = useState(false);

  if (paid) {
    return (
      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '0.5rem', textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 'bold' }}>✓ ¡Pago completado con éxito!</h4>
        <p style={{ margin: '0 0 0.5rem 0', color: '#e2e8f0' }}>Tu tienda está lista en: <strong style={{ color: '#10b981' }}>{generatedDomain}</strong></p>
        
        <div style={{ backgroundColor: '#111827', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid #374151', textAlign: 'left' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#9ca3af', fontSize: '0.875rem', textTransform: 'uppercase' }}>Tus Credenciales de Acceso:</p>
          <p style={{ margin: '0 0 0.25rem 0', color: '#fff' }}><strong>Email:</strong> {credentials?.email}</p>
          <p style={{ margin: 0, color: '#fff' }}><strong>Contraseña:</strong> {credentials?.pass}</p>
        </div>
        
        <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: '#9ca3af' }}>Guarda estos datos. Podrás cambiarlos luego desde tu panel.</p>
        
        <Link href="/login">
          <button style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: '#000', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
            Ir al Login de mi Tienda
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', marginTop: '1.5rem', zIndex: 0, position: 'relative' }}>
      {loading && <div style={{ marginBottom: '1rem', color: '#f59e0b', textAlign: 'center', fontWeight: 'bold' }}>Creando tu instancia en PostgreSQL...</div>}
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "", currency: "EUR" }}>
        <PayPalButtons 
          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [{
                description: "Suscripción SaaS FenixCMS: " + planName,
                amount: { currency_code: "EUR", value: price },
              }],
            });
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              setLoading(true);
              const details = await actions.order.capture();
              const payerEmail = details?.payer?.email_address || 'cliente@ejemplo.com';
              const payerName = details?.payer?.name?.given_name || 'Nuevo Cliente';
              
              const result = await createTenantAfterPayment(planName, payerEmail, payerName);
              
              if (result.success) {
                setGeneratedDomain(result.domain);
                setCredentials({ email: result.email || payerEmail, pass: result.password || '' });
                setPaid(true);
              } else {
                setError("Fallo en BD: " + result.error);
              }
              setLoading(false);
            }
          }}
          onError={(err) => {
            console.error("Error en PayPal:", err);
            setError("Hubo un problema con la conexión bancaria. Inténtalo de nuevo.");
          }}
        />
      </PayPalScriptProvider>
      {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
    </div>
  );
}

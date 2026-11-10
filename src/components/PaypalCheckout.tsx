"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { createTenantAfterPayment } from "@/app/actions/tenantActions";

export default function PaypalCheckout({ planName, price }: { planName: string, price: string }) {
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDomain, setGeneratedDomain] = useState<string | null>(null);

  if (paid) {
    return (
      <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>✓ ¡Pago completado con éxito!</p>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>Tu tienda está lista en: <strong>{generatedDomain}</strong></p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', marginTop: '1.5rem', zIndex: 0, position: 'relative' }}>
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
              const details = await actions.order.capture();
              const payerEmail = details?.payer?.email_address || 'cliente@ejemplo.com';
              const payerName = details?.payer?.name?.given_name || 'Nuevo Cliente';
              
              // Conectar con PostgreSQL para crear el Tenant multi-modelo
              const result = await createTenantAfterPayment(planName, payerEmail, payerName);
              
              if (result.success) {
                setGeneratedDomain(result.domain);
                setPaid(true);
              } else {
                setError("Pago recibido, pero hubo un error al crear la tienda. Soporte técnico contactado.");
              }
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

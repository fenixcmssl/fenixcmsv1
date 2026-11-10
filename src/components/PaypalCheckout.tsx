"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

export default function PaypalCheckout({ planName, price }: { planName: string, price: string }) {
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (paid) {
    return (
      <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
        ✓ ¡Pago completado! Generando licencia y subdominio tenant...
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
              purchase_units: [
                {
                  description: `Suscripción SaaS FenixCMS: ${planName}`,
                  amount: {
                    currency_code: "EUR",
                    value: price,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              const details = await actions.order.capture();
              console.log("Pago completado por:", details?.payer?.name?.given_name);
              setPaid(true);
              
              // Fase 11.2: Aquí conectaremos con PostgreSQL para crear el Tenant y la Licencia
            }
          }}
          onError={(err) => {
            console.error("Error en PayPal:", err);
            setError("Hubo un problema con la conexión al banco. Inténtalo de nuevo.");
          }}
        />
      </PayPalScriptProvider>
      {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
    </div>
  );
}

import { getAdminClient, getTenantClient } from "../../lib/prisma";
import { notFound } from "next/navigation";

export default async function TenantPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  
  const adminClient = getAdminClient();
  const tenantDomainInfo = await adminClient.tenantDomain.findUnique({
    where: { domain },
    include: { tenant: true },
  });

  if (!tenantDomainInfo) {
    return notFound();
  }

  const tenantClient = getTenantClient(tenantDomainInfo.tenant.id);
  const tenantData = await tenantClient.tenant.findUnique({
    where: { id: tenantDomainInfo.tenant.id },
  });

  return (
    <main style={{ padding: "3rem", fontFamily: "system-ui, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#f9fafb" }}>
        <h1 style={{ color: "#111827" }}>Bienvenido a {tenantDomainInfo.tenant.name}</h1>
        <p style={{ color: "#4b5563" }}><strong>Dominio resuelto:</strong> {domain}</p>
        <p style={{ color: "#4b5563" }}><strong>Estado del Tenant:</strong> <span style={{ color: "#059669" }}>{tenantData?.status}</span></p>
      </div>
      <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "#6b7280" }}>
        Identificador seguro de BBDD: {tenantData?.id} <br/>
        <em>(Esta consulta se ejecuto respetando Row-Level Security en PostgreSQL)</em>
      </p>
    </main>
  );
}
import { getTenantByDomain } from "@/lib/tenancy/resolver";
import TiendaEcommerceView from "@/components/tienda/TiendaEcommerceView";
import TiendaInmobiliariaView from "@/components/tienda/TiendaInmobiliariaView";
import TiendaSubastasView from "@/components/tienda/TiendaSubastasView";

export default async function TenantHomePage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const tenant = await getTenantByDomain(domain);

  if (!tenant) {
    return <div className="p-8 text-center text-red-500">Inquilino no encontrado o dominio no registrado.</div>;
  }

  // Renderizado condicional basado estrictamente en el módulo del Tenant
  switch (tenant.moduleType) {
    case "REAL_ESTATE":
      return <TiendaInmobiliariaView tenant={tenant} />;
    case "AUCTION":
      return <TiendaSubastasView tenant={tenant} />;
    case "ECOMMERCE":
    default:
      return <TiendaEcommerceView tenant={tenant} />;
  }
}
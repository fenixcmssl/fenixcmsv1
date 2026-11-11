import { getAdminClient } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const resolvedParams = await params;
  const domain = decodeURIComponent(resolvedParams?.domain || params?.domain);

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tenant_session")?.value;

  if (!sessionId) redirect("/login");

  const prisma = getAdminClient();
  const tenant = await prisma.tenant.findUnique({
    where: { id: sessionId },
  });

  if (!tenant) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar tenantName={tenant.name} domain={domain} />
      {/* El contenido de todas las páginas (Dashboard, Catálogo, etc.) se inyectará aquí */}
      {children}
    </div>
  );
}

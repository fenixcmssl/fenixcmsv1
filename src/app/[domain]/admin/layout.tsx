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
    include: {
      extensions: {
        include: { application: true }
      }
    }
  });

  if (!tenant) redirect("/login");

  // Obtener array de nombres de los plugins activos de esta tienda
  const activePlugins = tenant.extensions
    .filter(ext => ext.isActive && ext.application)
    .map(ext => ext.application.name);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar tenantName={tenant.name} domain={domain} activePlugins={activePlugins} />
      {children}
    </div>
  );
}

import { getAdminClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  if (!id) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  const prisma = getAdminClient();
  const response = NextResponse.json({ success: true });

  try {
    if (type === "tenant") {
      // 1. Borrar las dependencias (Dominios) para evitar error de PostgreSQL (Foreign Key)
      await prisma.domain.deleteMany({
        where: { tenantId: id }
      });
      // 2. Ahora sí podemos borrar el Inquilino
      await prisma.tenant.delete({
        where: { id }
      });
    } else {
      // Como Planes, Apps y Licencias aún son estáticos, usamos una Cookie temporal 
      // para decirle a la vista principal que no los muestre (hasta que usemos BD real).
      response.cookies.set(`hide_mock_${id}`, 'true', { path: '/' });
    }

    return response;
  } catch (error: any) {
    console.error("Error crítico al eliminar:", error);
    return NextResponse.json({ error: "No se pudo eliminar por dependencias en la BD." }, { status: 500 });
  }
}
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TENANT_A_ID = "c0a80101-0001-4000-8000-000000000001"; // Fenix Store Demo
const TENANT_B_ID = "c0a80101-0002-4000-8000-000000000002"; // Tienda Competidora

async function runSecurityAudit() {
  console.log("===============================================================");
  console.log("       INICIANDO AUDITORIA DE SEGURIDAD RLS - FENIXCMS         ");
  console.log("===============================================================\n");

  let passedTests = 0;
  const totalTests = 4;

  // TEST 1: Intento de lectura anónima (sin RLS session ni Bypass)
  console.log("TEST 1: Intento de lectura global sin sesion configurada...");
  try {
    const anonymousTenants = await prisma.tenant.findMany();
    if (anonymousTenants.length === 0) {
      console.log("  [PASO SEGURO]: Retorno 0 registros. RLS bloquea lectura anonima.");
      passedTests++;
    } else {
      console.error("  [FALLO DE SEGURIDAD]: Se expusieron " + anonymousTenants.length + " registros sin sesion.");
    }
  } catch (err) {
    console.log("  [PASO SEGURO]: Consulta bloqueada por motor PostgreSQL:", err.message);
    passedTests++;
  }

  // TEST 2: Acceso legítimo como Tenant A con SET LOCAL
  console.log("\nTEST 2: Acceso legitimo con contexto de Tenant A...");
  const tenantAData = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${TENANT_A_ID}'`);
    return tx.tenant.findMany();
  });

  if (tenantAData.length === 1 && tenantAData[0].id === TENANT_A_ID) {
    console.log("  [PASO SEGURO]: Tenant A solo visualiza sus propios datos (" + tenantAData[0].name + ").");
    passedTests++;
  } else {
    console.error("  [FALLO]: Resultados inesperados para Tenant A:", tenantAData);
  }

  // TEST 3: Intento de ataque cruzado (Tenant A intenta leer a Tenant B)
  console.log("\nTEST 3: Intento de penetracion: Tenant A solicita datos privados de Tenant B...");
  const crossTenantLeak = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${TENANT_A_ID}'`);
    return tx.tenant.findUnique({
      where: { id: TENANT_B_ID }
    });
  });

  if (crossTenantLeak === null) {
    console.log("  [PASO SEGURO]: PostgreSQL retorno null. Ataque de lectura cruzada contenido con exito.");
    passedTests++;
  } else {
    console.error("  [VULNERABILIDAD CRITICA]: Tenant A pudo leer los datos del Tenant B!", crossTenantLeak);
  }

  // TEST 4: Verificación del cliente administrativo (Bypass controlado)
  console.log("\nTEST 4: Acceso administrativo con app.bypass_rls = 'on'...");
  const adminData = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SET LOCAL app.bypass_rls = 'on'`);
    return tx.tenant.findMany();
  });

  if (adminData.length >= 2) {
    console.log("  [PASO SEGURO]: Modo administrador lista ambos tenants (" + adminData.length + " encontrados) para resolucion de host.");
    passedTests++;
  } else {
    console.error("  [FALLO]: El modo bypass no pudo listar los tenants.");
  }

  console.log("\n===============================================================");
  console.log(" RESULTADO: " + passedTests + " de " + totalTests + " pruebas de seguridad pasadas exitosamente.");
  console.log("===============================================================");

  await prisma.$disconnect();

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runSecurityAudit().catch((err) => {
  console.error("Error durante la ejecucion de la auditoria:", err);
  process.exit(1);
});
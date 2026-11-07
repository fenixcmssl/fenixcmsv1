import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TENANT_A_ID = "c0a80101-0001-4000-8000-000000000001";
const TENANT_B_ID = "c0a80101-0002-4000-8000-000000000002";

async function runCatalogAudit() {
  console.log("===============================================================");
  console.log("       AUDITORIA DE SEGURIDAD RLS: CATALOGO E-COMMERCE         ");
  console.log("===============================================================\n");

  let passedTests = 0;
  const totalTests = 2;

  // TEST 1: Tenant A consulta sus productos
  console.log("TEST 1: Tenant A solicita el listado global de productos (debe ver solo los suyos)...");
  const tenantAProducts = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${TENANT_A_ID}'`);
    return tx.product.findMany({ include: { category: true } });
  });

  if (tenantAProducts.length === 1 && tenantAProducts[0].tenantId === TENANT_A_ID) {
    console.log(`  [PASO SEGURO]: Tenant A solo recupero su producto: ${tenantAProducts[0].name}`);
    passedTests++;
  } else {
    console.error("  [FALLO CRITICO]: Fuga de datos detectada en productos para Tenant A.", tenantAProducts);
  }

  // TEST 2: Tenant A intenta leer directamente un producto del Tenant B por ID
  console.log("\nTEST 2: Tenant A intenta leer el producto privado del Tenant B mediante su ID...");
  const crossTenantProductLeak = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${TENANT_A_ID}'`);
    return tx.product.findUnique({
      where: { id: 'prod0000-0002-4000-8000-000000000002' }
    });
  });

  if (crossTenantProductLeak === null) {
    console.log("  [PASO SEGURO]: Motor PostgreSQL bloqueo la lectura y retorno null.");
    passedTests++;
  } else {
    console.error("  [VULNERABILIDAD]: Tenant A accedio a producto ajeno!", crossTenantProductLeak);
  }

  console.log("\n===============================================================");
  console.log(" RESULTADO: " + passedTests + " de " + totalTests + " pruebas de aislamiento del catalogo pasadas.");
  console.log("===============================================================");

  await prisma.$disconnect();
  process.exit(passedTests === totalTests ? 0 : 1);
}

runCatalogAudit().catch(console.error);
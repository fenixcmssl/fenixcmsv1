const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.tenantDomain.deleteMany({});
  await prisma.tenant.deleteMany({});
  
  const tenant = await prisma.tenant.create({
    data: {
      name: "Fenix Store Demo",
      password: "admin123", // Contraseña inicial configurada en el esquema
      domains: {
        create: { domain: "localhost" }
      }
    }
  });
  console.log("Tenant restaurado exitosamente:", tenant.name);
}

main().catch(console.error).finally(() => prisma.$disconnect());
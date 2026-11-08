const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.tenantDomain.deleteMany({});
  await prisma.tenant.deleteMany({});
  
  const tenant = await prisma.tenant.create({
    data: {
      name: "Fenix Global Multi-Tenant",
      password: "admin123",
      moduleType: "ECOMMERCE",
      currency: "EUR",
      language: "es",
      domains: {
        create: { domain: "localhost" }
      }
    }
  });
  console.log("Tenant Base Creado exitosamente:", tenant.name);
  console.log("Modulo Activo:", tenant.moduleType);
  console.log("Moneda:", tenant.currency);
}

main().catch(console.error).finally(() => prisma.$disconnect());
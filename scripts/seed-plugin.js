const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pluginName = "Fenix Import Pro";
  let app = await prisma.application.findFirst({ where: { name: pluginName } });
  
  if (!app) {
    await prisma.application.create({
      data: {
        name: pluginName,
        type: "PLUGIN",
        version: "1.0.0",
        status: "ACTIVA",
        desc: "Herramienta avanzada de importación masiva de productos vía CSV. Mapeo visual y alta velocidad."
      }
    });
    console.log(`Plugin '${pluginName}' registrado en la App Store del SuperAdmin con éxito.`);
  } else {
    console.log(`El plugin '${pluginName}' ya estaba registrado.`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

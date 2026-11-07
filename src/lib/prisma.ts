import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const getTenantClient = (tenantId: string) => {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!model) return query(args);
          const modelKey = model.charAt(0).toLowerCase() + model.slice(1);
          return prisma.$transaction(async (tx) => {
            await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${tenantId}'`);
            return (tx as any)[modelKey][operation](args);
          });
        },
      },
    },
  });
};

export const getAdminClient = () => {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!model) return query(args);
          const modelKey = model.charAt(0).toLowerCase() + model.slice(1);
          return prisma.$transaction(async (tx) => {
            await tx.$executeRawUnsafe(`SET LOCAL app.bypass_rls = 'on'`);
            return (tx as any)[modelKey][operation](args);
          });
        },
      },
    },
  });
};
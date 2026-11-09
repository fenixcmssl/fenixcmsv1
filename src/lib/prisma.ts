import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export function getAdminClient() {
  return prisma;
}

export function getTenantClient(tenantId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const modelsWithTenantId = [
            'TenantDomain', 'Subscription', 'EcommerceProduct', 'Property', 'AuctionItem'
          ];
          
          if (modelsWithTenantId.includes(model)) {
            if (['findMany', 'findFirst', 'findUnique', 'count', 'updateMany', 'deleteMany'].includes(operation)) {
              (args as any).where = { ...(args as any).where, tenantId };
            }
            if (['create', 'update', 'upsert'].includes(operation)) {
              (args as any).data = { ...(args as any).data, tenantId };
            }
          }
          return query(args);
        },
      },
    },
  });
}

export default prisma;

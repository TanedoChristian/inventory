import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

prisma.$use(async (params, next) => {
  const tenantId = process.env.TENANT_ID;

  if (!tenantId) {
    throw new Error('TENANT_ID environment variable is not set');
  }

  if (params.model && params.action) {
    if (params.args) {
      if (params.args.data) {
        params.args.data.tenantId = tenantId;
      } else {
        params.args.where = {
          ...params.args.where,
          tenantId: tenantId,
        };
      }
    }
  }
  return next(params);
});

export { prisma };
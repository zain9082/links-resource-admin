import { Prisma, PrismaClient } from "@prisma/client";

function assertPortalPrismaReady() {
  const redirectFields = Prisma.RedirectScalarFieldEnum as Record<string, string>;
  for (const field of ["statusCode", "hitCount", "isRegex", "updatedAt"] as const) {
    if (!(field in redirectFields)) {
      throw new Error(
        `[prisma] Stale Prisma client missing Redirect.${field}. Run \`npx prisma generate\` in portal and restart.`
      );
    }
  }
  if (!("NotFoundLog" in Prisma.ModelName) || !("GlobalSeoSettings" in Prisma.ModelName)) {
    throw new Error(
      "[prisma] Stale Prisma client missing SEO models. Run `npx prisma generate` and restart."
    );
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient() {
  assertPortalPrismaReady();
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function getClient() {
  if (globalForPrisma.prisma) {
    try {
      assertPortalPrismaReady();
      return globalForPrisma.prisma;
    } catch {
      void globalForPrisma.prisma.$disconnect().catch(() => undefined);
      globalForPrisma.prisma = undefined;
    }
  }
  const client = createClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getClient();

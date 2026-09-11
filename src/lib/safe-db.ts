let dbUnavailableLogged = false;

export async function safeDb<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV === "development" && !dbUnavailableLogged) {
      dbUnavailableLogged = true;
      console.warn(
        "[safeDb] Database unavailable — pages will show empty data until Postgres is running.",
        error instanceof Error ? error.message : error
      );
    }
    return fallback;
  }
}

export async function isDbAvailable(): Promise<boolean> {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}


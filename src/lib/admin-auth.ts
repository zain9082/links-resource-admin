import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdminSession() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!session || !userId || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin access required.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin access required.");
  }

  return {
    session,
    userId,
  };
}

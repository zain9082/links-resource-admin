import { prisma } from "@/lib/prisma";

export async function logActivity({
  adminId,
  action,
  entity,
  entityId,
  detail,
}: {
  adminId: string;
  action: string;
  entity: string;
  entityId?: string;
  detail?: string;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
        detail,
      },
    });
  } catch {
    // Activity logging should never block content saves.
  }
}

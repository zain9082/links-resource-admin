"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite } from "@/lib/revalidate-site";
import { SERVICE_LANDING_PATHS } from "@/lib/website-paths";
import { publicationInputSchema } from "@/lib/schemas";

export async function upsertPublication(data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = publicationInputSchema.parse(data);

    if (parsed.id) {
      await prisma.publication.update({
        where: { id: parsed.id },
        data: parsed,
      });
    } else {
      await prisma.publication.create({
        data: parsed,
      });
    }

    await logActivity({
      adminId: userId,
      action: parsed.id ? "UPDATED" : "CREATED",
      entity: "Publication",
      entityId: parsed.id,
    });

    revalidatePath("/admin/publications");
    await revalidateWebsite([
      "/link-building-services",
      "/link-building-services/publications",
      ...SERVICE_LANDING_PATHS,
    ]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

export async function deletePublication(id: string) {
  try {
    const { userId } = await requireAdminSession();
    await prisma.publication.delete({ where: { id } });
    await logActivity({
      adminId: userId,
      action: "DELETED",
      entity: "Publication",
      entityId: id,
    });

    revalidatePath("/admin/publications");
    await revalidateWebsite([
      "/link-building-services",
      "/link-building-services/publications",
      ...SERVICE_LANDING_PATHS,
    ]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return { error: message };
  }
}

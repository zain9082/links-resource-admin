"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite } from "@/lib/revalidate-site";
import { SERVICE_LANDING_PATHS } from "@/lib/website-paths";

const schema = z.object({
  section: z.string().min(1),
  data: z.unknown(),
});

export async function updateHomepageSection(section: string, data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = schema.parse({ section, data });

    await prisma.homepageContent.upsert({
      where: { section: parsed.section },
      update: {
        data: parsed.data as Prisma.InputJsonValue,
        updatedBy: userId,
      },
      create: {
        section: parsed.section,
        data: parsed.data as Prisma.InputJsonValue,
        updatedBy: userId,
      },
    });

    await logActivity({
      adminId: userId,
      action: "UPDATED",
      entity: "HomepageContent",
      entityId: parsed.section,
      detail: `${parsed.section} section updated`,
    });

    revalidatePath("/admin/homepage");
    await revalidateWebsite(["/", "/case-studies", ...SERVICE_LANDING_PATHS]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update";
    return { error: message };
  }
}

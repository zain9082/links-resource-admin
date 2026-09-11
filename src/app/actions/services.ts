"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite } from "@/lib/revalidate-site";
import { servicePageInputSchema } from "@/lib/schemas";

const schema = z.object({
  slug: z.string().min(1),
  data: servicePageInputSchema,
});

export async function upsertServicePage(slug: string, data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = schema.parse({ slug, data });

    await prisma.servicePage.upsert({
      where: { slug: parsed.slug },
      update: {
        name: parsed.data.name,
        data: parsed.data.data as Prisma.InputJsonValue,
        updatedBy: userId,
      },
      create: {
        slug: parsed.slug,
        name: parsed.data.name,
        data: parsed.data.data as Prisma.InputJsonValue,
        updatedBy: userId,
      },
    });

    await logActivity({
      adminId: userId,
      action: "UPDATED",
      entity: "ServicePage",
      entityId: parsed.slug,
    });

    revalidatePath(`/admin/services/${parsed.slug}`);
    revalidatePath("/admin/services");
    await revalidateWebsite([`/resources/${parsed.slug}`]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

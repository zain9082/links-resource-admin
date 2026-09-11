"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { getPageRegistryEntry } from "@/lib/page-registry";
import { revalidateWebsite } from "@/lib/revalidate-site";

const schema = z.object({
  slug: z.string().min(1),
  data: z.unknown(),
});

export async function updatePageContent(slug: string, data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = schema.parse({ slug, data });
    const entry = getPageRegistryEntry(parsed.slug);

    if (!entry) {
      return { error: "Unknown page slug." };
    }

    await prisma.pageContent.upsert({
      where: { slug: parsed.slug },
      update: {
        data: parsed.data as Prisma.InputJsonValue,
        updatedBy: userId,
      },
      create: {
        slug: parsed.slug,
        data: parsed.data as Prisma.InputJsonValue,
        updatedBy: userId,
      },
    });

    await logActivity({
      adminId: userId,
      action: "UPDATED",
      entity: "PageContent",
      entityId: parsed.slug,
      detail: `${entry.label} updated`,
    });

    revalidatePath(`/admin/pages/${parsed.slug}`);
    await revalidateWebsite(entry.revalidatePaths);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update page";
    return { error: message };
  }
}

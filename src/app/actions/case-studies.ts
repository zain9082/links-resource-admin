"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite } from "@/lib/revalidate-site";
import { caseStudyInputSchema } from "@/lib/schemas";

export async function upsertCaseStudy(data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = caseStudyInputSchema.parse(data);

    if (parsed.id) {
      await prisma.caseStudy.update({
        where: { id: parsed.id },
        data: {
          clientName: parsed.clientName,
          industry: parsed.industry,
          title: parsed.title,
          challenge: parsed.challenge,
          solution: parsed.solution,
          results: parsed.results,
          metrics: parsed.metrics,
          tags: parsed.tags ?? [],
          imageUrl: parsed.imageUrl || null,
          published: parsed.published,
        },
      });
    } else {
      await prisma.caseStudy.create({
        data: {
          clientName: parsed.clientName,
          industry: parsed.industry,
          title: parsed.title,
          challenge: parsed.challenge,
          solution: parsed.solution,
          results: parsed.results,
          metrics: parsed.metrics,
          tags: parsed.tags ?? [],
          imageUrl: parsed.imageUrl || null,
          published: parsed.published,
        },
      });
    }

    await logActivity({
      adminId: userId,
      action: parsed.id ? "UPDATED" : "CREATED",
      entity: "CaseStudy",
      entityId: parsed.id,
    });

    revalidatePath("/admin/case-studies");
    await revalidateWebsite(["/", "/case-studies"]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

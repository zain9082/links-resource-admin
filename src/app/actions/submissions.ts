"use server";

import { Pricing, SubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite } from "@/lib/revalidate-site";
import { slugify } from "@/lib/utils";

export async function approveSubmission(id: string) {
  try {
    const { userId } = await requireAdminSession();
    const parsedId = z.string().min(1).parse(id);
    const resourceSlug = await prisma.$transaction(async (tx) => {
      const submission = await tx.submission.findUnique({ where: { id: parsedId } });
      if (!submission) throw new Error("Submission not found");
      if (submission.status === SubmissionStatus.APPROVED) {
        throw new Error("Submission has already been approved.");
      }

      const categorySlug = slugify(submission.category);
      let category = await tx.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      });

      if (!category) {
        category = await tx.category.create({
          data: {
            slug: categorySlug,
            name: submission.category,
            description: `${submission.category} resources`,
            icon: "Folder",
            gradient: "purple",
          },
          select: { id: true },
        });
      }

      const slug = slugify(submission.title);
      const resource = await tx.resource.create({
        data: {
          slug,
          title: submission.title,
          tagline: submission.description.slice(0, 120),
          description: submission.description,
          url: submission.url,
          categoryId: category.id,
          pricing: Pricing.FREEMIUM,
          status: "PUBLISHED",
        },
        select: { slug: true },
      });

      await tx.submission.update({
        where: { id: parsedId },
        data: { status: SubmissionStatus.APPROVED, reason: null },
      });

      await tx.activityLog.create({
        data: {
          adminId: userId,
          action: "APPROVED",
          entity: "Submission",
          entityId: parsedId,
          detail: `Published resource ${resource.slug}`,
        },
      });

      return resource.slug;
    });

    revalidatePath("/admin/submissions");
    revalidatePath("/admin/resources");
    await revalidateWebsite([
      "/resources",
      `/resources/${resourceSlug}`,
      "/categories",
      "/submit",
      "/search",
      "/sitemap.xml",
    ]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Approval failed";
    return { error: message };
  }
}

export async function rejectSubmission(id: string, reason: string) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = z.object({
      id: z.string().min(1),
      reason: z.string().trim().min(1).max(1_000),
    }).parse({ id, reason });
    await prisma.submission.update({
      where: { id: parsed.id },
      data: { status: SubmissionStatus.REJECTED, reason: parsed.reason },
    });

    await prisma.activityLog.create({
      data: {
        adminId: userId,
        action: "REJECTED",
        entity: "Submission",
        entityId: parsed.id,
        detail: parsed.reason,
      },
    });
    revalidatePath("/admin/submissions");
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rejection failed";
    return { error: message };
  }
}

export async function deleteSubmission(id: string) {
  try {
    const { userId } = await requireAdminSession();
    const parsedId = z.string().min(1).parse(id);
    await prisma.$transaction([
      prisma.submission.delete({ where: { id: parsedId } }),
      prisma.activityLog.create({
        data: {
          adminId: userId,
          action: "DELETED",
          entity: "Submission",
          entityId: parsedId,
        },
      }),
    ]);
    revalidatePath("/admin/submissions");
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return { error: message };
  }
}

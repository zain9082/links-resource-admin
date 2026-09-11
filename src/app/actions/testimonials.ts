"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite } from "@/lib/revalidate-site";
import { TESTIMONIAL_PAGE_PATHS } from "@/lib/website-paths";
import { testimonialInputSchema } from "@/lib/schemas";

export async function upsertTestimonial(data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = testimonialInputSchema.parse(data);

    if (parsed.id) {
      await prisma.testimonial.update({
        where: { id: parsed.id },
        data: {
          authorName: parsed.authorName,
          company: parsed.company,
          role: parsed.role || null,
          avatarUrl: parsed.avatarUrl || null,
          rating: parsed.rating,
          quote: parsed.quote,
          featured: parsed.featured,
          displayOrder: parsed.displayOrder,
        },
      });
    } else {
      await prisma.testimonial.create({
        data: {
          authorName: parsed.authorName,
          company: parsed.company,
          role: parsed.role || null,
          avatarUrl: parsed.avatarUrl || null,
          rating: parsed.rating,
          quote: parsed.quote,
          featured: parsed.featured,
          displayOrder: parsed.displayOrder,
        },
      });
    }

    await logActivity({
      adminId: userId,
      action: parsed.id ? "UPDATED" : "CREATED",
      entity: "Testimonial",
      entityId: parsed.id,
    });
    revalidatePath("/admin/testimonials");
    await revalidateWebsite([...TESTIMONIAL_PAGE_PATHS]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

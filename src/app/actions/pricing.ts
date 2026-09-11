"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { pricingPlanInputSchema } from "@/lib/schemas";
import { revalidateWebsite } from "@/lib/revalidate-site";

export async function upsertPricingPlan(data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = pricingPlanInputSchema.parse(data);

    if (parsed.id) {
      await prisma.pricingPlan.update({
        where: { id: parsed.id },
        data: {
          name: parsed.name,
          price: parsed.price,
          billingNote: parsed.billingNote,
          features: parsed.features,
          isPopular: parsed.isPopular,
          ctaLabel: parsed.ctaLabel,
          ctaHref: parsed.ctaHref,
          color: parsed.color,
          displayOrder: parsed.displayOrder,
        },
      });
    } else {
      await prisma.pricingPlan.create({
        data: {
          name: parsed.name,
          price: parsed.price,
          billingNote: parsed.billingNote,
          features: parsed.features,
          isPopular: parsed.isPopular,
          ctaLabel: parsed.ctaLabel,
          ctaHref: parsed.ctaHref,
          color: parsed.color,
          displayOrder: parsed.displayOrder,
        },
      });
    }

    await logActivity({
      adminId: userId,
      action: parsed.id ? "UPDATED" : "CREATED",
      entity: "PricingPlan",
      entityId: parsed.id,
    });
    revalidatePath("/admin/pricing");
    await revalidateWebsite(["/", "/link-building-services", "/seo-services"]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

import { TestimonialsAdminClient } from "@/components/admin/testimonials/TestimonialsAdminClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { getLegacyTestimonials } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function TestimonialsAdminPage() {
  const rows = await safeDb(
    () =>
      prisma.testimonial.findMany({
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      }),
    []
  );
  const list = rows.length > 0 ? rows : await getLegacyTestimonials();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Testimonials"
        subtitle="Manage testimonial cards, ratings, and featured visibility."
      />
      <TestimonialsAdminClient rows={list} />
    </div>
  );
}

import { PricingAdminClient } from "@/components/admin/pricing/PricingAdminClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { getLegacyPricingPlans } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function PricingAdminPage() {
  const plans = await safeDb(
    () =>
      prisma.pricingPlan.findMany({
        orderBy: { displayOrder: "asc" },
      }),
    []
  );
  const list = plans.length > 0 ? plans : await getLegacyPricingPlans();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pricing"
        subtitle="Edit plan copy, features, and CTA for Starter, Growth, and Scale."
      />
      <PricingAdminClient plans={list} />
    </div>
  );
}

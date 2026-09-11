import { PageHeader } from "@/components/admin/ui/PageHeader";
import { RedirectsAdminClient } from "@/components/admin/seo/RedirectsAdminClient";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export default async function RedirectsAdminPage() {
  const redirects = await safeDb(
    () =>
      prisma.redirect.findMany({
        orderBy: [{ hitCount: "desc" }, { createdAt: "desc" }],
      }),
    []
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Redirects"
        subtitle="Create, import, and manage 301/302/410 rules for the public website."
      />
      <RedirectsAdminClient
        redirects={redirects.map((row) => ({
          ...row,
          lastHitAt: row.lastHitAt?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}

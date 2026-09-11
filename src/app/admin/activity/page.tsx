import { ActivityLogClient } from "@/components/admin/activity/ActivityLogClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export default async function ActivityAdminPage() {
  const rows = await safeDb(
    () =>
      prisma.activityLog.findMany({
        include: { admin: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
    []
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Activity Log"
        subtitle="Track admin operations across content, users, SEO, and system changes."
      />
      <ActivityLogClient rows={rows} />
    </div>
  );
}

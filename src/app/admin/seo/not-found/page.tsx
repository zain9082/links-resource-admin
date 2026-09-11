import { PageHeader } from "@/components/admin/ui/PageHeader";
import { NotFoundMonitorClient } from "@/components/admin/seo/NotFoundMonitorClient";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export default async function NotFoundMonitorPage() {
  const logs = await safeDb(
    () =>
      prisma.notFoundLog.findMany({
        where: { resolved: false },
        orderBy: [{ hitCount: "desc" }, { lastSeen: "desc" }],
        take: 200,
      }),
    []
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="404 monitor"
        subtitle="Unresolved missing URLs sorted by hit count. Create redirects or mark paths as gone."
      />
      <NotFoundMonitorClient
        logs={logs.map((row) => ({
          ...row,
          firstSeen: row.firstSeen.toISOString(),
          lastSeen: row.lastSeen.toISOString(),
        }))}
      />
    </div>
  );
}

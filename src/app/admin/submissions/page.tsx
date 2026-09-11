import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SubmissionsAdminClient } from "@/components/admin/submissions/SubmissionsAdminClient";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export default async function SubmissionsAdminPage() {
  const rows = await safeDb(
    () =>
      prisma.submission.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Submissions"
        subtitle="Review pending submissions and approve or reject with an audit trail."
      />
      <SubmissionsAdminClient rows={rows} />
    </div>
  );
}

import { PublicationsAdminClient } from "@/components/admin/publications/PublicationsAdminClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { getLegacyPublicationsList } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function PublicationsAdminPage() {
  const rows = await safeDb(
    () =>
      prisma.publication.findMany({
        orderBy: { updatedAt: "desc" },
      }),
    []
  );
  const list = rows.length > 0 ? rows : await getLegacyPublicationsList();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Publications"
        subtitle="Inline edit publication listings, import/export CSV, and run bulk actions."
      />
      <PublicationsAdminClient initialRows={list} />
    </div>
  );
}

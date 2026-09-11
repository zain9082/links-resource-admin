import { TagTable } from "@/components/admin/resources/TaxonomyTable";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { getLegacyTags } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function TagsAdminPage() {
  const rows = await safeDb(
    () =>
      prisma.tag.findMany({
        include: { _count: { select: { resources: true } } },
        orderBy: { name: "asc" },
      }),
    []
  );
  const list = rows.length > 0 ? rows : await getLegacyTags();

  return (
    <div className="space-y-4">
      <PageHeader title="Tags" subtitle="Manage tag taxonomy and linked resource counts." />
      <TagTable rows={list} />
    </div>
  );
}

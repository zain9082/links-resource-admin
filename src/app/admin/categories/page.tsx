import { CategoryTable } from "@/components/admin/resources/TaxonomyTable";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { getLegacyCategories } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function CategoriesAdminPage() {
  const rows = await safeDb(
    () =>
      prisma.category.findMany({
        include: { _count: { select: { resources: true } } },
        orderBy: { name: "asc" },
      }),
    []
  );
  const list = rows.length > 0 ? rows : await getLegacyCategories();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Categories"
        subtitle="Inline add/edit categories and track resource usage counts."
      />
      <CategoryTable rows={list} />
    </div>
  );
}

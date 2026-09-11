import { ResourceForm } from "@/components/admin/resources/ResourceForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export default async function NewResourceAdminPage() {
  const [categories, tags, globalSeo] = await Promise.all([
    safeDb(
      () => prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      []
    ),
    safeDb(
      () => prisma.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      []
    ),
    safeDb(
      () => prisma.globalSeoSettings.findUnique({ where: { id: "global" } }),
      null
    ),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Add Resource"
        subtitle="Create a new resource entry with categories, tags, status, and metadata."
      />
      <ResourceForm
        categories={categories}
        tags={tags}
        siteUrl={globalSeo?.siteUrl ?? "https://linksresource.com"}
      />
    </div>
  );
}

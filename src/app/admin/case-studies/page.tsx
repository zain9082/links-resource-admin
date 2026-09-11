import { CaseStudiesAdminClient } from "@/components/admin/case-studies/CaseStudiesAdminClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { getLegacyCaseStudies } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function CaseStudiesAdminPage() {
  const rows = await safeDb(
    () => prisma.caseStudy.findMany({ orderBy: { updatedAt: "desc" } }),
    []
  );
  const list = rows.length > 0 ? rows : await getLegacyCaseStudies();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Case Studies"
        subtitle="Manage project outcomes, results narratives, and publish status."
      />
      <CaseStudiesAdminClient rows={list} />
    </div>
  );
}

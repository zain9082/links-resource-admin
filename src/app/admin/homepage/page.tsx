import { PageHeader } from "@/components/admin/ui/PageHeader";
import { HomepageEditor } from "@/components/admin/homepage/HomepageEditor";
import { prisma } from "@/lib/prisma";
import { getLegacyHomepageSections } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function HomepageAdminPage() {
  const rows = await safeDb(() => prisma.homepageContent.findMany(), []);
  const dbSections = rows.reduce<Record<string, unknown>>((accumulator, row) => {
    accumulator[row.section] = row.data;
    return accumulator;
  }, {});
  const legacySections = await getLegacyHomepageSections();
  const sections = { ...legacySections, ...dbSections };

  return (
    <div>
      <PageHeader
        title="Homepage Content"
        subtitle="Edit hero, services, metrics, FAQ, partners, and CTA sections."
      />
      <HomepageEditor sections={sections} />
    </div>
  );
}

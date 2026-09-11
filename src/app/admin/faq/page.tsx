import { FaqEditor } from "@/components/admin/homepage/FaqEditor";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { getLegacyHomepageSections } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function FaqAdminPage() {
  const faqRow = await safeDb(
    () =>
      prisma.homepageContent.findUnique({
        where: { section: "faq" },
      }),
    null
  );
  const legacy = faqRow ? null : await getLegacyHomepageSections();
  const faqs =
    (faqRow?.data as Array<{ q: string; a: string }> | undefined) ??
    (legacy?.faq as Array<{ q: string; a: string }> | undefined) ??
    [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="FAQ"
        subtitle="Add, reorder, and edit FAQ entries shown on the site."
      />
      <FaqEditor initialData={faqs} />
    </div>
  );
}

import { ContactInquiriesClient } from "@/components/admin/contact-inquiries/ContactInquiriesClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export default async function ContactInquiriesPage() {
  const rows = await safeDb(
    () =>
      prisma.contactInquiry.findMany({
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Contact inquiries"
        subtitle="Review messages submitted through the public website and respond by email."
      />
      <ContactInquiriesClient rows={rows} />
    </div>
  );
}

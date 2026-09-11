import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ServiceList } from "@/components/admin/services/ServiceList";
import { prisma } from "@/lib/prisma";
import { getLegacyServiceList } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function ServicesAdminPage() {
  const services = await safeDb(
    () =>
      prisma.servicePage.findMany({
        orderBy: { updatedAt: "desc" },
        select: { slug: true, name: true, updatedAt: true },
      }),
    []
  );
  const list = services.length > 0 ? services : await getLegacyServiceList();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Services"
        subtitle="Manage all service landing pages, packages, and content blocks."
      />
      <ServiceList services={list} />
    </div>
  );
}

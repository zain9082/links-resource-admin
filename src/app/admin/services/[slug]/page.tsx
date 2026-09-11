import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ServiceEditor } from "@/components/admin/services/ServiceEditor";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export default async function ServiceDetailAdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await safeDb(
    () =>
      prisma.servicePage.findUnique({
        where: { slug },
        select: { slug: true, name: true, data: true },
      }),
    null
  );

  const resolvedService = service ?? {
    slug,
    name: slug.replace(/-/g, " "),
    data: {},
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Edit ${resolvedService.name}`}
        subtitle="Update overview, package structure, process, deliverables, and CTA."
        backHref="/admin/services"
        backLabel="All services"
      />
      <ServiceEditor
        slug={resolvedService.slug}
        initial={{
          name: resolvedService.name,
          data: resolvedService.data as Record<string, unknown>,
        }}
      />
    </div>
  );
}

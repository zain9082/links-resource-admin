import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SeoAdminClient } from "@/components/admin/seo/SeoAdminClient";
import { PAGE_REGISTRY } from "@/lib/page-registry";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { SERVICE_LANDING_PATHS } from "@/lib/website-paths";
import { buildImportantSeoRoutes } from "@/lib/seo-admin";

export default async function SeoAdminPage() {
  const [settings, global] = await Promise.all([
    safeDb(() => prisma.seoSetting.findMany({ orderBy: { routePath: "asc" } }), []),
    safeDb(
      () => prisma.globalSeoSettings.findUnique({ where: { id: "global" } }),
      null
    ),
  ]);

  const registryPaths = PAGE_REGISTRY.map((entry) => entry.websitePath).filter(
    (path, index, all) => all.indexOf(path) === index
  );
  const routes = buildImportantSeoRoutes(registryPaths, [...SERVICE_LANDING_PATHS]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Page SEO"
        subtitle="Edit titles, descriptions, indexing, and social previews for important routes."
      />
      <SeoAdminClient
        settings={settings}
        routes={routes}
        siteUrl={global?.siteUrl ?? "https://linksresource.com"}
      />
    </div>
  );
}

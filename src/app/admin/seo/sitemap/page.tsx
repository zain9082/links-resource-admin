import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SitemapAdminClient } from "@/components/admin/seo/SitemapAdminClient";
import { PAGE_REGISTRY } from "@/lib/page-registry";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { SERVICE_LANDING_PATHS } from "@/lib/website-paths";

const EXTRA_STATIC = [
  "",
  "/resources",
  "/categories",
  "/submit",
  "/team",
  "/case-studies",
  "/link-building-services/publications",
];

export default async function SitemapAdminPage() {
  const global = await safeDb(
    () => prisma.globalSeoSettings.findUnique({ where: { id: "global" } }),
    null
  );

  const staticRoutes = [
    ...new Set([
      ...EXTRA_STATIC,
      ...PAGE_REGISTRY.map((entry) => entry.websitePath),
      ...SERVICE_LANDING_PATHS,
    ]),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Sitemap"
        subtitle="Preview what the public sitemap covers and notify Google when needed."
      />
      <SitemapAdminClient
        siteUrl={global?.siteUrl ?? "https://linksresource.com"}
        staticRoutes={staticRoutes}
      />
    </div>
  );
}

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { RobotsAdminClient } from "@/components/admin/seo/RobotsAdminClient";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { DEFAULT_ROBOTS_TXT } from "@/lib/seo-admin";

export default async function RobotsAdminPage() {
  const global = await safeDb(
    () => prisma.globalSeoSettings.findUnique({ where: { id: "global" } }),
    null
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Robots.txt"
        subtitle="Control crawler access rules served by the public website."
      />
      <RobotsAdminClient
        initial={{
          siteUrl: global?.siteUrl ?? "https://linksresource.com",
          siteName: global?.siteName ?? "Links Resource",
          titleTemplate: global?.titleTemplate ?? "%page_title% | %site_name%",
          defaultMetaDescription: global?.defaultMetaDescription ?? "",
          defaultOgImage: global?.defaultOgImage ?? "/og.png",
          favicon: global?.favicon ?? "",
          appleTouchIcon: global?.appleTouchIcon ?? "",
          defaultLocale: global?.defaultLocale ?? "en_GB",
          gscVerification: global?.gscVerification ?? "",
          ga4Id: global?.ga4Id ?? "",
          gtmId: global?.gtmId ?? "",
          robotsTxt: global?.robotsTxt ?? DEFAULT_ROBOTS_TXT,
          organizationSchemaJson: global?.organizationSchemaJson ?? "",
        }}
      />
    </div>
  );
}

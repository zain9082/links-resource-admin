import { PageHeader } from "@/components/admin/ui/PageHeader";
import { GlobalSeoClient } from "@/components/admin/seo/GlobalSeoClient";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { DEFAULT_ROBOTS_TXT } from "@/lib/seo-admin";

export default async function GlobalSeoAdminPage() {
  const global = await safeDb(
    () => prisma.globalSeoSettings.findUnique({ where: { id: "global" } }),
    null
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Global SEO settings"
        subtitle="Site-wide defaults for titles, social images, verification, and analytics."
      />
      <GlobalSeoClient
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

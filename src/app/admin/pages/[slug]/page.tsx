import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PageContentEditor } from "@/components/admin/pages/PageContentEditor";
import { Button } from "@/components/ui/button";
import { getPageRegistryEntry } from "@/lib/page-registry";
import { getLegacyPageContent, getLegacyTeamMembers } from "@/lib/legacy-content";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export default async function PageContentAdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getPageRegistryEntry(slug);
  if (!entry) notFound();

  const [row, seoSetting, globalSeo] = await Promise.all([
    safeDb(() => prisma.pageContent.findUnique({ where: { slug } }), null),
    safeDb(
      () =>
        prisma.seoSetting.findUnique({ where: { routePath: entry.websitePath } }),
      null
    ),
    safeDb(
      () => prisma.globalSeoSettings.findUnique({ where: { id: "global" } }),
      null
    ),
  ]);
  const data = row?.data ?? (await getLegacyPageContent(slug));

  const teamMembers =
    slug === "team-page"
      ? await (async () => {
          const members = await safeDb(
            () =>
              prisma.teamMember.findMany({
                orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
              }),
            []
          );
          return members.length > 0 ? members : await getLegacyTeamMembers();
        })()
      : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader title={entry.label} subtitle={entry.description} />
        <Button asChild variant="secondary" size="sm">
          <Link href={entry.websitePath} target="_blank" rel="noopener noreferrer">
            View on website
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <PageContentEditor
        slug={slug}
        label={entry.label}
        initialData={data}
        teamMembers={teamMembers}
        websitePath={entry.websitePath}
        initialSeo={seoSetting}
        siteUrl={globalSeo?.siteUrl ?? "https://linksresource.com"}
      />
    </div>
  );
}

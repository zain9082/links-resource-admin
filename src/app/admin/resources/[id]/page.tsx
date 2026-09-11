import { ResourceForm } from "@/components/admin/resources/ResourceForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export default async function EditResourceAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [resource, categories, tags, globalSeo] = await Promise.all([
    safeDb(
      () =>
        prisma.resource.findUnique({
          where: { id },
          include: { tags: true },
        }),
      null
    ),
    safeDb(
      () => prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      []
    ),
    safeDb(
      () => prisma.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      []
    ),
    safeDb(
      () => prisma.globalSeoSettings.findUnique({ where: { id: "global" } }),
      null
    ),
  ]);

  const resolvedResource = resource ?? {
    id,
    title: "Resource",
    slug: "",
    url: "",
    tagline: "",
    longDescription: "",
    categoryId: categories[0]?.id ?? "",
    tags: [] as Array<{ tagId: string }>,
    pricing: "FREEMIUM" as const,
    logoUrl: "",
    featured: false,
    status: "DRAFT" as const,
  };

  const seoSetting = resolvedResource.slug
    ? await safeDb(
        () =>
          prisma.seoSetting.findUnique({
            where: { routePath: `/resources/${resolvedResource.slug}` },
          }),
        null
      )
    : null;

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Edit ${resolvedResource.title}`}
        subtitle="Update resource content, taxonomy, SEO, and publish status."
      />
      <ResourceForm
        categories={categories}
        tags={tags}
        siteUrl={globalSeo?.siteUrl ?? "https://linksresource.com"}
        initialSeo={seoSetting}
        initial={{
          id: resolvedResource.id,
          name: resolvedResource.title,
          slug: resolvedResource.slug,
          websiteUrl: resolvedResource.url,
          shortDescription: resolvedResource.tagline,
          longDescription: resolvedResource.longDescription ?? "",
          categoryId: resolvedResource.categoryId,
          tags: resolvedResource.tags.map((entry) => entry.tagId),
          pricingTier: resolvedResource.pricing,
          logoUrl: resolvedResource.logoUrl ?? "",
          featured: resolvedResource.featured,
          status: resolvedResource.status,
        }}
      />
    </div>
  );
}

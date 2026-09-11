import * as legacyData from "@/lib/legacy/data";
import { publicationSites as legacyPublicationSites } from "@/lib/legacy/publications";
import { prisma } from "@/lib/prisma";

export async function getHomepageSection(section: string) {
  const fromDb = await prisma.homepageContent.findUnique({ where: { section } });
  if (fromDb) return fromDb.data;

  const map: Record<string, unknown> = {
    hero: {
      badgeText: "Trusted by 500+ Businesses",
      headlineLine1: "Premium Link Building",
      headlineLine2: "Digital Growth for Brands",
      headlineLine3: ["SEO", "Content", "Authority Building"],
      subheadline: legacyData.site.description,
    },
    services: legacyData.resources ?? [],
    faq: legacyData.faqs ?? [],
    "how-it-works": legacyData.howItWorks ?? [],
    "why-choose-us": legacyData.whyChooseUs ?? [],
    metrics: legacyData.websiteMetrics ?? [],
    partners: legacyData.partnerships ?? [],
  };
  return map[section] ?? null;
}

export async function getPublications() {
  const dbRows = await prisma.publication.findMany({ where: { active: true } });
  if (dbRows.length > 0) return dbRows;

  return legacyPublicationSites;
}

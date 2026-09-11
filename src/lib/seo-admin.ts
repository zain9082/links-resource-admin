import type { SeoSettingInput } from "@/lib/schemas";

export type SeoEditorValue = {
  metaTitle: string;
  metaDesc: string;
  h1: string;
  indexed: boolean;
  robotsFollow: boolean;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: "summary" | "summary_large_image";
  schemaType: string;
  customJsonLd: string;
  sitemapInclude: boolean;
  sitemapPriority: number;
};

export const DEFAULT_SEO_EDITOR_VALUE: SeoEditorValue = {
  metaTitle: "",
  metaDesc: "",
  h1: "",
  indexed: true,
  robotsFollow: true,
  canonical: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  twitterCard: "summary_large_image",
  schemaType: "",
  customJsonLd: "",
  sitemapInclude: true,
  sitemapPriority: 0.5,
};

export function seoRowToEditorValue(
  row?: Partial<{
    metaTitle: string | null;
    metaDesc: string | null;
    h1: string | null;
    indexed: boolean;
    robotsFollow: boolean;
    canonical: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterCard: string | null;
    schemaType: string | null;
    customJsonLd: string | null;
    sitemapInclude: boolean;
    sitemapPriority: number;
  }> | null
): SeoEditorValue {
  return {
    metaTitle: row?.metaTitle ?? "",
    metaDesc: row?.metaDesc ?? "",
    h1: row?.h1 ?? "",
    indexed: row?.indexed ?? true,
    robotsFollow: row?.robotsFollow ?? true,
    canonical: row?.canonical ?? "",
    ogTitle: row?.ogTitle ?? "",
    ogDescription: row?.ogDescription ?? "",
    ogImage: row?.ogImage ?? "",
    twitterCard:
      row?.twitterCard === "summary" ? "summary" : "summary_large_image",
    schemaType: row?.schemaType ?? "",
    customJsonLd: row?.customJsonLd ?? "",
    sitemapInclude: row?.sitemapInclude ?? true,
    sitemapPriority: row?.sitemapPriority ?? 0.5,
  };
}

export function seoEditorToInput(value: SeoEditorValue): SeoSettingInput {
  return {
    metaTitle: value.metaTitle,
    metaDesc: value.metaDesc,
    h1: value.h1,
    indexed: value.indexed,
    robotsFollow: value.robotsFollow,
    canonical: value.canonical,
    ogTitle: value.ogTitle,
    ogDescription: value.ogDescription,
    ogImage: value.ogImage,
    twitterCard: value.twitterCard,
    schemaType: value.schemaType,
    customJsonLd: value.customJsonLd,
    sitemapInclude: value.sitemapInclude,
    sitemapPriority: value.sitemapPriority,
  };
}

export function buildImportantSeoRoutes(
  registryPaths: string[],
  servicePaths: string[]
) {
  const routes = new Set<string>(["/", "/resources", ...registryPaths, ...servicePaths]);
  return [...routes].sort((a, b) => a.localeCompare(b));
}

export const SITEMAP_PRIORITY_OPTIONS = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0,
] as const;

export const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /login/
Disallow: /signup/
Disallow: /search/`;

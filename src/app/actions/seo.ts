"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite, revalidateWebsiteRedirects } from "@/lib/revalidate-site";
import {
  normalizeRedirectPath,
  wouldCreateRedirectLoop,
} from "@/lib/redirect-validation";
import {
  globalSeoSettingsSchema,
  redirectInputSchema,
  seoSettingInputSchema,
} from "@/lib/schemas";

const ADMIN_SEO_PATHS = [
  "/admin/seo",
  "/admin/seo/global",
  "/admin/seo/not-found",
  "/admin/seo/sitemap",
  "/admin/seo/robots",
  "/admin/redirects",
] as const;

const WEBSITE_SEO_PATHS = ["/", "/robots.txt", "/sitemap.xml"] as const;

function emptyToNull(value: string | undefined | null) {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function revalidateAdminSeoPaths() {
  for (const path of ADMIN_SEO_PATHS) {
    revalidatePath(path);
  }
}

async function revalidatePublicSeo(extraPaths: string[] = []) {
  await revalidateWebsite([...WEBSITE_SEO_PATHS, ...extraPaths]);
}

async function revalidateRedirectRuntime(extraPaths: string[] = []) {
  await revalidatePublicSeo(extraPaths);
  await revalidateWebsiteRedirects();
}

function seoSettingWriteData(data: z.infer<typeof seoSettingInputSchema>) {
  return {
    metaTitle: emptyToNull(data.metaTitle),
    metaDesc: emptyToNull(data.metaDesc),
    h1: emptyToNull(data.h1),
    indexed: data.indexed,
    robotsFollow: data.robotsFollow,
    canonical: emptyToNull(data.canonical),
    ogTitle: emptyToNull(data.ogTitle),
    ogDescription: emptyToNull(data.ogDescription),
    ogImage: emptyToNull(data.ogImage),
    twitterCard: data.twitterCard,
    schemaType: emptyToNull(data.schemaType),
    customJsonLd: emptyToNull(data.customJsonLd),
    sitemapInclude: data.sitemapInclude,
    sitemapPriority: data.sitemapPriority,
  };
}

function redirectWriteData(data: z.infer<typeof redirectInputSchema>) {
  return {
    source: normalizeRedirectPath(data.source),
    destination: data.statusCode === 410 ? "" : normalizeRedirectPath(data.destination),
    statusCode: data.statusCode,
    permanent: data.permanent,
    isRegex: data.isRegex,
    active: data.active,
  };
}

async function assertNoRedirectLoop(
  source: string,
  destination: string,
  excludeId?: string,
  isWildcard = false
) {
  if (!destination || isWildcard) return;
  const activeRedirects = await prisma.redirect.findMany({
    where: {
      active: true,
      isRegex: false,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { source: true, destination: true },
  });
  if (
    wouldCreateRedirectLoop(
      normalizeRedirectPath(source),
      normalizeRedirectPath(destination),
      activeRedirects
    )
  ) {
    throw new Error("This redirect would create a loop.");
  }
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
}

function escapeCsv(value: string | number | boolean | null | undefined) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

const upsertSeoSchema = z.object({
  routePath: z.string().startsWith("/"),
  data: seoSettingInputSchema,
});

const updateRedirectSchema = z.object({
  id: z.string().min(1),
  data: redirectInputSchema,
});

export async function upsertGlobalSeoSettings(data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = globalSeoSettingsSchema.parse(data);

    await prisma.globalSeoSettings.upsert({
      where: { id: "global" },
      update: {
        siteUrl: parsed.siteUrl,
        siteName: parsed.siteName,
        titleTemplate: parsed.titleTemplate,
        defaultMetaDescription: emptyToNull(parsed.defaultMetaDescription),
        defaultOgImage: emptyToNull(parsed.defaultOgImage),
        favicon: emptyToNull(parsed.favicon),
        appleTouchIcon: emptyToNull(parsed.appleTouchIcon),
        defaultLocale: parsed.defaultLocale,
        gscVerification: emptyToNull(parsed.gscVerification),
        ga4Id: emptyToNull(parsed.ga4Id),
        gtmId: emptyToNull(parsed.gtmId),
        robotsTxt: emptyToNull(parsed.robotsTxt),
        organizationSchemaJson: emptyToNull(parsed.organizationSchemaJson),
      },
      create: {
        id: "global",
        siteUrl: parsed.siteUrl,
        siteName: parsed.siteName,
        titleTemplate: parsed.titleTemplate,
        defaultMetaDescription: emptyToNull(parsed.defaultMetaDescription),
        defaultOgImage: emptyToNull(parsed.defaultOgImage),
        favicon: emptyToNull(parsed.favicon),
        appleTouchIcon: emptyToNull(parsed.appleTouchIcon),
        defaultLocale: parsed.defaultLocale,
        gscVerification: emptyToNull(parsed.gscVerification),
        ga4Id: emptyToNull(parsed.ga4Id),
        gtmId: emptyToNull(parsed.gtmId),
        robotsTxt: emptyToNull(parsed.robotsTxt),
        organizationSchemaJson: emptyToNull(parsed.organizationSchemaJson),
      },
    });

    await logActivity({
      adminId: userId,
      action: "UPDATED",
      entity: "GlobalSeoSettings",
      entityId: "global",
    });

    revalidateAdminSeoPaths();
    await revalidatePublicSeo();
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

export async function upsertSeoSetting(routePath: string, data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = upsertSeoSchema.parse({ routePath, data });
    const writeData = seoSettingWriteData(parsed.data);

    await prisma.seoSetting.upsert({
      where: { routePath: parsed.routePath },
      update: writeData,
      create: {
        routePath: parsed.routePath,
        ...writeData,
      },
    });

    await logActivity({
      adminId: userId,
      action: "UPDATED",
      entity: "SeoSetting",
      entityId: parsed.routePath,
    });

    revalidatePath("/admin/seo");
    revalidateAdminSeoPaths();
    await revalidatePublicSeo([parsed.routePath]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

export async function createRedirect(data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = redirectInputSchema.parse(data);
    await assertNoRedirectLoop(
      parsed.source,
      parsed.destination,
      undefined,
      parsed.isRegex
    );

    const created = await prisma.redirect.create({
      data: redirectWriteData(parsed),
      select: { id: true },
    });

    await logActivity({
      adminId: userId,
      action: "CREATED",
      entity: "Redirect",
      entityId: created.id,
      detail: `${parsed.source} -> ${parsed.destination || "(410)"} [${parsed.statusCode}]`,
    });

    revalidateAdminSeoPaths();
    await revalidateRedirectRuntime(
      [parsed.source, parsed.destination].filter(Boolean)
    );
    return { success: true as const };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create redirect";
    return { error: message };
  }
}

export async function updateRedirect(id: string, data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = updateRedirectSchema.parse({ id, data });
    await assertNoRedirectLoop(
      parsed.data.source,
      parsed.data.destination,
      parsed.id,
      parsed.data.isRegex
    );

    const updated = await prisma.redirect.update({
      where: { id: parsed.id },
      data: redirectWriteData(parsed.data),
      select: { id: true, source: true, destination: true },
    });

    await logActivity({
      adminId: userId,
      action: "UPDATED",
      entity: "Redirect",
      entityId: updated.id,
      detail: `${updated.source} -> ${updated.destination || "(410)"}`,
    });

    revalidateAdminSeoPaths();
    await revalidatePublicSeo(
      [updated.source, updated.destination].filter(Boolean)
    );
    return { success: true as const };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update redirect";
    return { error: message };
  }
}

export async function toggleRedirect(id: string) {
  try {
    const { userId } = await requireAdminSession();
    const existing = await prisma.redirect.findUnique({ where: { id } });
    if (!existing) return { error: "Redirect not found" };

    const updated = await prisma.redirect.update({
      where: { id },
      data: { active: !existing.active },
      select: { id: true, active: true, source: true },
    });

    await logActivity({
      adminId: userId,
      action: "UPDATED",
      entity: "Redirect",
      entityId: updated.id,
      detail: `${updated.source} ${updated.active ? "enabled" : "disabled"}`,
    });

    revalidateAdminSeoPaths();
    await revalidateRedirectRuntime([updated.source]);
    return { success: true as const, active: updated.active };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to toggle redirect";
    return { error: message };
  }
}

export async function deleteRedirect(id: string) {
  try {
    const { userId } = await requireAdminSession();
    const existing = await prisma.redirect.findUnique({
      where: { id },
      select: { id: true, source: true },
    });
    if (!existing) return { error: "Redirect not found" };

    await prisma.redirect.delete({ where: { id } });

    await logActivity({
      adminId: userId,
      action: "DELETED",
      entity: "Redirect",
      entityId: existing.id,
      detail: existing.source,
    });

    revalidateAdminSeoPaths();
    await revalidateRedirectRuntime([existing.source]);
    return { success: true as const };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete redirect";
    return { error: message };
  }
}

export async function importRedirectsCsv(csvText: string) {
  try {
    const { userId } = await requireAdminSession();
    const text = z.string().min(1, "CSV text is required").parse(csvText);
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return { imported: 0, skipped: 0, errors: ["CSV is empty"] };
    }

    let startIndex = 0;
    const firstCells = parseCsvLine(lines[0]).map((cell) => cell.toLowerCase());
    if (
      firstCells.includes("source") &&
      (firstCells.includes("destination") || firstCells.includes("target"))
    ) {
      startIndex = 1;
    }

    const errors: string[] = [];
    const rows: Array<z.infer<typeof redirectInputSchema>> = [];
    const seenSources = new Set<string>();

    for (let i = startIndex; i < lines.length; i += 1) {
      const lineNumber = i + 1;
      const cells = parseCsvLine(lines[i]);
      const [sourceRaw, destinationRaw, statusRaw, regexRaw, activeRaw] = cells;
      if (!sourceRaw) {
        errors.push(`Line ${lineNumber}: missing source`);
        continue;
      }

      const statusParsed = Number(statusRaw || 301);
      const statusCode =
        statusParsed === 302 || statusParsed === 410 ? statusParsed : 301;
      const parsed = redirectInputSchema.safeParse({
        source: sourceRaw,
        destination: destinationRaw ?? "",
        statusCode,
        isRegex: /^(1|true|yes)$/i.test(regexRaw ?? ""),
        active: activeRaw == null || activeRaw === ""
          ? true
          : /^(1|true|yes)$/i.test(activeRaw),
      });

      if (!parsed.success) {
        errors.push(
          `Line ${lineNumber}: ${parsed.error.issues[0]?.message ?? "invalid row"}`
        );
        continue;
      }

      if (seenSources.has(parsed.data.source)) {
        errors.push(`Line ${lineNumber}: duplicate source ${parsed.data.source}`);
        continue;
      }
      seenSources.add(parsed.data.source);
      rows.push(parsed.data);
    }

    if (errors.length > 0) {
      return { imported: 0, skipped: 0, errors };
    }

    const existing = await prisma.redirect.findMany({
      where: { source: { in: rows.map((row) => row.source) } },
      select: { source: true },
    });
    const existingSources = new Set(existing.map((row) => row.source));
    const toInsert = rows.filter((row) => !existingSources.has(row.source));
    const skipped = rows.length - toInsert.length;

    await prisma.$transaction(async (tx) => {
      if (toInsert.length > 0) {
        await tx.redirect.createMany({
          data: toInsert.map((row) => redirectWriteData(row)),
        });
      }
      await tx.activityLog.create({
        data: {
          adminId: userId,
          action: "CREATED",
          entity: "Redirect",
          detail: `CSV import: ${toInsert.length} imported, ${skipped} skipped`,
        },
      });
    });

    revalidateAdminSeoPaths();
    await revalidateRedirectRuntime(toInsert.map((row) => row.source));
    return { imported: toInsert.length, skipped, errors: [] as string[] };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to import redirects";
    return { imported: 0, skipped: 0, errors: [message] };
  }
}

export async function exportRedirectsCsv() {
  try {
    await requireAdminSession();
    const redirects = await prisma.redirect.findMany({
      orderBy: { source: "asc" },
    });

    const header = [
      "source",
      "destination",
      "statusCode",
      "isRegex",
      "active",
      "hitCount",
      "lastHitAt",
    ].join(",");

    const lines = redirects.map((row) =>
      [
        escapeCsv(row.source),
        escapeCsv(row.destination),
        escapeCsv(row.statusCode),
        escapeCsv(row.isRegex),
        escapeCsv(row.active),
        escapeCsv(row.hitCount),
        escapeCsv(row.lastHitAt?.toISOString() ?? ""),
      ].join(",")
    );

    return { success: true as const, csv: [header, ...lines].join("\n") };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to export redirects";
    return { error: message };
  }
}

export async function createRedirectFromNotFound(
  path: string,
  destination: string,
  statusCode: 301 | 302 | 410 = 301
) {
  try {
    const { userId } = await requireAdminSession();
    const source = z
      .string()
      .trim()
      .min(1)
      .refine((value) => value.startsWith("/"), "Path must start with /")
      .parse(path);

    const parsed = redirectInputSchema.parse({
      source,
      destination: statusCode === 410 ? "" : destination,
      statusCode,
      isRegex: false,
      active: true,
    });

    await assertNoRedirectLoop(parsed.source, parsed.destination);

    await prisma.$transaction(async (tx) => {
      await tx.redirect.upsert({
        where: { source: parsed.source },
        update: redirectWriteData(parsed),
        create: redirectWriteData(parsed),
      });
      await tx.notFoundLog.updateMany({
        where: { path: source },
        data: { resolved: true },
      });
      await tx.activityLog.create({
        data: {
          adminId: userId,
          action: "CREATED",
          entity: "Redirect",
          detail: `From 404: ${parsed.source} -> ${parsed.destination || "(410)"}`,
        },
      });
    });

    revalidateAdminSeoPaths();
    await revalidateRedirectRuntime([parsed.source, parsed.destination].filter(Boolean));
    return { success: true as const };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create redirect";
    return { error: message };
  }
}

export async function markNotFoundGone(path: string) {
  return createRedirectFromNotFound(path, "", 410);
}

export async function markNotFoundResolved(path: string) {
  try {
    const { userId } = await requireAdminSession();
    const source = z.string().trim().min(1).parse(path);

    const updated = await prisma.notFoundLog.updateMany({
      where: { path: source },
      data: { resolved: true },
    });

    if (updated.count === 0) {
      return { error: "404 log entry not found" };
    }

    await logActivity({
      adminId: userId,
      action: "UPDATED",
      entity: "NotFoundLog",
      entityId: source,
      detail: "Marked resolved",
    });

    revalidatePath("/admin/seo/not-found");
    return { success: true as const };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to mark resolved";
    return { error: message };
  }
}

export async function ensureRedirectOnSlugChange(
  oldPath: string,
  newPath: string
) {
  try {
    const { userId } = await requireAdminSession();
    const oldNormalized = normalizeRedirectPath(
      z
        .string()
        .trim()
        .refine((value) => value.startsWith("/"), "Old path must start with /")
        .parse(oldPath)
    );
    const newNormalized = normalizeRedirectPath(
      z
        .string()
        .trim()
        .refine((value) => value.startsWith("/"), "New path must start with /")
        .parse(newPath)
    );

    if (oldNormalized === newNormalized) {
      return { success: true as const, created: false as const, collapsed: 0 };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Collapse chains: anything pointing at old path should point at the new path.
      const collapsed = await tx.redirect.updateMany({
        where: {
          destination: oldNormalized,
          active: true,
          isRegex: false,
          NOT: { source: newNormalized },
        },
        data: { destination: newNormalized },
      });

      const existing = await tx.redirect.findUnique({
        where: { source: oldNormalized },
      });

      if (existing) {
        if (!existing.active) {
          return {
            created: false as const,
            collapsed: collapsed.count,
            warning:
              "An inactive redirect already exists for the old path. It was left unchanged; pointing rules were collapsed where safe.",
          };
        }
        if (existing.destination === newNormalized) {
          return { created: false as const, collapsed: collapsed.count };
        }
        // Manual rule exists with a different destination — do not overwrite.
        return {
          created: false as const,
          collapsed: collapsed.count,
          warning:
            "A redirect already exists for the old path. It was left unchanged; other rules pointing at the old path were collapsed to the new path where safe.",
        };
      }

      const activeExact = await tx.redirect.findMany({
        where: { active: true, isRegex: false },
        select: { source: true, destination: true },
      });
      if (
        wouldCreateRedirectLoop(oldNormalized, newNormalized, activeExact)
      ) {
        throw new Error("This slug redirect would create a loop.");
      }

      await tx.redirect.create({
        data: {
          source: oldNormalized,
          destination: newNormalized,
          statusCode: 301,
          permanent: true,
          isRegex: false,
          active: true,
        },
      });

      return { created: true as const, collapsed: collapsed.count };
    });

    await logActivity({
      adminId: userId,
      action: "CREATED",
      entity: "Redirect",
      entityId: oldNormalized,
      detail: `Slug change: ${oldNormalized} -> ${newNormalized} (collapsed ${result.collapsed})`,
    });

    revalidateAdminSeoPaths();
    await revalidateRedirectRuntime([oldNormalized, newNormalized]);
    return {
      success: true as const,
      created: result.created,
      collapsed: result.collapsed,
      ...("warning" in result ? { warning: result.warning } : {}),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create slug redirect";
    return { error: message };
  }
}

export async function pingGoogleSitemap() {
  try {
    await requireAdminSession();
    const global = await prisma.globalSeoSettings.findUnique({
      where: { id: "global" },
      select: { siteUrl: true },
    });

    const siteUrl = (global?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "")
      .trim()
      .replace(/\/+$/, "");

    if (!siteUrl) {
      return {
        success: false as const,
        message:
          "Set a site URL in Global SEO settings before pinging Google.",
      };
    }

    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    // Google discontinued sitemap ping support in 2023. Probe the endpoint and
    // report the real outcome — never fake success.
    let response: Response;
    try {
      response = await fetch(pingUrl, {
        method: "GET",
        cache: "no-store",
        redirect: "follow",
        signal: AbortSignal.timeout(10_000),
      });
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Network request failed";
      return {
        success: false as const,
        message: `Google sitemap ping is unavailable (${detail}). Google deprecated ping — submit/update your sitemap in Google Search Console instead: ${sitemapUrl}`,
        sitemapUrl,
      };
    }

    if (!response.ok) {
      return {
        success: false as const,
        message: `Google returned HTTP ${response.status} for the ping endpoint. Sitemap ping was deprecated — use Google Search Console to submit ${sitemapUrl}`,
        sitemapUrl,
        status: response.status,
      };
    }

    const body = (await response.text()).slice(0, 500);
    const looksDeprecated =
      /deprecated|no longer|not supported|discontinued/i.test(body) ||
      body.trim().length === 0;

    if (looksDeprecated) {
      return {
        success: false as const,
        message: `Google no longer supports sitemap ping. Submit ${sitemapUrl} in Google Search Console instead.`,
        sitemapUrl,
        status: response.status,
      };
    }

    return {
      success: true as const,
      message: `Ping accepted by Google for ${sitemapUrl}`,
      sitemapUrl,
      status: response.status,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to ping Google";
    return { success: false as const, message };
  }
}

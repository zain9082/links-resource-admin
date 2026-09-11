import { Role } from "@prisma/client";
import { z } from "zod";
import {
  isExactLocalPath,
  isSafeWildcardSource,
} from "@/lib/redirect-validation";

export const homepageSectionSchema = z.object({
  section: z.string().min(1),
  data: z.unknown(),
});

export const servicePageInputSchema = z.object({
  name: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
});

const optionalHttpUrl = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || /^https?:\/\//i.test(value),
    "Enter a full URL starting with http:// or https://"
  );

/** Accepts absolute URLs or same-origin public paths like /team/usama.png */
const optionalImageRef = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) =>
      value === "" ||
      /^https?:\/\//i.test(value) ||
      /^\/(?!\/)[^\s]*$/i.test(value),
    "Use a full image URL or a public path like /team/usama.png"
  );

export const teamMemberInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  email: z.string().email(),
  imageUrl: optionalImageRef,
  linkedIn: optionalHttpUrl,
  twitter: optionalHttpUrl,
  displayOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const caseStudyInputSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().min(1),
  industry: z.string().min(1),
  title: z.string().min(1),
  challenge: z.string().min(1),
  solution: z.string().min(1),
  results: z.string().min(1),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).max(4),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export const testimonialInputSchema = z.object({
  id: z.string().optional(),
  authorName: z.string().min(1),
  company: z.string().min(1),
  role: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  quote: z.string().min(1),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

export const pricingPlanInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  price: z.string().min(1),
  billingNote: z.string().optional(),
  features: z.array(z.string()),
  isPopular: z.boolean().default(false),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  color: z.enum(["purple", "blue", "pink"]).default("purple"),
  displayOrder: z.number().int().default(0),
});

export const publicationInputSchema = z.object({
  id: z.string().optional(),
  siteName: z.string().min(1),
  url: z.string().url(),
  da: z.number().int().min(0).max(100),
  dr: z.number().int().min(0).max(100).optional(),
  niche: z.string().min(1),
  type: z.string().min(1),
  tat: z.number().int().min(0),
  price: z.number().min(0),
  doFollow: z.boolean().default(true),
  sponsored: z.boolean().default(false),
  traffic: z.string().optional(),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});

const optionalCanonical = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) =>
      value === "" ||
      /^\/(?!\/)[^\s]*$/i.test(value) ||
      /^https:\/\/[^\s]+$/i.test(value),
    "Canonical must be empty, a path like /about, or an https URL"
  )
  .refine((value) => {
    if (!value || value.startsWith("/")) return true;
    try {
      const host = new URL(value).hostname.toLowerCase();
      return (
        host !== "localhost" &&
        !host.endsWith(".localhost") &&
        host !== "127.0.0.1" &&
        !host.endsWith(".vercel.app")
      );
    } catch {
      return false;
    }
  }, "Canonical cannot use localhost or vercel.app — use a path or the production domain");

const localPathOrEmpty = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\/(?!\/)[^\s]*$/i.test(value),
    "Destination must be a local path like /new-page, or empty for 410"
  );

const redirectSourceSchema = z
  .string()
  .trim()
  .min(1, "Source is required")
  .max(500, "Source is too long")
  .refine((value) => !/\s/.test(value), "Source cannot contain spaces");

function stripGscMetaTag(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const contentMatch = trimmed.match(
    /content\s*=\s*["']([^"']+)["']/i
  );
  if (contentMatch?.[1]) return contentMatch[1].trim();
  return trimmed.replace(/^google-site-verification[=:\s]+/i, "").trim();
}

function normalizeSiteUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export const seoSettingInputSchema = z.object({
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDesc: z.string().max(320).optional().or(z.literal("")),
  h1: z.string().max(200).optional().or(z.literal("")),
  indexed: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
  canonical: optionalCanonical,
  ogTitle: z.string().max(120).optional().or(z.literal("")),
  ogDescription: z.string().max(320).optional().or(z.literal("")),
  ogImage: optionalImageRef,
  twitterCard: z.enum(["summary", "summary_large_image"]).default("summary_large_image"),
  schemaType: z.string().max(80).optional().or(z.literal("")),
  customJsonLd: z
    .string()
    .max(50_000)
    .optional()
    .or(z.literal(""))
    .refine((value) => {
      if (!value || !value.trim()) return true;
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }, "Custom JSON-LD must be valid JSON"),
  sitemapInclude: z.boolean().default(true),
  sitemapPriority: z.number().min(0.1).max(1.0).default(0.5),
});

export const redirectInputSchema = z
  .object({
    source: redirectSourceSchema,
    destination: localPathOrEmpty.default(""),
    statusCode: z.union([z.literal(301), z.literal(302), z.literal(410)]).default(301),
    /** When true, source is a safe trailing wildcard like /product/* (not raw JS regex). */
    isRegex: z.boolean().default(false),
    active: z.boolean().default(true),
  })
  .superRefine((value, ctx) => {
    if (value.isRegex) {
      if (!isSafeWildcardSource(value.source)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Wildcard sources must look like /section/* (single trailing * only; no regex).",
          path: ["source"],
        });
      }
    } else if (!isExactLocalPath(value.source) && !/^\/(?!\/)/.test(value.source)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source must be a local path starting with /",
        path: ["source"],
      });
    } else if (value.source.includes("*")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enable Wildcard mode to use /path/* patterns",
        path: ["source"],
      });
    }

    if (value.statusCode === 410) {
      if (value.destination !== "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "410 Gone redirects should leave destination empty",
          path: ["destination"],
        });
      }
      return;
    }
    if (!value.destination) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Destination is required for 301/302 redirects",
        path: ["destination"],
      });
    }
    if (value.source === value.destination) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Redirect source and destination must be different",
        path: ["destination"],
      });
    }
  })
  .transform((value) => ({
    ...value,
    source: value.isRegex ? value.source.trim() : value.source.trim().replace(/\/+$/, "") || "/",
    destination:
      value.statusCode === 410
        ? ""
        : value.destination.trim().replace(/\/+$/, "") || "/",
    permanent: value.statusCode === 301,
  }));

export const globalSeoSettingsSchema = z.object({
  siteUrl: z
    .string()
    .trim()
    .url("Enter a valid site URL")
    .refine((value) => /^https:\/\//i.test(value), "Site URL must use https")
    .refine((value) => {
      try {
        const host = new URL(value).hostname.toLowerCase();
        return (
          host !== "localhost" &&
          !host.endsWith(".localhost") &&
          host !== "127.0.0.1" &&
          !host.endsWith(".vercel.app")
        );
      } catch {
        return false;
      }
    }, "Use the real production domain (not localhost or vercel.app)")
    .transform(normalizeSiteUrl),
  siteName: z.string().trim().min(1).max(120),
  titleTemplate: z.string().trim().min(1).max(200),
  defaultMetaDescription: z.string().max(320).optional().or(z.literal("")),
  defaultOgImage: optionalImageRef,
  favicon: optionalImageRef,
  appleTouchIcon: optionalImageRef,
  defaultLocale: z.string().trim().min(2).max(20).default("en_GB"),
  gscVerification: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .transform((value) => stripGscMetaTag(value ?? "")),
  ga4Id: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || /^G-[A-Z0-9]+$/i.test(value),
      "GA4 ID must look like G-XXXXXXXX"
    ),
  gtmId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || /^GTM-[A-Z0-9]+$/i.test(value),
      "GTM ID must look like GTM-XXXXXXX"
    ),
  robotsTxt: z.string().max(20_000).optional().or(z.literal("")),
  organizationSchemaJson: z
    .string()
    .max(50_000)
    .optional()
    .or(z.literal(""))
    .refine((value) => {
      if (!value || !value.trim()) return true;
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }, "Organization schema must be valid JSON"),
});

export const userRoleSchema = z.nativeEnum(Role);

export type ServicePageInput = z.infer<typeof servicePageInputSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberInputSchema>;
export type CaseStudyInput = z.infer<typeof caseStudyInputSchema>;
export type TestimonialInput = z.infer<typeof testimonialInputSchema>;
export type PricingPlanInput = z.infer<typeof pricingPlanInputSchema>;
export type PublicationInput = z.infer<typeof publicationInputSchema>;
export type SeoSettingInput = z.infer<typeof seoSettingInputSchema>;
export type RedirectInput = z.infer<typeof redirectInputSchema>;
export type GlobalSeoSettingsInput = z.infer<typeof globalSeoSettingsSchema>;

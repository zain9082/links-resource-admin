import {
  getServiceLandingPath,
  SERVICE_LANDING_SLUGS,
  type ServiceLandingSlug,
} from "@/lib/service-landing-defaults";

export const SERVICE_LANDING_PATHS = SERVICE_LANDING_SLUGS.map((slug) =>
  getServiceLandingPath(slug)
);

/** Pages that render testimonials / reviews from the CMS. */
export const TESTIMONIAL_PAGE_PATHS = [
  "/",
  "/link-building-services",
  "/seo-services",
  "/content-writing-services",
  "/local-seo-services",
  "/web-development-services",
] as const;

/** Pages that show team members or team-related sections. */
export const TEAM_PAGE_PATHS = [
  "/team",
  "/",
  "/about",
  "/web-development-services",
] as const;

export function serviceLandingRevalidatePaths(slug: ServiceLandingSlug): string[] {
  const path = getServiceLandingPath(slug);
  if (slug === "link-building-services") {
    return [path, `${path}/publications`];
  }
  return [path];
}

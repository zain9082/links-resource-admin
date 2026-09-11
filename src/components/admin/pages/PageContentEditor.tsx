"use client";

import { AboutPageEditor } from "@/components/admin/pages/editors/AboutPageEditor";
import { CaseStudiesPageEditor } from "@/components/admin/pages/editors/CaseStudiesPageEditor";
import { ContactPageEditor } from "@/components/admin/pages/editors/ContactPageEditor";
import { LegalPageEditor } from "@/components/admin/pages/editors/LegalPageEditor";
import { NavbarServicesMenuEditor } from "@/components/admin/pages/editors/NavbarServicesMenuEditor";
import { ServiceLandingPageEditor } from "@/components/admin/pages/editors/ServiceLandingPageEditor";
import { SimpleHeaderPageEditor } from "@/components/admin/pages/editors/SimpleHeaderPageEditor";
import { SiteSettingsEditor } from "@/components/admin/pages/editors/SiteSettingsEditor";
import { TeamPageEditor } from "@/components/admin/pages/editors/TeamPageEditor";
import { isLegalPageSlug, isServiceLandingSlug } from "@/lib/service-landing-defaults";
import { seoRowToEditorValue } from "@/lib/seo-admin";

type TeamMemberRecord = {
  id: string;
  name: string;
  role: string;
  email: string;
  bio: string;
  imageUrl: string | null;
  linkedIn: string | null;
  twitter: string | null;
  displayOrder: number;
  active: boolean;
};

type PageContentEditorProps = {
  slug: string;
  label: string;
  initialData: unknown;
  teamMembers?: TeamMemberRecord[];
  websitePath: string;
  initialSeo?: Parameters<typeof seoRowToEditorValue>[0];
  siteUrl?: string;
};

export function PageContentEditor({
  slug,
  label,
  initialData,
  teamMembers = [],
  websitePath,
  initialSeo,
  siteUrl,
}: PageContentEditorProps) {
  if (isServiceLandingSlug(slug)) {
    return (
      <ServiceLandingPageEditor
        slug={slug}
        label={label}
        initialData={initialData}
        websitePath={websitePath}
        initialSeo={initialSeo}
        siteUrl={siteUrl}
      />
    );
  }

  if (isLegalPageSlug(slug)) {
    return <LegalPageEditor slug={slug} label={label} initialData={initialData} />;
  }

  switch (slug) {
    case "site-settings":
      return <SiteSettingsEditor slug={slug} label={label} initialData={initialData} />;
    case "about":
      return (
        <AboutPageEditor
          slug={slug}
          label={label}
          initialData={initialData}
          websitePath={websitePath}
          initialSeo={initialSeo}
          siteUrl={siteUrl}
        />
      );
    case "team-page":
      return (
        <TeamPageEditor
          slug={slug}
          label={label}
          initialData={initialData}
          members={teamMembers}
        />
      );
    case "case-studies-page":
      return <CaseStudiesPageEditor slug={slug} label={label} initialData={initialData} />;
    case "navbar-services-menu":
      return (
        <NavbarServicesMenuEditor slug={slug} label={label} initialData={initialData} />
      );
    case "contact":
      return <ContactPageEditor slug={slug} label={label} initialData={initialData} />;
    case "resources-page":
    case "submit-page":
      return <SimpleHeaderPageEditor slug={slug} label={label} initialData={initialData} />;
    default:
      return (
        <p className="text-sm text-[var(--color-muted)]">
          No form editor is configured for this page yet.
        </p>
      );
  }
}

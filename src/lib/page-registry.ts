import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  Code,
  FileText,
  FolderTree,
  Globe,
  Home,
  Info,
  Layers,
  Link2,
  Mail,
  MapPin,
  MessageSquare,
  PenLine,
  Search,
  Settings,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";
import {
  getServiceLandingPath,
  SERVICE_LANDING_DEFAULTS,
  SERVICE_LANDING_SLUGS,
  type ServiceLandingSlug,
} from "@/lib/service-landing-defaults";
import { serviceLandingRevalidatePaths, SERVICE_LANDING_PATHS } from "@/lib/website-paths";

export type PageRegistryEntry = {
  slug: string;
  label: string;
  description: string;
  websitePath: string;
  icon: LucideIcon;
  revalidatePaths: string[];
};

const SERVICE_LANDING_META: Record<
  ServiceLandingSlug,
  { label: string; description: string; icon: LucideIcon }
> = {
  "link-building-services": {
    label: "Link Building Services",
    description: "Link building services landing page content.",
    icon: Link2,
  },
  "seo-services": {
    label: "SEO Services",
    description: "SEO services landing page hero, trust points, and CTA.",
    icon: Search,
  },
  "content-writing-services": {
    label: "Content Writing Services",
    description: "Content writing services landing page content.",
    icon: PenLine,
  },
  "local-seo-services": {
    label: "Local SEO Services",
    description: "Local SEO services landing page content.",
    icon: MapPin,
  },
  "guest-posting-services": {
    label: "Guest Posting Services",
    description: "Guest posting services landing page content.",
    icon: Globe,
  },
  "web-development-services": {
    label: "Web Development Services",
    description: "Web development services landing page content.",
    icon: Code,
  },
  "editorial-link-building-services": {
    label: "Editorial Link Building",
    description: "Editorial link building services landing page content.",
    icon: FileText,
  },
  "white-label-link-building-services": {
    label: "White Label Link Building",
    description: "White-label link building services landing page content.",
    icon: Briefcase,
  },
  "authority-backlinks-services": {
    label: "Authority Backlinks",
    description: "Authority backlinks services landing page content.",
    icon: ShieldCheck,
  },
};

const SERVICE_LANDING_REGISTRY: PageRegistryEntry[] = SERVICE_LANDING_SLUGS.map((slug) => {
  const meta = SERVICE_LANDING_META[slug];
  return {
    slug,
    label: meta.label,
    description: meta.description,
    websitePath: getServiceLandingPath(slug),
    icon: meta.icon,
    revalidatePaths: serviceLandingRevalidatePaths(slug),
  };
});

export const PAGE_REGISTRY: PageRegistryEntry[] = [
  {
    slug: "site-settings",
    label: "Site Settings",
    description: "Global site name, contact details, and social links.",
    websitePath: "/",
    icon: Settings,
    revalidatePaths: ["/", "/contact"],
  },
  {
    slug: "navbar-services-menu",
    label: "Navbar Services Menu",
    description: "Services mega menu dropdown in the site header.",
    websitePath: "/",
    icon: Layers,
    revalidatePaths: [
      "/",
      "/contact",
      "/about",
      "/team",
      "/case-studies",
      ...SERVICE_LANDING_PATHS,
    ],
  },
  {
    slug: "about",
    label: "About Page",
    description: "Full about page content — hero, sections, and CTA.",
    websitePath: "/about",
    icon: Info,
    revalidatePaths: ["/about"],
  },
  {
    slug: "team-page",
    label: "Team Page",
    description: "Manage team members/photos plus team page headings, trust points, and workflow copy.",
    websitePath: "/team",
    icon: Users,
    revalidatePaths: ["/team", "/", "/about", "/web-development-services"],
  },
  {
    slug: "case-studies-page",
    label: "Case Studies Page",
    description: "Case studies landing page hero and intro copy.",
    websitePath: "/case-studies",
    icon: FileText,
    revalidatePaths: ["/case-studies"],
  },
  {
    slug: "contact",
    label: "Contact Page",
    description: "Contact page header and intro text.",
    websitePath: "/contact",
    icon: Mail,
    revalidatePaths: ["/contact"],
  },
  ...SERVICE_LANDING_REGISTRY,
  {
    slug: "privacy-policy",
    label: "Privacy Policy",
    description: "Privacy policy legal page content.",
    websitePath: "/privacy-policy",
    icon: ShieldCheck,
    revalidatePaths: ["/privacy-policy"],
  },
  {
    slug: "terms-of-service",
    label: "Terms of Service",
    description: "Terms of service legal page content.",
    websitePath: "/terms-of-service",
    icon: FileText,
    revalidatePaths: ["/terms-of-service"],
  },
  {
    slug: "refund-policy",
    label: "Refund Policy",
    description: "Refund policy legal page content.",
    websitePath: "/refund-policy",
    icon: ShieldCheck,
    revalidatePaths: ["/refund-policy"],
  },
  {
    slug: "service-policy",
    label: "Service Policy",
    description: "Service delivery policy legal page content.",
    websitePath: "/service-policy",
    icon: FileText,
    revalidatePaths: ["/service-policy"],
  },
  {
    slug: "resources-page",
    label: "Resources Page",
    description: "Resources directory page header and intro.",
    websitePath: "/resources",
    icon: FolderTree,
    revalidatePaths: ["/resources", "/categories"],
  },
  {
    slug: "submit-page",
    label: "Submit Page",
    description: "Resource submission page header and intro.",
    websitePath: "/submit",
    icon: MessageSquare,
    revalidatePaths: ["/submit"],
  },
];

const serviceLandingNavItems = SERVICE_LANDING_SLUGS.map((slug) => ({
  label: SERVICE_LANDING_META[slug].label,
  href: `/admin/pages/${slug}`,
  icon: SERVICE_LANDING_META[slug].icon,
}));

export const ADMIN_NAV_PAGES = {
  overview: [{ label: "Dashboard", href: "/admin", icon: "LayoutDashboard" as const }],
  website: [
    { label: "Site Settings", href: "/admin/pages/site-settings", icon: Settings },
    { label: "Services Menu", href: "/admin/pages/navbar-services-menu", icon: Layers },
    { label: "Homepage", href: "/admin/homepage", icon: Home },
    { label: "About Page", href: "/admin/pages/about", icon: Info },
    { label: "Team Page", href: "/admin/pages/team-page", icon: Users },
    { label: "Case Studies Page", href: "/admin/pages/case-studies-page", icon: FileText },
    { label: "Contact Page", href: "/admin/pages/contact", icon: Mail },
  ],
  services: [
    { label: "Service Pages", href: "/admin/services", icon: Briefcase },
    ...serviceLandingNavItems,
    { label: "Publications", href: "/admin/publications", icon: Globe },
    { label: "Resources", href: "/admin/resources", icon: FolderTree },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Tags", href: "/admin/tags", icon: Tags },
  ],
  marketing: [
    { label: "Team Members", href: "/admin/team", icon: Users },
    { label: "Case Studies", href: "/admin/case-studies", icon: FileText },
    { label: "Testimonials", href: "/admin/testimonials", icon: BookOpen },
    { label: "Pricing", href: "/admin/pricing", icon: ShieldCheck },
    { label: "FAQ", href: "/admin/faq", icon: MessageSquare },
    { label: "Submit Page", href: "/admin/pages/submit-page", icon: MessageSquare },
    { label: "Resources Page", href: "/admin/pages/resources-page", icon: Search },
  ],
};

export function getPageRegistryEntry(slug: string) {
  return PAGE_REGISTRY.find((entry) => entry.slug === slug);
}

export function getServiceLandingDefault(slug: string) {
  if (!(SERVICE_LANDING_SLUGS as readonly string[]).includes(slug)) return null;
  return SERVICE_LANDING_DEFAULTS[slug as ServiceLandingSlug];
}

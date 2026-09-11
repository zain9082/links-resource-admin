import {
  Activity,
  ArrowRightLeft,
  BookOpen,
  Boxes,
  Briefcase,
  Code,
  FileText,
  FolderTree,
  Gauge,
  Globe,
  Home,
  ImageIcon,
  Info,
  Layers,
  LayoutDashboard,
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
import type { LucideIcon } from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  group: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    group: "Website Pages",
    items: [
      { label: "Site Settings", href: "/admin/pages/site-settings", icon: Settings },
      { label: "Services Menu", href: "/admin/pages/navbar-services-menu", icon: Layers },
      { label: "Homepage", href: "/admin/homepage", icon: Home },
      { label: "About Page", href: "/admin/pages/about", icon: Info },
      { label: "Team Page", href: "/admin/pages/team-page", icon: Users },
      { label: "Case Studies Page", href: "/admin/pages/case-studies-page", icon: FileText },
      { label: "Contact Page", href: "/admin/pages/contact", icon: Mail },
      { label: "Privacy Policy", href: "/admin/pages/privacy-policy", icon: ShieldCheck },
      { label: "Terms of Service", href: "/admin/pages/terms-of-service", icon: FileText },
      { label: "Refund Policy", href: "/admin/pages/refund-policy", icon: ShieldCheck },
      { label: "Service Policy", href: "/admin/pages/service-policy", icon: FileText },
      { label: "Resources Page", href: "/admin/pages/resources-page", icon: Search },
      { label: "Submit Page", href: "/admin/pages/submit-page", icon: MessageSquare },
    ],
  },
  {
    group: "Services & Directory",
    items: [
      { label: "Service Pages", href: "/admin/services", icon: Briefcase },
      { label: "Link Building", href: "/admin/pages/link-building-services", icon: Link2 },
      { label: "SEO Services", href: "/admin/pages/seo-services", icon: Search },
      { label: "Content Writing", href: "/admin/pages/content-writing-services", icon: PenLine },
      { label: "Local SEO", href: "/admin/pages/local-seo-services", icon: MapPin },
      { label: "Guest Posting", href: "/admin/pages/guest-posting-services", icon: Globe },
      { label: "Web Development", href: "/admin/pages/web-development-services", icon: Code },
      {
        label: "Editorial Link Building",
        href: "/admin/pages/editorial-link-building-services",
        icon: FileText,
      },
      {
        label: "White Label Link Building",
        href: "/admin/pages/white-label-link-building-services",
        icon: Briefcase,
      },
      {
        label: "Authority Backlinks",
        href: "/admin/pages/authority-backlinks-services",
        icon: ShieldCheck,
      },
      { label: "Publications", href: "/admin/publications", icon: Globe },
      { label: "Resources", href: "/admin/resources", icon: Boxes },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Tags", href: "/admin/tags", icon: Tags },
    ],
  },
  {
    group: "Content Blocks",
    items: [
      { label: "Team Members", href: "/admin/team", icon: Users },
      { label: "Case Studies", href: "/admin/case-studies", icon: FileText },
      { label: "Testimonials", href: "/admin/testimonials", icon: BookOpen },
      { label: "Pricing Plans", href: "/admin/pricing", icon: ShieldCheck },
      { label: "FAQ", href: "/admin/faq", icon: MessageSquare },
    ],
  },
  {
    group: "Users",
    items: [{ label: "All Users", href: "/admin/users", icon: Users }],
  },
  {
    group: "SEO",
    items: [
      { label: "Global Settings", href: "/admin/seo/global", icon: Globe },
      { label: "Page SEO", href: "/admin/seo", icon: Search },
      { label: "Redirects", href: "/admin/redirects", icon: ArrowRightLeft },
      { label: "404 Monitor", href: "/admin/seo/not-found", icon: Gauge },
      { label: "Sitemap", href: "/admin/seo/sitemap", icon: Layers },
      { label: "Robots.txt", href: "/admin/seo/robots", icon: FileText },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Contact Inquiries", href: "/admin/contact-inquiries", icon: Mail },
      { label: "Submissions", href: "/admin/submissions", icon: Gauge },
      { label: "Media", href: "/admin/media", icon: ImageIcon },
      { label: "Activity Log", href: "/admin/activity", icon: Activity },
    ],
  },
];

export function getAdminBreadcrumb(pathname: string) {
  const labels = pathname.split("/").filter(Boolean).slice(1);
  if (labels.length === 0) return "Overview / Dashboard";
  return labels
    .map((segment) =>
      segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(" / ");
}

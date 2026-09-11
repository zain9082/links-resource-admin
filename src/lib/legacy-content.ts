import {
  aboutContent,
  aboutPageContent,
  caseStudies,
  categories,
  contactPageContent,
  consultationBanner,
  faqs,
  featuredPlacements,
  howItWorks,
  packages,
  partnerships,
  resources,
  reviews,
  servicePages,
  site,
  stats,
  teamMembers,
  teamPageContent,
  websiteMetrics,
  whyChooseUs,
  navbarServicesMenuContent,
} from "@/lib/legacy/data";
import { publicationSites } from "@/lib/legacy/publications";
import {
  LEGAL_PAGE_DEFAULTS,
  SERVICE_LANDING_DEFAULTS,
  type ServiceLandingSlug,
} from "@/lib/service-landing-defaults";

export async function getLegacyHomepageSections(): Promise<Record<string, unknown>> {
  return {
    hero: {
      badgeText: "Trusted by 500+ Businesses",
      headlineLine1: "Scale Rankings With Precision SEO",
      headlineLine2: "High-Authority Link Building",
      headlineLine3: ["Traffic Growth", "Lead Generation", "Revenue Uplift"],
      subheadline: site.description,
      ctaPrimary: { label: "Get Free Proposal", href: "/contact" },
      ctaSecondary: { label: "Explore Services", href: "/services" },
      stats: stats.slice(0, 3),
    },
    services: resources.slice(0, 4),
    "how-it-works": howItWorks,
    "why-choose-us": whyChooseUs,
    metrics: websiteMetrics,
    partners: partnerships,
    faq: faqs,
    cta: {
      headline: "Ready to increase rankings and revenue?",
      subtext: "Work with Links Resource LTD to grow with confidence.",
      buttonLabel: "Book Strategy Call",
      buttonHref: "/contact",
    },
    marquee: [
      "500+ Projects Delivered",
      "50+ Clients Worldwide",
      "UK-Based Agency",
      "Real Websites & Manual Outreach",
      "DR 50–90 Backlinks",
      "Transparent Reporting",
      "Google Partner",
    ],
    "featured-placements": featuredPlacements,
    "about-section": aboutContent,
    "consultation-banner": consultationBanner,
  };
}

export async function getLegacyPageContent(slug: string): Promise<unknown> {
  switch (slug) {
    case "site-settings":
      return site;
    case "about":
      return aboutPageContent;
    case "team-page":
      return teamPageContent;
    case "case-studies-page":
      return {
        hero: {
          eyebrow: "Case Studies",
          titleLine1: "Grow With SEO &",
          titleHighlight: "High-Converting Websites",
          subtitle:
            "See how we've helped experts transform their digital presence and become industry authorities.",
          cta: "Get Started",
          ctaHref: "/contact",
          imageAlt: "SEO and web development team planning growth strategy",
        },
      };
    case "navbar-services-menu":
      return navbarServicesMenuContent;
    case "contact":
      return contactPageContent;
    case "link-building-services":
    case "seo-services":
    case "content-writing-services":
    case "local-seo-services":
    case "guest-posting-services":
    case "web-development-services":
    case "editorial-link-building-services":
    case "white-label-link-building-services":
    case "authority-backlinks-services":
      return SERVICE_LANDING_DEFAULTS[slug as ServiceLandingSlug];
    case "privacy-policy":
    case "terms-of-service":
    case "refund-policy":
    case "service-policy":
      return LEGAL_PAGE_DEFAULTS[slug];
    case "resources-page":
      return {
        header: {
          eyebrow: "Directory",
          title: "Explore every resource",
          subtitle:
            "Instant search and advanced filters across SEO, link building, content, development, design and AI.",
        },
      };
    case "submit-page":
      return {
        header: {
          eyebrow: "Contribute",
          title: "Submit a resource",
          subtitle:
            "Found something great? Suggest it and our team will review it for the directory.",
        },
      };
    default:
      return {};
  }
}

export async function getLegacyServiceList() {
  return servicePages.map((page) => ({
    slug: page.slug,
    name: page.title,
    updatedAt: new Date(),
  }));
}

export async function getLegacyTeamMembers() {
  return teamMembers.map((member, index) => ({
    id: `legacy-${index}`,
    name: member.name,
    role: member.role,
    bio: member.bio,
    email: member.email,
    imageUrl: member.image ?? null,
    linkedIn: null,
    twitter: null,
    displayOrder: index,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function getLegacyCaseStudies() {
  return caseStudies.map((study, index) => ({
    id: study.slug ?? `legacy-${index}`,
    clientName: study.category,
    industry: study.category,
    title: study.title,
    challenge: `Challenge details for ${study.title}`,
    solution: `Solution details for ${study.title}`,
    results: `Result details for ${study.title}`,
    metrics: study.metrics,
    tags: null,
    imageUrl: null,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function getLegacyTestimonials() {
  return reviews.map((review, index) => ({
    id: `legacy-${index}`,
    authorName: review.name,
    company: review.role,
    role: review.role,
    avatarUrl: null,
    rating: 5,
    quote: review.body,
    featured: index < 2,
    displayOrder: index,
    createdAt: new Date(),
  }));
}

export async function getLegacyPricingPlans() {
  return packages.map((plan, index) => ({
    id: `legacy-${index}`,
    name: plan.name,
    price: plan.price,
    billingNote: plan.period,
    features: plan.features,
    isPopular: Boolean(plan.highlight),
    ctaLabel: "Get Started",
    ctaHref: "/contact",
    color: index === 0 ? "purple" : index === 1 ? "blue" : "pink",
    displayOrder: index,
    updatedAt: new Date(),
  }));
}

export async function getLegacyPublicationsList() {
  return publicationSites.map((site, index) => ({
    id: site.id ?? `legacy-${index}`,
    siteName: site.publication,
    url: `https://${site.website}`,
    da: site.da,
    dr: null,
    niche: site.nicheAccepted,
    type: site.type,
    tat: Number.parseInt(String(site.tat), 10) || 7,
    price: site.price,
    doFollow: site.doFollow,
    sponsored: site.sponsored,
    traffic: site.traffic ?? null,
    notes: null,
    active: true,
    updatedAt: new Date(),
  }));
}

export async function getLegacyCategories() {
  return categories.map((category, index) => ({
    id: `legacy-cat-${index}`,
    slug: category.slug,
    name: category.name,
    description: category.description,
    icon: category.icon,
    gradient: category.gradient ?? "purple",
    _count: { resources: 0 },
  }));
}

export async function getLegacyTags() {
  const slugs = Array.from(new Set(resources.flatMap((resource) => resource.tags)));
  return slugs.map((slug, index) => ({
    id: `legacy-tag-${index}`,
    slug,
    name: slug.replace(/-/g, " "),
    _count: { resources: 0 },
  }));
}

export async function getLegacyResources() {
  return resources.map((item, index) => {
    const category = categories.find((entry) => entry.slug === item.category);
    return {
      id: `legacy-res-${index}`,
      slug: item.slug,
      title: item.title,
      tagline: item.tagline,
      description: item.description,
      url: item.url,
      pricing: item.pricing.toUpperCase(),
      featured: item.featured,
      popular: item.popular,
      rating: item.rating,
      views: item.views,
      logoColor: item.logoColor,
      status: "PUBLISHED",
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: `legacy-cat-${item.category}`,
      category: { name: category?.name ?? item.category },
      tags: item.tags.map((tag: string, tagIndex: number) => ({
        resourceId: `legacy-res-${index}`,
        tagId: `legacy-tag-${tagIndex}`,
        tag: { name: tag.replace(/-/g, " ") },
      })),
    };
  });
}

export async function getLegacyStats() {
  return {
    resources: resources.length,
    services: servicePages.length,
    publications: publicationSites.length,
    team: teamMembers.length,
    caseStudies: caseStudies.length,
    testimonials: reviews.length,
    pricing: packages.length,
    categories: categories.length,
    tags: Array.from(new Set(resources.flatMap((resource) => resource.tags))).length,
  };
}

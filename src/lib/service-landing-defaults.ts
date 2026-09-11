export type ServiceLandingPackage = {
  id?: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
};

export type ServiceLandingFaq = { q: string; a: string };

export type ServiceLandingFeature = {
  icon?: string;
  title: string;
  description: string;
};

export type ServiceLandingProcessStep = {
  index?: string;
  title: string;
  description: string;
};

export type ServiceLandingStat = {
  value: string;
  label: string;
};

export type ServiceLandingContent = {
  header: { eyebrow: string; title: string; subtitle: string };
  trustPoints?: string[];
  heroBullets?: string[];
  heroStats?: ServiceLandingStat[];
  features?: ServiceLandingFeature[];
  processSteps?: ServiceLandingProcessStep[];
  marquee?: string[];
  cta: { title: string; body: string; button: string; href: string };
  packages?: ServiceLandingPackage[];
  faqs?: ServiceLandingFaq[];
};

export const SERVICE_LANDING_SLUGS = [
  "link-building-services",
  "seo-services",
  "content-writing-services",
  "local-seo-services",
  "guest-posting-services",
  "web-development-services",
  "editorial-link-building-services",
  "white-label-link-building-services",
  "authority-backlinks-services",
] as const;

export type ServiceLandingSlug = (typeof SERVICE_LANDING_SLUGS)[number];

export const SERVICE_LANDING_DEFAULTS: Record<ServiceLandingSlug, ServiceLandingContent> = {
  "link-building-services": {
    header: {
      eyebrow: "Link Building Services",
      title: "Authority-driven placements that fuel sustainable SEO growth",
      subtitle:
        "Editorial placements, guest posting, and scalable link building packages — backed by transparent pricing, manual outreach, and vetted high-DA publications.",
    },
    trustPoints: [
      "Hand-vetted high-DA publications",
      "Transparent pricing & turnaround times",
      "Niche-specific placement options",
    ],
    cta: {
      title: "Ready to scale your business?",
      body: "Our outreach team will recommend the best publications for your niche, budget, and SEO goals.",
      button: "Get Started Now",
      href: "/contact",
    },
  },
  "seo-services": {
    header: {
      eyebrow: "SEO Services",
      title: "Results-driven SEO that helps businesses grow faster",
      subtitle:
        "Custom SEO campaigns that improve rankings, traffic quality, and conversion opportunities for long-term compounding growth.",
    },
    trustPoints: [
      "Technical, on-page, and off-page SEO",
      "Transparent monthly KPI reporting",
      "Buyer-intent keyword strategy",
    ],
    cta: {
      title: "Ready to grow your business?",
      body: "Let's build an SEO strategy tailored to your niche, goals, and growth timeline.",
      button: "Get Started Now",
      href: "/contact",
    },
  },
  "content-writing-services": {
    header: {
      eyebrow: "Content Writing Services",
      title: "Rank-ready content that helps businesses grow faster",
      subtitle:
        "SEO-focused content production that improves visibility, authority, and qualified traffic across your most important pages.",
    },
    trustPoints: [
      "Human-written, SEO-optimized copy",
      "Keyword research included",
      "Brand voice alignment",
    ],
    cta: {
      title: "Ready to grow your business?",
      body: "Let's plan content that ranks, engages your audience, and converts visitors into leads.",
      button: "Get Started Now",
      href: "/contact",
    },
  },
  "local-seo-services": {
    header: {
      eyebrow: "Local SEO Services",
      title: "Rank in Google Maps and local search",
      subtitle:
        "Local SEO campaigns that improve map visibility, location rankings, and lead quality for service-area businesses.",
    },
    trustPoints: [
      "Google Business Profile optimization",
      "Citation and listing consistency",
      "Local landing page strategy",
    ],
    cta: {
      title: "Want more local customers finding you?",
      body: "Let's build a local SEO plan tailored to your service areas and growth goals.",
      button: "Get Started Now",
      href: "/contact",
    },
  },
  "guest-posting-services": {
    header: {
      eyebrow: "Guest Posting Services",
      title: "Guest posts that support long-term SEO growth",
      subtitle:
        "Manual outreach and placement campaigns to secure contextual backlinks on trusted, niche-relevant websites.",
    },
    cta: {
      title: "Ready to grow your business?",
      body: "Let's build a guest posting campaign designed around your niche, authority goals, and growth targets.",
      button: "Get started now",
      href: "/contact",
    },
  },
  "web-development-services": {
    header: {
      eyebrow: "Web Development",
      title: "Build fast conversion-focused websites",
      subtitle:
        "MERN stack, React Native, and Node.js development — modern websites and apps engineered for speed, SEO, and measurable business growth.",
    },
    cta: {
      title: "Ready to build a powerful website?",
      body: "Let's plan your MERN stack web app, Next.js site, or React Native product with Malik Zain and our development team.",
      button: "Get Free Proposal",
      href: "/contact",
    },
  },
  "editorial-link-building-services": {
    header: {
      eyebrow: "Editorial Link Building",
      title: "Editorial link building for authority growth",
      subtitle:
        "Scale organic traffic with high-performance links from real publications with strong traffic and trusted SEO metrics.",
    },
    cta: {
      title: "Ready to grow your business?",
      body: "Get started with our editorial link building services today.",
      button: "Get started",
      href: "/contact",
    },
  },
  "white-label-link-building-services": {
    header: {
      eyebrow: "Link Building Services",
      title: "Editorial link building for authority growth",
      subtitle:
        "High-quality, natural link placements on real publications — built for agencies and brands that need scalable white-label delivery.",
    },
    cta: {
      title: "Ready to grow your business?",
      body: "Get started with white-label link building designed for agency scale and client-ready reporting.",
      button: "Get Started",
      href: "/contact",
    },
  },
  "authority-backlinks-services": {
    header: {
      eyebrow: "Authority Backlinks",
      title: "Build high-authority backlinks that strengthen your site",
      subtitle:
        "Manual outreach placements on real publishers that lift domain authority, rankings, and qualified organic traffic.",
    },
    cta: {
      title: "Ready to grow your business?",
      body: "Contact us today for a free consultation and backlink strategy tailored to your goals.",
      button: "Get started now",
      href: "/contact",
    },
  },
};

export type LegalPageContent = {
  title: string;
  description: string;
  lastUpdated?: string;
  sections: Array<{ heading: string; body: string }>;
};

export const LEGAL_PAGE_DEFAULTS: Record<string, LegalPageContent> = {
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "This policy explains how Links Resource LTD handles personal information when you use our website and services.",
    sections: [
      {
        heading: "Information we collect",
        body: "We may collect contact details, website URLs, project requirements, and communication records when you submit forms, request audits, or contact our team.",
      },
      {
        heading: "How we use information",
        body: "Information is used to respond to enquiries, deliver services, improve our website, and meet legal or operational requirements. We do not sell personal data.",
      },
      {
        heading: "Cookies",
        body: "We use cookies and similar technologies for essential functionality and performance measurement. You can manage cookie preferences through the site banner.",
      },
      {
        heading: "Data retention & rights",
        body: "You may request access, correction, or deletion of personal data where applicable under UK GDPR. Contact us using the details on our contact page.",
      },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    description: "Terms that govern use of Links Resource website and services.",
    sections: [
      {
        heading: "Agreement",
        body: "By using our website or engaging our services, you agree to these terms and any service-specific agreement shared at kickoff.",
      },
      {
        heading: "Services",
        body: "We provide SEO, link building, content, and related digital services as described in proposals, packages, or statements of work.",
      },
      {
        heading: "Client responsibilities",
        body: "Clients must provide accurate information, timely feedback, and access required to deliver agreed work.",
      },
    ],
  },
  "refund-policy": {
    title: "Refund Policy",
    description: "How refunds and credits are handled for Links Resource services.",
    sections: [
      {
        heading: "Eligibility",
        body: "Refund eligibility depends on the package type, work already completed, and any written agreement for the engagement.",
      },
      {
        heading: "Third-party costs",
        body: "Third-party costs such as paid placements are generally non-refundable once incurred.",
      },
    ],
  },
  "service-policy": {
    title: "Service Policy",
    description: "Delivery standards, timelines, and quality expectations for our campaigns.",
    sections: [
      {
        heading: "Delivery",
        body: "We deliver work according to agreed scope, timelines, and quality standards outlined in your package or proposal.",
      },
      {
        heading: "Revisions",
        body: "Reasonable revisions are included where specified. Major scope changes may require a new quote.",
      },
    ],
  },
};

export function getServiceLandingPath(slug: ServiceLandingSlug): string {
  return `/${slug}`;
}

export function isServiceLandingSlug(slug: string): slug is ServiceLandingSlug {
  return (SERVICE_LANDING_SLUGS as readonly string[]).includes(slug);
}

export function isLegalPageSlug(slug: string): boolean {
  return slug in LEGAL_PAGE_DEFAULTS;
}

import type {
  Category,
  Resource,
  Service,
  CaseStudy,
  Review,
  Faq,
  Package,
  Step,
  Tag,
  Partnership,
  Placement,
  WebsiteMetric,
  ServicePageContent,
  TeamMember,
} from "./types";

/* ============================================================
   Site config — preserved from linksresource.com
   ============================================================ */
export const site = {
  name: "Links Resource",
  legalName: "Links Resource LTD",
  domain: "linksresource.com",
  url: "https://linksresource.com",
  tagline: "Premium Link Building & Digital Marketing Agency",
  description:
    "Links Resource is a performance marketing agency specialising in niche-relevant backlinks, content creation & SEO to drive traffic, leads and brand growth.",
  email: "support@linksresource.com",
  phone: "+44 7476 606752",
  address: "0/1 7 Aberfoyle Street, Glasgow, United Kingdom, G31 3RW",
  socials: {
    linkedin: "https://www.linkedin.com/company/links-resource-ltd",
    facebook: "https://www.facebook.com/linksresourceltd",
    x: "https://x.com/LinksResource",
    instagram: "https://www.instagram.com/linksresourceltd",
  },
};

export const stats = [
  { value: "500+", label: "Projects Delivered" },
  { value: "50+", label: "Global Clients" },
  { value: "98%", label: "Success Rate" },
  { value: "10K+", label: "Placements Delivered" },
];

export const heroBullets = [
  "Rank Higher on Google with Proven SEO",
  "Get High-Quality Backlinks That Build Authority",
  "Increase Traffic with Optimized Content",
  "Convert Visitors into Leads with Smart Web Design",
  "Scalable SEO Strategies for Business Growth",
  "Clear Reporting & Measurable Results",
];

export const seoAuditContent = {
  label: "Get My Free SEO Audit",
  shortLabel: "Free SEO Audit",
  badge: "Free SEO Audit",
  title: "Instant SEO Audit for Your Website",
  description:
    "Enter your URL and get an immediate on-page SEO report — technical checks, content signals, and actionable recommendations.",
  formTitle: "Analyze Your Website",
  formSubtitle: "Complete the form below to generate your instant SEO audit report.",
  benefits: [
    "Technical SEO health and indexability checks",
    "Title, meta, heading, and content analysis",
    "Performance and mobile readiness signals",
    "Clear pass, warning, and issue breakdown",
  ],
};

export const leadFormGoals = [
  "SEO + GEO Services",
  "Link Building Services",
  "White Label / Link Building",
  "Web Design",
  "Others",
];

export const featuredPlacements: Placement[] = [
  {
    name: "Morocco World News",
    url: "https://www.moroccoworldnews.com/",
    gradient: "blue",
  },
  {
    name: "Indie Hackers",
    url: "https://www.indiehackers.com/",
    gradient: "purple",
  },
  {
    name: "iLounge",
    url: "https://www.ilounge.com/",
    gradient: "pink",
  },
  {
    name: "Analytics Insight",
    url: "https://www.analyticsinsight.net/",
    gradient: "blue",
  },
  {
    name: "BB Time",
    url: "https://bbtime.co.uk/",
    gradient: "purple",
  },
  {
    name: "ARK",
    url: "https://ark-invest.com/",
    gradient: "pink",
  },
];

export const partnerships: Partnership[] = [
  {
    name: "Google",
    logo: "/logos/google.svg",
    url: "https://about.google/",
    gradient: "purple",
  },
  {
    name: "Google Pay",
    logo: "/logos/googlepay.svg",
    url: "https://pay.google.com/",
    gradient: "blue",
  },
  {
    name: "PayPal",
    logo: "/logos/paypal.svg",
    url: "https://www.paypal.com/",
    gradient: "blue",
  },
  {
    name: "Semrush",
    logo: "/logos/semrush.svg",
    url: "https://www.semrush.com/",
    gradient: "pink",
  },
  {
    name: "Binance",
    logo: "/logos/binance.svg",
    url: "https://www.binance.com/",
    gradient: "pink",
  },
  {
    name: "Stripe",
    logo: "/logos/stripe.svg",
    url: "https://stripe.com/",
    gradient: "purple",
  },
];

export const websiteMetrics: WebsiteMetric[] = [
  {
    site: "moroccoworldnews.com",
    url: "https://www.moroccoworldnews.com/",
    da: 44,
    dr: 56,
    traffic: "130K+",
  },
  {
    site: "indiehackers.com",
    url: "https://www.indiehackers.com/",
    da: 55,
    dr: 80,
    traffic: "103K+",
  },
  {
    site: "ilounge.com",
    url: "https://www.ilounge.com/",
    da: 78,
    dr: 82,
    traffic: "18K+",
  },
  {
    site: "analyticsinsight.net",
    url: "https://www.analyticsinsight.net/",
    da: 72,
    dr: 76,
    traffic: "100K+",
  },
  {
    site: "bbtime.co.uk",
    url: "https://bbtime.co.uk/",
    da: 65,
    dr: 80,
    traffic: "149K+",
  },
  {
    site: "ark-invest.com",
    url: "https://ark-invest.com/",
    da: 89,
    dr: 91,
    traffic: "1.5M+",
  },
  {
    site: "semrush.com",
    url: "https://www.semrush.com/",
    da: 87,
    dr: 76,
    traffic: "10K+",
  },
  {
    site: "paypal.com",
    url: "https://www.paypal.com/",
    da: 46,
    dr: 61,
    traffic: "34K+",
  },
  {
    site: "google.com",
    url: "https://about.google/",
    da: 65,
    dr: 65,
    traffic: "311K+",
  },
  {
    site: "stripe.com",
    url: "https://stripe.com/",
    da: 56,
    dr: 57,
    traffic: "348K+",
  },
];

export type NavbarMenuItem = {
  title: string;
  description: string;
  href: string;
};

export type NavbarMenuSection = {
  title: string;
  items: NavbarMenuItem[];
};

export const navbarLinkBuildingMenu: NavbarMenuItem[] = [
  {
    title: "Guest Posting",
    description: "Manual guest posting on real websites with relevant traffic.",
    href: "/guest-posting-services",
  },
  {
    title: "Niche Edits",
    description: "Contextual niche edits placed naturally in existing authority pages.",
    href: "/editorial-link-building-services",
  },
  {
    title: "Editorial Link Building",
    description: "Editorial backlinks from trusted, niche-relevant publications.",
    href: "/editorial-link-building-services",
  },
  {
    title: "White Label Link Building",
    description: "Scalable white-label link building for agencies and SEO teams.",
    href: "/white-label-link-building-services",
  },
  {
    title: "Digital PR",
    description: "Authority mentions and campaigns that earn brand visibility.",
    href: "/authority-backlinks-services",
  },
  {
    title: "SaaS Link Building",
    description: "SaaS-focused outreach campaigns aligned to product-led growth.",
    href: "/link-building-services",
  },
];

export const navbarMoreServicesMenu: NavbarMenuItem[] = [
  {
    title: "SEO Services",
    description: "Data-driven SEO campaigns to improve rankings and growth.",
    href: "/seo-services",
  },
  {
    title: "Local SEO",
    description: "Improve local visibility, map rankings, and nearby leads.",
    href: "/local-seo-services",
  },
  {
    title: "Content Writing",
    description: "SEO content writing built to rank and convert visitors.",
    href: "/content-writing-services",
  },
  {
    title: "Web Development",
    description: "Fast, conversion-focused websites built for modern brands.",
    href: "/web-development-services",
  },
];

export const navbarServicesMenu: NavbarMenuSection[] = [
  {
    title: "Link Building Services",
    items: navbarLinkBuildingMenu,
  },
  {
    title: "SEO & Digital Marketing",
    items: navbarMoreServicesMenu,
  },
];

export const navbarServicesMenuContent = {
  menuLabel: "Our Services",
  sections: navbarServicesMenu,
};

export const aboutContent = {
  eyebrow: "About Us",
  title: "Your Growth Partner, Not Just a Service Provider",
  body: "We help brands grow, not just rank. From SEO to content and development, everything we do is built to bring traffic, convert users, and increase revenue. We focus on strategies that create measurable business growth through SEO, content, and digital marketing.",
};

export const aboutPageContent = {
  hero: {
    eyebrow: "About Links Resource",
    title: "About Links Resource",
    intro:
      "At Links Resource, we help businesses improve online visibility through SEO, link building, content writing, website development, and growth-focused digital strategies tailored to real business goals.",
    cta: "Book a Free Consultation",
  },
  whoWeAre: {
    eyebrow: "Who we are",
    title: "A digital growth agency built around real business goals",
    paragraphs: [
      "Links Resource is a digital growth agency focused on helping businesses strengthen their online presence through practical, results-focused strategies. We specialize in SEO, authority building, content writing, and website development tailored to different industries and business goals.",
      "Rather than one-size-fits-all solutions, we focus on customized strategies designed around business needs, competition, and long-term growth opportunities.",
    ],
  },
  whatWeDo: {
    eyebrow: "What we do",
    title: "Practical digital solutions for measurable growth",
    body: "At Links Resource, we help businesses strengthen their online presence through tailored digital solutions designed to improve visibility, authority, and long-term growth. Our services include SEO, link building, content writing, website development, and local SEO strategies tailored to different industries and business goals. Whether you want to improve search visibility, build a stronger website, or attract more qualified traffic, we focus on practical solutions designed to support measurable business growth.",
  },
  whyChoose: {
    eyebrow: "Why businesses choose Links Resource",
    title: "Strategies tailored to real business goals",
    intro:
      "We believe digital growth works best when strategies are tailored to real business goals, not generic templates. At Links Resource, we focus on practical, long-term solutions designed to improve visibility, authority, and online performance. Our approach combines transparency, quality, and business-focused execution to help brands build a stronger digital presence.",
    items: [
      {
        title: "Tailored Strategies",
        body: "Every business has unique goals and challenges. We create customized digital strategies designed around your industry, competition, and growth objectives.",
      },
      {
        title: "Transparent Communication",
        body: "We value clear communication and keep clients informed with updates, recommendations, and a transparent working process.",
      },
      {
        title: "Long-Term Growth Focus",
        body: "Our strategies are designed to support sustainable growth rather than short-term tactics that may not provide lasting value.",
      },
      {
        title: "Quality-Driven Execution",
        body: "From content writing to SEO and website development, we prioritize quality, usability, and practical results.",
      },
      {
        title: "Ethical SEO Practices",
        body: "We follow search-friendly and ethical approaches designed to improve visibility while supporting long-term website performance.",
      },
      {
        title: "Dedicated Support",
        body: "We work closely with businesses to understand their goals and recommend solutions tailored to their specific needs.",
      },
    ],
  },
  approach: {
    eyebrow: "Our approach",
    title: "Our approach to digital growth",
    intro:
      "We follow a structured process designed to understand business goals, build the right strategy, and create sustainable online growth. By combining planning, execution, and ongoing optimization, we help businesses move toward stronger digital performance.",
    steps: [
      {
        title: "Understanding Your Business Goals",
        body: "We begin by learning about your business, target audience, industry, and growth objectives to identify the right opportunities.",
      },
      {
        title: "Building a Tailored Strategy",
        body: "Based on your goals, we create a practical digital strategy designed to improve visibility, authority, and online performance.",
      },
      {
        title: "Execution & Optimization",
        body: "Our team implements improvements across SEO, content, website performance, or digital growth areas while continuously refining the approach.",
      },
      {
        title: "Tracking Progress & Growth",
        body: "We monitor performance, identify opportunities, and make improvements to support long-term digital growth.",
      },
    ],
  },
  mission: {
    eyebrow: "Our mission",
    title: "Helping businesses grow online with practical solutions",
    body: "Our mission is to help businesses grow online through practical digital solutions designed to improve visibility, trust, and long-term performance. We aim to provide tailored strategies that align with business goals while focusing on quality, transparency, and sustainable growth.",
  },
  services: {
    eyebrow: "Services we offer",
    title: "Digital solutions for visibility, authority, and growth",
    intro:
      "We provide digital solutions designed to help businesses improve visibility, strengthen authority, and support long-term online growth. Our services are tailored to different industries, goals, and business needs.",
    items: [
      {
        title: "SEO Services",
        body: "Improve search visibility, organic traffic, and website performance through tailored SEO strategies.",
        href: "/resources?category=seo-tools",
      },
      {
        title: "Link Building Services",
        body: "Strengthen website authority with niche-relevant placements and quality backlink strategies.",
        href: "/resources?category=link-building",
      },
      {
        title: "Content Writing Services",
        body: "Create SEO-focused content designed to improve readability, engagement, and online visibility.",
        href: "/resources?category=content-writing",
      },
      {
        title: "Website Development",
        body: "Build fast, responsive, and user-friendly websites designed for performance and business growth.",
        href: "/resources/web-design-development",
      },
      {
        title: "Local SEO Services",
        body: "Improve local search visibility and connect with nearby customers through location-focused SEO strategies.",
        href: "/resources/local-seo",
      },
      {
        title: "Technical SEO Optimization",
        body: "Improve website structure, indexing, performance, and technical health for better search visibility.",
        href: "/resources/technical-seo-audit",
      },
      {
        title: "Guest Posting & Outreach",
        body: "Secure relevant content placements designed to support authority and long-term SEO value.",
        href: "/resources/editorial-guest-posting",
      },
    ],
  },
  cta: {
    title: "Ready to Strengthen Your Online Presence?",
    body: "Whether you need SEO, website development, content writing, or digital growth support, we're here to help you find the right strategy for your business goals.",
    button: "Get A Free Quote",
  },
};

export const contactPageContent = {
  hero: {
    eyebrow: "Get in touch",
    titleLine1: "Let's grow your",
    titleHighlight: "business together",
    subtitle:
      "We're a UK-based team of marketing experts helping brands grow through SEO, link building, content, and web design — with clear communication and measurable results.",
    badges: [
      "UK registered agency",
      "Trusted by global brands",
      "Reply within 24 hours",
    ],
  },
  form: {
    title: "Send us a message",
    subtitle: "Share your details and our team will get back to you within one business day.",
    serviceOptions: [
      "SEO + GBO Services",
      "Link Building & Guest Posting",
      "Content Writing",
      "Web Design & Development",
      "Digital PR & Branding",
      "Other / General enquiry",
    ],
    fields: {
      namePlaceholder: "Your name",
      emailPlaceholder: "Your email",
      phonePlaceholder: "Phone (optional)",
      websitePlaceholder: "Website URL",
      messagePlaceholder: "Tell us about your goals...",
      submitLabel: "Send message",
    },
  },
  sidebar: {
    email: {
      title: "Email us",
      addresses: ["hello@linksresource.co.uk", "strategy@linksresource.com"],
    },
    phone: {
      title: "Call us",
      number: "+44 7438 836553",
      note: "Mon–Fri, UK business hours",
    },
    responseTime: {
      title: "Response time",
      body: "We reply to all enquiries within 24 hours on business days.",
    },
    expertiseTitle: "Our expertise",
  },
  expertise: [
    "Link building & guest posting",
    "Content writing & SEO blogs",
    "Website design & development",
    "On-page, off-page & technical SEO",
    "Digital branding & strategy",
  ],
  locations: {
    eyebrow: "Our locations",
    title: "Where to find us",
    subtitle: "A UK-based agency serving clients worldwide.",
    headOfficeLabel: "Head office",
    coverageLabel: "Service coverage",
    coverageText:
      "We serve clients across the UK, Europe, and worldwide with remote campaign delivery and strategy support.",
  },
  cta: {
    title: "Ready to grow your business?",
    body: "Let's create a strategy tailored to your business. Book a meeting with our team.",
    button: "Book a meeting",
    href: "/contact",
  },
};

export const teamPageContent = {
  title: "Meet the Team Behind Your SEO Growth",
  subtitle:
    "A dedicated group of outreach, SEO, and content specialists focused on delivering measurable business growth.",
  trustHeading: "Why Clients Trust Our Team",
  trustPoints: [
    "Skilled specialists with hands-on campaign experience",
    "Clear communication and transparent reporting",
    "Reliable quality checks before every delivery",
    "Business-first execution focused on outcomes",
  ],
  workflowHeading: "From Strategy To Rankings",
  workflow: [
    {
      title: "Analyze Your Website",
      body: "We review your goals, audience, and current SEO position before planning campaigns.",
    },
    {
      title: "Build a Custom Growth Plan",
      body: "Your strategy is tailored to your niche, competition level, and growth targets.",
    },
    {
      title: "Secure Quality Placements",
      body: "Our team executes outreach and content workflows focused on quality and relevance.",
    },
    {
      title: "Track Growth & Performance",
      body: "You get clear reporting and ongoing optimization recommendations every month.",
    },
  ],
  cta: {
    title: "Ready to Grow With Our Team?",
    subtitle: "Let's build a campaign designed around your growth targets.",
    primaryLabel: "Get Free Proposal",
    primaryHref: "/contact",
    secondaryLabel: "Email Team",
    secondaryHref: "mailto:hello@linksresource.com",
    badges: ["Real websites", "Manual outreach", "Transparent reporting"],
  },
};

export const consultationBanner = {
  title: "Get a Free Guest Posting Consultation",
  subtitle:
    "Discover how our team can secure high-quality placements, improve rankings and organic visibility, and boost your website's authority with strategic guest posting.",
  cta: "Request Your Free Consultation",
};

/* ============================================================
   Resource directory — categories
   ============================================================ */
export const categories: Category[] = [
  {
    slug: "link-building",
    name: "Link Building",
    description:
      "Editorial backlinks, guest posting and authority-building tools and services.",
    icon: "Link2",
    gradient: "purple",
  },
  {
    slug: "seo-tools",
    name: "SEO Tools",
    description:
      "Rank tracking, audits, keyword research and technical SEO platforms.",
    icon: "Search",
    gradient: "blue",
  },
  {
    slug: "content-writing",
    name: "Content Writing",
    description: "SEO content, copywriting and editorial production resources.",
    icon: "PenLine",
    gradient: "pink",
  },
  {
    slug: "web-development",
    name: "Web Development",
    description: "Frameworks, hosting, and tooling to build fast web apps.",
    icon: "Code2",
    gradient: "blue",
  },
  {
    slug: "design",
    name: "Design",
    description: "UI kits, illustration, prototyping and inspiration galleries.",
    icon: "Palette",
    gradient: "pink",
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    description: "Generative AI, automation and productivity assistants.",
    icon: "Sparkles",
    gradient: "purple",
  },
];

export const tags: Tag[] = [
  { slug: "backlinks", name: "Backlinks" },
  { slug: "outreach", name: "Outreach" },
  { slug: "analytics", name: "Analytics" },
  { slug: "keyword-research", name: "Keyword Research" },
  { slug: "copywriting", name: "Copywriting" },
  { slug: "framework", name: "Framework" },
  { slug: "hosting", name: "Hosting" },
  { slug: "ui-kit", name: "UI Kit" },
  { slug: "inspiration", name: "Inspiration" },
  { slug: "automation", name: "Automation" },
  { slug: "free", name: "Free" },
  { slug: "local-seo", name: "Local SEO" },
];

/* ============================================================
   Resources — curated directory + agency services as resources
   ============================================================ */
export const resources: Resource[] = [
  {
    slug: "editorial-guest-posting",
    title: "Editorial Guest Posting",
    tagline: "Custom outreach campaigns that improve rankings & visibility",
    description:
      "Manual, niche-relevant guest posting on real websites with organic traffic. Pre-approval system, live link tracking and safe anchor strategy — no PBNs, no automation.",
    url: "https://linksresource.com/editorial-guest-posting-services/",
    category: "link-building",
    tags: ["backlinks", "outreach"],
    pricing: "Paid",
    featured: true,
    popular: true,
    rating: 4.9,
    views: 18400,
    createdAt: "2026-01-12T00:00:00.000Z",
    logoColor: "purple",
  },
  {
    slug: "editorial-link-building",
    title: "Editorial Link Building",
    tagline: "Trusted backlinks from relevant high-authority websites",
    description:
      "Build authority with contextual, domain-approved placements from DR 50–90 websites. Every link is earned through real outreach and relationships.",
    url: "https://linksresource.com/editorial-link-building-services/",
    category: "link-building",
    tags: ["backlinks", "outreach"],
    pricing: "Paid",
    featured: true,
    popular: true,
    rating: 4.8,
    views: 15200,
    createdAt: "2026-01-20T00:00:00.000Z",
    logoColor: "blue",
  },
  {
    slug: "white-label-link-building",
    title: "White Label Link Building",
    tagline: "Scalable link building for agencies & SEO resellers",
    description:
      "Reseller-ready link building with transparent reporting and consistent monthly campaigns designed to scale your agency without in-house hiring.",
    url: "https://linksresource.com/white-label-link-building/",
    category: "link-building",
    tags: ["backlinks", "outreach"],
    pricing: "Paid",
    featured: true,
    popular: false,
    rating: 4.7,
    views: 9800,
    createdAt: "2026-02-02T00:00:00.000Z",
    logoColor: "pink",
  },
  {
    slug: "da-dr-boost",
    title: "DA / DR Boost",
    tagline: "High-quality mentions & links from top media sites",
    description:
      "Secure authority-boosting placements that lift your Domain Authority and Domain Rating with safe, sustainable strategies.",
    url: "https://linksresource.com/da-dr-boost-services/",
    category: "link-building",
    tags: ["backlinks", "analytics"],
    pricing: "Paid",
    featured: false,
    popular: true,
    rating: 4.6,
    views: 7300,
    createdAt: "2026-02-10T00:00:00.000Z",
    logoColor: "purple",
  },
  {
    slug: "seo-content-writing",
    title: "SEO Content Writing",
    tagline: "Content built to rank, attract traffic and convert",
    description:
      "SEO-optimized, well-researched content that matches your brand voice and is engineered to rank and convert visitors into leads.",
    url: "https://linksresource.com/seo-content-writing-services/",
    category: "content-writing",
    tags: ["copywriting", "keyword-research"],
    pricing: "Paid",
    featured: true,
    popular: true,
    rating: 4.9,
    views: 12600,
    createdAt: "2026-01-28T00:00:00.000Z",
    logoColor: "pink",
  },
  {
    slug: "local-seo",
    title: "Local SEO",
    tagline: "Improve local rankings & attract nearby customers",
    description:
      "Location-focused SEO to improve maps ranking, local visibility and lead generation for businesses targeting nearby customers.",
    url: "https://linksresource.com/local-seo-services/",
    category: "seo-tools",
    tags: ["local-seo", "analytics"],
    pricing: "Paid",
    featured: false,
    popular: false,
    rating: 4.7,
    views: 6100,
    createdAt: "2026-02-14T00:00:00.000Z",
    logoColor: "blue",
  },
  {
    slug: "technical-seo-audit",
    title: "Technical SEO Audit",
    tagline: "Fix indexing, performance & Core Web Vitals",
    description:
      "Improve website structure, indexing, performance and technical health for better search visibility and stronger rankings.",
    url: "https://linksresource.com/search-engine-optimaization-services/",
    category: "seo-tools",
    tags: ["analytics", "keyword-research"],
    pricing: "Freemium",
    featured: true,
    popular: true,
    rating: 4.8,
    views: 14100,
    createdAt: "2026-02-18T00:00:00.000Z",
    logoColor: "blue",
  },
  {
    slug: "web-design-development",
    title: "Web Design & Development",
    tagline: "Conversion-focused, SEO-optimized websites that perform",
    description:
      "Fast, modern, responsive websites built for performance and business growth, with conversion-focused UX and clean code.",
    url: "https://linksresource.com/web-development-services/",
    category: "web-development",
    tags: ["framework", "hosting"],
    pricing: "Paid",
    featured: true,
    popular: false,
    rating: 4.8,
    views: 8800,
    createdAt: "2026-02-22T00:00:00.000Z",
    logoColor: "blue",
  },
  {
    slug: "keyword-research-kit",
    title: "Keyword Research Kit",
    tagline: "Data-driven keyword discovery & clustering",
    description:
      "Find high-intent keywords, cluster topics and prioritize opportunities with a data-driven research workflow.",
    url: "https://linksresource.com/",
    category: "seo-tools",
    tags: ["keyword-research", "analytics", "free"],
    pricing: "Free",
    featured: false,
    popular: true,
    rating: 4.5,
    views: 5400,
    createdAt: "2026-03-01T00:00:00.000Z",
    logoColor: "purple",
  },
  {
    slug: "geo-llm-optimization",
    title: "GEO / LLM Optimization",
    tagline: "Boost visibility across search engines AND LLMs",
    description:
      "Generative Engine Optimization to make your brand discoverable across both traditional search and large language models.",
    url: "https://linksresource.com/",
    category: "ai-tools",
    tags: ["automation", "analytics"],
    pricing: "Freemium",
    featured: true,
    popular: true,
    rating: 4.9,
    views: 16700,
    createdAt: "2026-03-08T00:00:00.000Z",
    logoColor: "purple",
  },
  {
    slug: "brand-design-system",
    title: "Brand Design System",
    tagline: "Premium UI kits & brand guidelines",
    description:
      "Reusable design systems, UI kits and brand guidelines to keep your product consistent and beautiful at scale.",
    url: "https://linksresource.com/",
    category: "design",
    tags: ["ui-kit", "inspiration"],
    pricing: "Freemium",
    featured: false,
    popular: false,
    rating: 4.6,
    views: 4200,
    createdAt: "2026-03-12T00:00:00.000Z",
    logoColor: "pink",
  },
  {
    slug: "ai-content-assistant",
    title: "AI Content Assistant",
    tagline: "Draft, optimize and scale content with AI",
    description:
      "An AI-powered assistant for drafting, optimizing and scaling SEO content while keeping your brand voice consistent.",
    url: "https://linksresource.com/",
    category: "ai-tools",
    tags: ["automation", "copywriting"],
    pricing: "Freemium",
    featured: true,
    popular: true,
    rating: 4.8,
    views: 13900,
    createdAt: "2026-03-18T00:00:00.000Z",
    logoColor: "purple",
  },
];

/* ============================================================
   Dynamic service pages — built from legacy service layouts
   ============================================================ */
export const servicePages: ServicePageContent[] = [
  {
    slug: "technical-seo-audit",
    eyebrow: "SEO Services",
    title: "Rank Higher with Data-Driven SEO Strategies",
    subtitle:
      "Custom SEO campaigns that improve rankings, traffic quality, and conversion opportunities for long-term growth.",
    heroPoints: [
      "On-page, technical, and off-page SEO execution",
      "Keyword clusters and intent mapping",
      "Transparent monthly reporting and KPI tracking",
      "Built for sustainable growth, not quick wins",
    ],
    stats: [
      { label: "Keywords Ranked", value: "5,360", delta: "+28%" },
      { label: "Monthly Organic Traffic", value: "2,300", delta: "+421%" },
      { label: "Referring Domains", value: "2,480", delta: "+15%" },
      { label: "Average DR Growth", value: "72", delta: "+12%" },
    ],
    packages: [
      {
        name: "Starter SEO",
        price: "$299",
        period: "/month",
        description: "For small websites building organic foundations.",
        features: [
          "Keyword research and mapping",
          "On-page optimization",
          "Technical SEO checkup",
          "Monthly reporting dashboard",
        ],
      },
      {
        name: "Growth SEO",
        price: "$499",
        period: "/month",
        description: "For scaling websites targeting competitive keywords.",
        features: [
          "Everything in Starter",
          "Content optimization briefs",
          "Internal link optimization",
          "Authority strategy planning",
        ],
      },
      {
        name: "Dominance SEO",
        price: "$899",
        period: "/month",
        description: "For brands needing aggressive SEO growth.",
        features: [
          "Everything in Growth",
          "Advanced technical fixes",
          "Competitor gap campaigns",
          "Conversion-first tracking",
        ],
      },
    ],
    whyTitle: "Why Our SEO Strategy Delivers Better Results",
    whyDescription:
      "We blend technical optimization, authority campaigns, and user-intent content to build compounding search growth.",
    whyPoints: [
      "Focused on buyer intent and commercial keywords",
      "Content + technical + authority executed as one system",
      "Transparent reporting with clear growth milestones",
      "Strategies adapted monthly from real performance data",
    ],
    processTitle: "Our SEO Growth Process",
    processSteps: [
      {
        title: "Audit & Opportunity Mapping",
        description:
          "We audit your current website performance, rankings, and competitors to identify the fastest growth opportunities.",
      },
      {
        title: "SEO Strategy & Roadmap",
        description:
          "We build a prioritized roadmap covering technical fixes, content priorities, and authority campaigns.",
      },
      {
        title: "Implementation & Optimization",
        description:
          "Our team executes improvements and continuously optimizes pages and campaigns based on performance.",
      },
      {
        title: "Tracking, Reporting & Scale",
        description:
          "We monitor rankings, traffic, and conversions, then expand what is performing best.",
      },
    ],
    deliverablesTitle: "What You Get",
    deliverables: [
      "Technical SEO fixes and health monitoring",
      "Keyword maps and page-level optimization",
      "Monthly SEO progress reports",
      "Competitor and content gap insights",
      "Conversion-oriented recommendations",
      "Dedicated strategist support",
    ],
    sampleLogos: ["/logos/google.svg", "/logos/semrush.svg", "/logos/stripe.svg", "/logos/paypal.svg"],
    faqTitle: "FAQs",
    faq: [
      {
        q: "How long does SEO take to show results?",
        a: "Most campaigns start seeing meaningful movement in 8-12 weeks, while stronger compounding growth happens over 4-6 months.",
      },
      {
        q: "Do you offer local and national SEO?",
        a: "Yes. We run both local SEO campaigns and broader national/international strategies based on your business goals.",
      },
      {
        q: "Will I receive monthly reports?",
        a: "Yes. You get transparent monthly reporting with rankings, traffic, visibility, and action updates.",
      },
    ],
    ctaTitle: "Ready To Grow Your Business?",
    ctaButton: "Get Free Proposal",
  },
  {
    slug: "seo-content-writing",
    eyebrow: "SEO Content Writing",
    title: "Rank-Ready Content Designed to Convert",
    subtitle:
      "SEO-focused content production that improves visibility, authority, and qualified traffic across your key pages.",
    heroPoints: [
      "Keyword-focused editorial planning",
      "Brand-matched writing tone and voice",
      "On-page SEO formatting and optimization",
      "Content designed for rankings and conversions",
    ],
    stats: [
      { label: "Articles Published", value: "800", delta: "+150%" },
      { label: "Monthly Traffic Lift", value: "4,100", delta: "+412%" },
      { label: "Keywords Indexed", value: "2,700", delta: "+210%" },
      { label: "Avg. Content Score", value: "91/100", delta: "+18%" },
    ],
    packages: [
      {
        name: "Basic Content",
        price: "$20",
        period: "/article",
        description: "SEO blog posts for foundational growth.",
        features: [
          "Keyword-focused outline",
          "SEO-ready headings and structure",
          "Human-written content",
          "Basic optimization notes",
        ],
      },
      {
        name: "Growth Content",
        price: "$40",
        period: "/article",
        description: "Conversion-focused content for scaling sites.",
        features: [
          "Everything in Basic",
          "Search intent optimization",
          "Internal link suggestions",
          "Enhanced readability tuning",
        ],
      },
      {
        name: "Authority Content",
        price: "$70",
        period: "/article",
        description: "High-performance content for competitive niches.",
        features: [
          "Everything in Growth",
          "SERP competitor gap mapping",
          "CTA and conversion copy layers",
          "Advanced editorial QA",
        ],
      },
    ],
    whyTitle: "Why Our Content Strategy Works Better",
    whyDescription:
      "Our writing process aligns keyword intent, topical depth, and conversion flow so pages rank and perform.",
    whyPoints: [
      "SEO-first planning before writing starts",
      "Editorial quality designed for brand trust",
      "Content built for both users and search engines",
      "Performance optimization after publishing",
    ],
    processTitle: "Simple Content Creation Process",
    processSteps: [
      {
        title: "Research & Topic Planning",
        description:
          "We map topics, keyword clusters, and content priorities around your business goals.",
      },
      {
        title: "Writing & Optimization",
        description:
          "Our team writes content with SEO structure, readability, and conversion flow in mind.",
      },
      {
        title: "Review & Publish Support",
        description:
          "We deliver publication-ready drafts with formatting and optimization recommendations.",
      },
      {
        title: "Performance Refresh",
        description:
          "We monitor published content and recommend updates to strengthen rankings over time.",
      },
    ],
    deliverablesTitle: "What You Get",
    deliverables: [
      "SEO-focused content briefs",
      "Human-written optimized articles",
      "Meta title and meta description suggestions",
      "Internal linking recommendations",
      "Editorial proofreading and QA",
      "Optional monthly content calendar",
    ],
    sampleLogos: ["/logos/google.svg", "/logos/googlepay.svg", "/logos/semrush.svg", "/logos/binance.svg"],
    faqTitle: "FAQs",
    faq: [
      {
        q: "Can you match our existing brand tone?",
        a: "Yes. We align each piece with your preferred voice, positioning, and audience style guidelines.",
      },
      {
        q: "Do you include keyword research?",
        a: "Yes. Every package includes keyword mapping and topic targeting to support ranking growth.",
      },
      {
        q: "Can your team upload content to our CMS?",
        a: "Yes. We can support formatting and publishing workflows for WordPress and similar platforms.",
      },
    ],
    ctaTitle: "Ready To Rank Higher with Powerful Content?",
    ctaButton: "Get Free Proposal",
  },
  {
    slug: "da-dr-boost",
    eyebrow: "DA / DR Boost",
    title: "Build Authority with High-Quality Mentions",
    subtitle:
      "Secure trusted placements and links from relevant websites that improve domain strength and SEO performance.",
    heroPoints: [
      "Niche-relevant, quality-first placements",
      "Real websites with organic traffic",
      "Safe anchor strategy and manual outreach",
      "Monthly authority growth tracking",
    ],
    stats: [
      { label: "Avg DA Increase", value: "22", delta: "+180%" },
      { label: "Avg DR Increase", value: "18", delta: "+150%" },
      { label: "Placement Success", value: "89%", delta: "+25%" },
      { label: "Client Retention", value: "94%", delta: "+19%" },
    ],
    packages: [
      {
        name: "Starter Boost",
        price: "$250",
        period: "/month",
        description: "For new sites improving baseline authority.",
        features: [
          "Manual outreach placement list",
          "Niche-relevant opportunities",
          "Anchor strategy guidance",
          "Monthly progress report",
        ],
      },
      {
        name: "Growth Boost",
        price: "$500",
        period: "/month",
        description: "For growing domains needing faster trust signals.",
        features: [
          "Everything in Starter",
          "Higher-authority placement mix",
          "Competitor authority comparison",
          "Priority campaign execution",
        ],
      },
      {
        name: "Authority Boost",
        price: "$900",
        period: "/month",
        description: "For aggressive authority and ranking campaigns.",
        features: [
          "Everything in Growth",
          "Premium outreach network",
          "Advanced performance tracking",
          "Dedicated campaign manager",
        ],
      },
    ],
    whyTitle: "What Sets Our Link Building Results Apart",
    whyDescription:
      "Our focus is quality relevance and long-term impact instead of bulk link quantity.",
    whyPoints: [
      "Manual vetting for every placement",
      "Contextual links from relevant content",
      "No risky automation or spam tactics",
      "Built to support sustained organic growth",
    ],
    processTitle: "Link Building Methods We Use",
    processSteps: [
      {
        title: "Prospect Research",
        description:
          "We identify websites aligned with your niche, audience, and quality requirements.",
      },
      {
        title: "Outreach & Relationship Building",
        description:
          "Our team runs manual outreach to secure relevant and trustworthy placement opportunities.",
      },
      {
        title: "Content Placement",
        description:
          "We place contextual links in high-quality content with safe anchor optimization.",
      },
      {
        title: "Reporting & Growth Reviews",
        description:
          "You receive transparent placement reports, authority movement, and next-step recommendations.",
      },
    ],
    deliverablesTitle: "Explore More Digital Growth Services",
    deliverables: [
      "Editorial guest posting",
      "White-label outreach support",
      "On-page SEO alignment",
      "Content writing for placements",
      "Monthly campaign planning",
      "Authority performance dashboard",
    ],
    sampleLogos: ["/logos/semrush.svg", "/logos/google.svg", "/logos/stripe.svg", "/logos/binance.svg"],
    faqTitle: "FAQs",
    faq: [
      {
        q: "Do you guarantee specific DA/DR numbers?",
        a: "We do not guarantee exact third-party metrics, but we build campaigns designed to improve authority signals safely and consistently.",
      },
      {
        q: "Are links built manually?",
        a: "Yes. We rely on manual outreach and quality vetting, not automated link blasts.",
      },
      {
        q: "Can this help ranking growth?",
        a: "Yes, stronger authority usually supports improved rankings when paired with technical and content optimization.",
      },
    ],
    ctaTitle: "Ready To Grow Your Business?",
    ctaButton: "Get Free Proposal",
  },
  {
    slug: "web-design-development",
    eyebrow: "Web Development",
    title: "Build Fast, Conversion-Focused Websites",
    subtitle:
      "Modern websites designed for performance, usability, and business growth with clean UX and scalable architecture.",
    heroPoints: [
      "Responsive, mobile-first design system",
      "SEO-ready architecture and page speed",
      "Conversion-focused page layouts",
      "Reliable support after launch",
    ],
    stats: [
      { label: "Avg Load Speed", value: "1.8s", delta: "+52%" },
      { label: "Mobile Score", value: "90+", delta: "+38%" },
      { label: "Conversion Uplift", value: "32%", delta: "+21%" },
      { label: "Client Satisfaction", value: "96%", delta: "+18%" },
    ],
    packages: [
      {
        name: "Starter Site",
        price: "$399",
        period: "/one-time",
        description: "For businesses launching their first conversion-ready site.",
        features: [
          "Up to 5 custom pages",
          "Mobile responsive design",
          "Basic speed optimization",
          "Contact form integration",
        ],
      },
      {
        name: "Business Site",
        price: "$899",
        period: "/one-time",
        description: "For teams needing stronger performance and flexibility.",
        features: [
          "Everything in Starter",
          "Service-focused landing pages",
          "On-page SEO structure",
          "CMS-friendly setup",
        ],
      },
      {
        name: "Scale Site",
        price: "$1499",
        period: "/one-time",
        description: "For growth brands with advanced requirements.",
        features: [
          "Everything in Business",
          "Advanced UX conversion flow",
          "Performance-first architecture",
          "Technical support handover",
        ],
      },
    ],
    whyTitle: "Why Our Web Development Stands Out",
    whyDescription:
      "We design and build websites as growth assets, not just design mockups.",
    whyPoints: [
      "Built for speed, SEO, and usability",
      "Design decisions tied to business goals",
      "Scalable structure for future updates",
      "Clear communication from discovery to launch",
    ],
    processTitle: "Simple Development Process",
    processSteps: [
      {
        title: "Discovery",
        description:
          "We gather goals, brand direction, user needs, and key conversion actions.",
      },
      {
        title: "Design & Build",
        description:
          "Our team designs responsive UI and develops clean, performance-optimized pages.",
      },
      {
        title: "QA & Launch",
        description:
          "We test across devices, optimize critical paths, and launch with confidence.",
      },
      {
        title: "Ongoing Optimization",
        description:
          "Post-launch improvements help keep the website fast, relevant, and conversion-ready.",
      },
    ],
    deliverablesTitle: "What You Get",
    deliverables: [
      "Custom responsive page layouts",
      "SEO-friendly website structure",
      "Fast-loading performance setup",
      "Lead form and conversion tracking",
      "Editable content-ready sections",
      "Launch and support checklist",
    ],
    sampleLogos: ["/logos/stripe.svg", "/logos/googlepay.svg", "/logos/paypal.svg", "/logos/google.svg"],
    faqTitle: "FAQs",
    faq: [
      {
        q: "Do you build on WordPress and custom stacks?",
        a: "Yes. We support WordPress and modern custom web stacks depending on project needs.",
      },
      {
        q: "Will the website be mobile optimized?",
        a: "Absolutely. Every build is responsive and tested for mobile performance and usability.",
      },
      {
        q: "Can you redesign our existing website?",
        a: "Yes. We can rebuild or upgrade your current site while preserving important SEO assets.",
      },
    ],
    ctaTitle: "Ready To Build a Powerful Website?",
    ctaButton: "Get Free Proposal",
  },
  {
    slug: "local-seo",
    eyebrow: "Local SEO",
    title: "Get Found in Google Maps & Local Search",
    subtitle:
      "Local SEO campaigns that improve map visibility, location rankings, and lead quality for service-area businesses.",
    heroPoints: [
      "Google Business Profile optimization",
      "Location page and citation strategy",
      "Local keyword and intent targeting",
      "Monthly rankings and lead tracking",
    ],
    stats: [
      { label: "Map Visibility", value: "+900%", delta: "+74%" },
      { label: "Calls from Local SEO", value: "134", delta: "+61%" },
      { label: "Qualified Leads", value: "61", delta: "+42%" },
      { label: "Avg Timeline", value: "10 weeks", delta: "steady" },
    ],
    packages: [
      {
        name: "Starter Local SEO",
        price: "$249",
        period: "/month",
        description: "For single-location businesses starting local growth.",
        features: [
          "Google profile optimization",
          "Core citation cleanup",
          "Local keyword mapping",
          "Monthly report",
        ],
      },
      {
        name: "Growth Local SEO",
        price: "$399",
        period: "/month",
        description: "For businesses aiming to dominate their city market.",
        features: [
          "Everything in Starter",
          "Local landing page optimization",
          "Review growth framework",
          "Competitor local analysis",
        ],
      },
      {
        name: "Multi-Location SEO",
        price: "$699",
        period: "/month",
        description: "For brands with multiple locations and service regions.",
        features: [
          "Everything in Growth",
          "Multi-location campaign setup",
          "Scalable local content strategy",
          "Advanced local rank tracking",
        ],
      },
    ],
    whyTitle: "Why Local SEO Matters",
    whyDescription:
      "Local intent searches convert fast. We build campaigns that turn nearby demand into measurable leads.",
    whyPoints: [
      "Map pack visibility for high-intent searches",
      "Optimized business listings across directories",
      "Localized content strategy for service regions",
      "Focused growth from calls, direction requests, and leads",
    ],
    processTitle: "Simple Local SEO Process",
    processSteps: [
      {
        title: "Local Audit",
        description:
          "We evaluate your profile, citations, local rankings, and nearby competitors.",
      },
      {
        title: "Optimization Setup",
        description:
          "We optimize listings, pages, and local signals to improve relevance and trust.",
      },
      {
        title: "Authority & Reviews",
        description:
          "We strengthen local authority with review strategy and citation consistency.",
      },
      {
        title: "Performance Tracking",
        description:
          "You receive local ranking and lead reports with ongoing improvement recommendations.",
      },
    ],
    deliverablesTitle: "What You Get",
    deliverables: [
      "Google Business Profile improvements",
      "Citation consistency and cleanup",
      "Local keyword and page optimization",
      "Review growth recommendations",
      "Lead and call tracking insights",
      "Monthly local growth roadmap",
    ],
    sampleLogos: ["/logos/google.svg", "/logos/semrush.svg", "/logos/googlepay.svg", "/logos/paypal.svg"],
    faqTitle: "FAQs",
    faq: [
      {
        q: "Can local SEO help service-area businesses?",
        a: "Yes. We build campaigns for both storefront and service-area businesses targeting nearby customers.",
      },
      {
        q: "How quickly can map rankings improve?",
        a: "Many businesses see early movement in 4-8 weeks, with stronger consistency over 2-4 months.",
      },
      {
        q: "Do you manage Google Business Profile updates?",
        a: "Yes. We support profile optimization, updates, and strategic posting guidance.",
      },
    ],
    ctaTitle: "Want More Local Customers Finding Your Business?",
    ctaButton: "Get Free Proposal",
  },
  {
    slug: "editorial-guest-posting",
    eyebrow: "Editorial Guest Posting",
    title: "Guest Posting Campaigns That Support Long-Term SEO Growth",
    subtitle:
      "Manual outreach and placement campaigns to secure contextual backlinks on trusted, niche-relevant websites.",
    heroPoints: [
      "Manual outreach and real relationships",
      "No PBNs, no spammy automation",
      "Niche-relevant contextual placements",
      "Transparent live campaign reporting",
    ],
    stats: [
      { label: "Placements Delivered", value: "89+", delta: "monthly" },
      { label: "Average DR Mix", value: "50-90", delta: "quality" },
      { label: "Link Approval Rate", value: "82%", delta: "+23%" },
      { label: "Avg Growth Timeline", value: "3-6 mo", delta: "steady" },
    ],
    packages: [
      {
        name: "Starter Outreach",
        price: "$89",
        period: "/link",
        description: "For businesses building foundational link equity.",
        features: [
          "Manual outreach campaign",
          "Niche-relevant publisher selection",
          "Contextual in-content links",
          "Reporting with live URLs",
        ],
      },
      {
        name: "Growth Outreach",
        price: "$149",
        period: "/link",
        description: "For campaigns focused on stronger authority lift.",
        features: [
          "Everything in Starter",
          "Higher-authority publisher mix",
          "Anchor strategy alignment",
          "Priority turnaround window",
        ],
      },
      {
        name: "Agency Outreach",
        price: "$249",
        period: "/link",
        description: "For agencies and brands requiring scale.",
        features: [
          "Everything in Growth",
          "White-label reporting options",
          "Multi-campaign planning",
          "Dedicated account support",
        ],
      },
    ],
    whyTitle: "How Our Guest Posting Process Works",
    whyDescription:
      "Every campaign is planned for quality, relevance, and sustainability to protect long-term rankings.",
    whyPoints: [
      "Prospect qualification by niche fit and metrics",
      "Custom outreach with real editors and webmasters",
      "Contextual placement in relevant content",
      "Clear reporting from first prospect to live link",
    ],
    processTitle: "How Our Guest Posting Process Works",
    processSteps: [
      {
        title: "Prospect Research",
        description:
          "We identify relevant websites aligned with your niche and campaign objectives.",
      },
      {
        title: "Manual Outreach",
        description:
          "Our team runs personalized outreach to secure high-quality editorial opportunities.",
      },
      {
        title: "Content & Placement",
        description:
          "We place contextual, natural links inside quality content built for user and SEO value.",
      },
      {
        title: "Reporting & Optimization",
        description:
          "You receive live placement reports and strategy improvements for upcoming cycles.",
      },
    ],
    deliverablesTitle: "What You Get",
    deliverables: [
      "Pre-vetted niche-relevant prospects",
      "Manual outreach and deal handling",
      "Contextual editorial placements",
      "Anchor text strategy support",
      "Live placement and metric reporting",
      "Scalable monthly campaign plans",
    ],
    sampleLogos: ["/logos/google.svg", "/logos/semrush.svg", "/logos/binance.svg", "/logos/stripe.svg"],
    faqTitle: "FAQs",
    faq: [
      {
        q: "Do you use private blog networks?",
        a: "No. We focus on real outreach and editorial placements on genuine websites.",
      },
      {
        q: "Can I review sites before publishing?",
        a: "Yes. We can provide a pre-approval workflow based on your campaign package.",
      },
      {
        q: "Is guest posting safe for long-term SEO?",
        a: "Yes, when done ethically with relevance and quality controls, which is exactly how we operate.",
      },
    ],
    ctaTitle: "Get a Free Digital Growth Consultation",
    ctaButton: "Get Free Proposal",
  },
  {
    slug: "editorial-link-building",
    eyebrow: "Editorial Link Building",
    title: "Editorial Links from Real Websites That Drive Rankings",
    subtitle:
      "Authority-focused editorial link campaigns built through manual outreach and relevant placements.",
    heroPoints: [
      "Editorial placements on relevant sites",
      "Manual outreach with vetted publishers",
      "Campaigns aligned to niche relevance",
      "Monthly reporting and clear visibility",
    ],
    stats: [
      { label: "Placement Quality Mix", value: "DR 50-90", delta: "high" },
      { label: "Average Approval Rate", value: "84%", delta: "+17%" },
      { label: "Campaign Retention", value: "91%", delta: "+13%" },
      { label: "Organic Lift", value: "2.4x", delta: "+26%" },
    ],
    packages: [
      {
        name: "Starter Editorial",
        price: "$100",
        period: "/link",
        description: "For businesses starting high-quality link acquisition.",
        features: [
          "Manual outreach to niche publishers",
          "Contextual editorial link placements",
          "Quality checks and domain vetting",
          "Transparent reporting",
        ],
      },
      {
        name: "Growth Editorial",
        price: "$180",
        period: "/link",
        description: "For stronger authority campaigns in competitive sectors.",
        features: [
          "Everything in Starter",
          "Higher-authority publisher mix",
          "Anchor strategy planning",
          "Priority delivery windows",
        ],
      },
    ],
    whyTitle: "How Our Editorial Outreach Process Works",
    whyDescription:
      "We prioritize quality, relevance, and editorial integrity to support sustainable ranking growth.",
    whyPoints: [
      "Manual prospect selection for every campaign",
      "Contextual placements built for users and SEO",
      "Publisher quality vetting before placement",
      "Performance-focused campaign iteration",
    ],
    processTitle: "How Our Editorial Outreach Process Works",
    processSteps: [
      {
        title: "Website Prospect Discovery",
        description:
          "We identify highly relevant publishers based on niche fit, authority, and content quality.",
      },
      {
        title: "Manual Outreach & Negotiation",
        description:
          "Our team handles communication and placement negotiation to secure quality opportunities.",
      },
      {
        title: "Placement & QA Review",
        description:
          "Each placement is reviewed for context, anchor quality, and long-term SEO safety.",
      },
      {
        title: "Reporting & Next Campaign",
        description:
          "You receive live reports with performance updates and suggestions for the next cycle.",
      },
    ],
    deliverablesTitle: "What You Get",
    deliverables: [
      "Niche-relevant publisher outreach",
      "Contextual editorial placements",
      "Campaign-quality filters and checks",
      "Anchor optimization guidance",
      "Live link and metric reporting",
      "Monthly campaign recommendations",
    ],
    sampleLogos: ["/logos/google.svg", "/logos/semrush.svg", "/logos/stripe.svg", "/logos/paypal.svg"],
    faqTitle: "FAQs",
    faq: [
      {
        q: "Are placements on real websites?",
        a: "Yes. We focus on real publishers with organic activity and content relevance.",
      },
      {
        q: "Can I scale this monthly?",
        a: "Yes. Editorial campaigns can be scaled month by month based on goals and competition.",
      },
      {
        q: "Do you provide transparent reports?",
        a: "Yes. You receive complete link-level reporting with campaign updates.",
      },
    ],
    ctaTitle: "Get a Free Digital Growth Consultation",
    ctaButton: "Get Free Proposal",
  },
  {
    slug: "white-label-link-building",
    eyebrow: "White Label Link Building",
    title: "White Label Link Building Services for SEO Agencies",
    subtitle:
      "Scalable outreach and backlink delivery designed for agencies that need quality and consistency.",
    heroPoints: [
      "Agency-ready campaign workflows",
      "Consistent white-label reporting",
      "Manual outreach and editorial quality",
      "Built for monthly scaling",
    ],
    stats: [
      { label: "Agency Retention", value: "93%", delta: "+21%" },
      { label: "Average Delivery", value: "100+ links/mo", delta: "scaled" },
      { label: "Client Approval", value: "89%", delta: "+19%" },
      { label: "Campaign Growth", value: "2.2x", delta: "+24%" },
    ],
    packages: [
      {
        name: "Starter White Label",
        price: "$100",
        period: "/link",
        description: "For agencies building repeatable link delivery systems.",
        features: [
          "Manual outreach placement campaigns",
          "White-label ready reporting",
          "Niche-relevant website targeting",
          "Monthly strategy alignment",
        ],
      },
      {
        name: "Scale White Label",
        price: "$190",
        period: "/link",
        description: "For agencies requiring premium placement quality and volume.",
        features: [
          "Everything in Starter",
          "Higher authority placement mix",
          "Priority campaign management",
          "Dedicated account coordination",
        ],
      },
    ],
    whyTitle: "How Our Outreach Process Works",
    whyDescription:
      "Our white-label model keeps delivery quality high while giving agencies clear, client-ready reporting.",
    whyPoints: [
      "Built for agency workflows and handoff",
      "Quality-first publisher selection",
      "Transparent delivery updates every cycle",
      "Scalable system for long-term growth",
    ],
    processTitle: "How Our Outreach Process Works",
    processSteps: [
      {
        title: "Campaign Intake",
        description:
          "We align with your client goals, niche focus, quality thresholds, and monthly targets.",
      },
      {
        title: "Prospect Vetting",
        description:
          "Websites are vetted for relevance, authority, and quality before outreach begins.",
      },
      {
        title: "Outreach & Placement",
        description:
          "Manual outreach secures contextual placements aligned with your campaign strategy.",
      },
      {
        title: "White Label Reporting",
        description:
          "You receive clean, client-facing reports and insights for ongoing campaign planning.",
      },
    ],
    deliverablesTitle: "What You Get",
    deliverables: [
      "White-label campaign delivery",
      "Manual outreach and negotiation",
      "Contextual editorial placements",
      "Client-ready monthly reports",
      "Scalable volume planning",
      "Dedicated support for agencies",
    ],
    sampleLogos: ["/logos/semrush.svg", "/logos/google.svg", "/logos/binance.svg", "/logos/stripe.svg"],
    faqTitle: "FAQs",
    faq: [
      {
        q: "Do clients see Links Resource branding?",
        a: "No. White-label workflows are designed so agencies can present delivery under their own brand.",
      },
      {
        q: "Can we run multiple client campaigns?",
        a: "Yes. We support multi-client monthly delivery with scalable campaign management.",
      },
      {
        q: "Is quality consistent at scale?",
        a: "Yes. We use repeatable quality controls and vetting processes across all campaigns.",
      },
    ],
    ctaTitle: "Get a Free Digital Growth Consultation",
    ctaButton: "Get Free Proposal",
  },
];

/* ============================================================
   Services — preserved from linksresource.com
   ============================================================ */
export const services: Service[] = [
  {
    slug: "link-building",
    title: "Link Building & Guest Posting",
    description: "Build authority with high-quality backlinks from real websites.",
    icon: "Link2",
    points: ["No PBNs", "Niche-relevant placements", "Long-term SEO impact"],
  },
  {
    slug: "content-writing",
    title: "Content Writing",
    description: "SEO-optimized content that ranks and converts.",
    icon: "PenLine",
    points: ["Brand-matched voice", "Well researched", "Conversion focused"],
  },
  {
    slug: "web-development",
    title: "Website Development",
    description: "Create fast, modern, and conversion-focused websites.",
    icon: "Code2",
    points: ["Responsive design", "Performance first", "SEO-ready"],
  },
  {
    slug: "seo",
    title: "Search Engine Optimization",
    description: "Improve rankings, traffic, and visibility with complete SEO.",
    icon: "Search",
    points: ["Technical SEO", "On-page", "Off-page authority"],
  },
];

/* ============================================================
   Case studies — preserved from linksresource.com
   ============================================================ */
export const caseStudies: CaseStudy[] = [
  {
    slug: "flat-seo-to-2300-traffic",
    category: "Link Building",
    title: "Turning Flat SEO Into 2,300+ Monthly Traffic",
    metrics: [
      { value: "2,300", label: "Organic Traffic" },
      { value: "3,500", label: "Keywords Ranking" },
      { value: "$2,500/mo", label: "Monthly Investment" },
      { value: "1 year", label: "Timeline" },
    ],
  },
  {
    slug: "15-links-a-month",
    category: "Link Building",
    title: "How 15 Links a Month Changed Everything",
    metrics: [
      { value: "3,272", label: "Organic Traffic" },
      { value: "6,789", label: "Keywords Ranking" },
      { value: "$5k/mo", label: "Monthly Investment" },
      { value: "1 year", label: "Timeline" },
    ],
  },
  {
    slug: "seo-growth-case",
    category: "Search Engine Optimization",
    title: "Compounding SEO Growth Case Study",
    metrics: [
      { value: "3,472%", label: "Organic Traffic" },
      { value: "100.5%", label: "Keyword Growth" },
      { value: "CWVs Fixed", label: "On-Page" },
      { value: "5 mo | $1k/mo", label: "Investment" },
    ],
  },
  {
    slug: "local-seo-case",
    category: "Local SEO",
    title: "Local SEO That Generated Real Leads",
    metrics: [
      { value: "+900%", label: "Local Visibility" },
      { value: "+700%", label: "Maps Ranking" },
      { value: "45", label: "Leads Generated" },
      { value: "4 weeks", label: "Growth Timeline" },
    ],
  },
  {
    slug: "web-dev-case",
    category: "Web Development",
    title: "Conversion-Focused Website Rebuild",
    metrics: [
      { value: "WordPress", label: "CMS Platform" },
      { value: "Company", label: "Website Type" },
      { value: "Tech", label: "Industry" },
      { value: "Full Build", label: "Project Scope" },
    ],
  },
  {
    slug: "content-writing-case",
    category: "Content Writing",
    title: "Content That Compounded Organic Growth",
    metrics: [
      { value: "+6,790%", label: "Traffic Growth" },
      { value: "500+", label: "Keywords" },
      { value: "4 Days", label: "Timeline" },
      { value: "$0.05/ppw", label: "Budget" },
    ],
  },
  {
    slug: "da-dr-boost-case",
    category: "DA-DR Boost",
    title: "Authority Metrics That Unlocked Rankings",
    metrics: [
      { value: "DA 42", label: "Domain Authority" },
      { value: "DR 38", label: "Domain Rating" },
      { value: "+180%", label: "Referring Domains" },
      { value: "3 months", label: "Timeline" },
    ],
  },
];

export const caseStudyTabs = [
  "Link Building",
  "Search Engine Optimization",
  "DA-DR Boost",
  "Web Development",
  "Local SEO",
  "Content Writing",
] as const;

export const teamMembers: TeamMember[] = [
  {
    name: "Usama Javed",
    role: "Founder & Head of SEO Outreach",
    bio: "Leading outreach campaigns, authority link building, digital PR, and client strategy.",
    email: "usama@linksresource.com",
    image: "/team/usama.png",
    hoverImage: "/team/usama-hover.jpg",
    linkedin: "https://www.linkedin.com/in/usama-javed-3a4604265",
  },
  {
    name: "Arslan Javed",
    role: "Senior Link Building Specialist",
    bio: "Manual outreach, guest posting, niche edits, and authority backlink acquisition.",
    email: "arslan@linksresource.com",
    image: "/team/faizan.png",
    hoverImage: "/team/arslan.png",
    linkedin: "https://www.linkedin.com/in/arslan-javed-6407481bb/",
  },
  {
    name: "M. Faizan",
    role: "SEO Strategist",
    bio: "SEO roadmaps, competitor analysis, keyword research, and organic growth planning.",
    email: "strategy@linksresource.com",
    image: "/team/zain.png",
    hoverImage: "/team/faizan-hover.jpg",
  },
  {
    name: "Ali Butt",
    role: "Outreach & Partnerships Specialist",
    bio: "Publisher relations, outreach, negotiations, and placements.",
    email: "outreach@linksresource.com",
    image: "/team/ali-butt.png",
    hoverImage: "/team/ali-butt-hover.jpg",
  },
  {
    name: "Malik Zain",
    role: "MERN Stack, React Native & Node.js Developer",
    bio: "Full-stack development across React, React Native, Node.js, and modern web applications.",
    email: "malik@linksresource.com",
    image: "/team/aizal.png",
    hoverImage: "/team/malik-zain-hover.jpg",
    linkedin: "https://www.linkedin.com/in/malik-zain-85883b310",
  },
  {
    name: "Ali Hassan",
    role: "SEO Analyst",
    bio: "Technical insights, audits, and performance optimization across campaigns.",
    email: "alihassan@linksresource.com",
    image: "/team/ali-hassan.png",
    hoverImage: "/team/ali-hassan-hover.jpg",
  },
  {
    name: "Hamza Saeed",
    role: "Campaign Manager",
    bio: "Coordinates campaign delivery and keeps monthly growth timelines on track.",
    email: "hamza@linksresource.com",
    image: "/team/hamza.png",
    hoverImage: "/team/hamza-hover.jpg",
  },
  {
    name: "Zain Baig",
    role: "Growth Specialist",
    bio: "Supports client growth plans with campaign analytics and reporting improvements.",
    email: "zain@linksresource.com",
    image: "/team/zain-hover.jpg",
    hoverImage: "/team/zain.png",
  },
  {
    name: "Andrew Robin",
    role: "Technical Specialist",
    bio: "Supports automation, workflow tooling, and technical SEO implementations.",
    email: "andrew@linksresource.com",
    image: "/team/robin.png",
    hoverImage: "/team/andrew.png",
  },
];

/* ============================================================
   Reviews — preserved from linksresource.com
   ============================================================ */
export const reviews: Review[] = [
  {
    name: "Gail Schenbaum",
    role: "CEO at Umergency",
    body: "I worked with Links Resource for content writing services, and the experience was excellent. The team delivered high-quality, well-researched, and engaging content that perfectly matched our brand's voice. Highly recommend their services!",
  },
  {
    name: "Peter Johnson",
    role: "Product Manager, Kustomer",
    body: "Links Resource did an excellent job improving my website's authority and online visibility. Their team was professional, efficient, and delivered high-quality backlinks from relevant sites. Highly recommended for SEO results.",
  },
  {
    name: "Jhon Edison",
    role: "CEO, Drive Mouse",
    body: "I used Links Resource for on-page SEO services and I'm extremely satisfied with the results. They optimized my website perfectly, improving both performance and visibility. The team delivered exactly what they promised.",
  },
];

/* ============================================================
   How it works — preserved
   ============================================================ */
export const howItWorks: Step[] = [
  {
    index: "01",
    title: "Understand your business",
    description:
      "We start by learning your goals, audience, competitors, and current online presence to build a strategy that fits.",
  },
  {
    index: "02",
    title: "Create strategy",
    description:
      "Our team develops a clear action plan focused on visibility, authority, and long-term growth based on real research.",
  },
  {
    index: "03",
    title: "Execute campaigns",
    description:
      "We launch and manage campaigns across SEO, outreach, content and branding with a focus on measurable performance.",
  },
  {
    index: "04",
    title: "Deliver results",
    description:
      "You receive transparent reporting, steady growth, stronger rankings and real business impact that helps you scale.",
  },
];

export const whyChooseUs = [
  {
    index: "01",
    title: "Real Websites, Real Results",
    description:
      "We build backlinks on real websites with organic traffic, not spam networks.",
    points: ["No PBNs", "Niche-relevant placements", "Long-term SEO impact"],
  },
  {
    index: "02",
    title: "Manual Outreach, Not Automation",
    description:
      "Every placement is earned through real outreach and relationships.",
    points: ["No mass emails", "Higher quality links", "Better acceptance rate"],
  },
  {
    index: "03",
    title: "Full Transparency & Control",
    description:
      "You approve sites before publishing and get clear live reports.",
    points: ["Pre-approval system", "Live link tracking", "No hidden placements"],
  },
  {
    index: "04",
    title: "Built for Scalable Growth",
    description:
      "Consistent campaigns designed to increase rankings and traffic over time.",
    points: ["Monthly link building", "Safe anchor strategy", "Sustainable growth"],
  },
];

/* ============================================================
   Packages — preserved (placeholder pricing from current site)
   ============================================================ */
export const packages: Package[] = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    features: ["5 backlinks / mo", "DR 30–50 sites", "Live reporting", "Email support"],
  },
  {
    name: "Growth",
    price: "$299",
    period: "/month",
    highlight: true,
    features: [
      "15 backlinks / mo",
      "DR 50–70 sites",
      "Content included",
      "Priority support",
      "Strategy calls",
    ],
  },
  {
    name: "Scale",
    price: "$599",
    period: "/month",
    features: [
      "30+ backlinks / mo",
      "DR 70–90 sites",
      "Dedicated manager",
      "White-label reporting",
      "24/7 support",
    ],
  },
];

/* ============================================================
   FAQ — preserved
   ============================================================ */
export const faqs: Faq[] = [
  {
    q: "What digital marketing services do you offer?",
    a: "We offer SEO services, link building, content writing, website development, local SEO, and digital growth solutions designed to improve online visibility and business performance.",
  },
  {
    q: "How do I know which service is right for my business?",
    a: "The right service depends on your goals, competition, and business needs. We can review your website and recommend a tailored strategy based on your objectives.",
  },
  {
    q: "Do you offer custom strategies for different businesses?",
    a: "Yes. Every business is different, which is why we create tailored strategies based on your industry, audience, and growth goals rather than one-size-fits-all solutions.",
  },
  {
    q: "How long does it take to see results from SEO?",
    a: "Results vary depending on the service, competition, and current website condition. Some improvements may be noticeable sooner, while long-term growth typically takes more time.",
  },
  {
    q: "Why choose Links Resource for digital growth services?",
    a: "We focus on tailored strategies, transparent communication, ethical practices, and solutions designed to support long-term online growth.",
  },
];

/* ============================================================
   Query helpers (in-memory data layer — DB-ready via Prisma)
   ============================================================ */
export function getResources() {
  return resources;
}

export function getResourceBySlug(slug: string) {
  return resources.find((r) => r.slug === slug);
}

export function getServicePageBySlug(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getTagBySlug(slug: string) {
  return tags.find((t) => t.slug === slug);
}

export function getResourcesByCategory(slug: string) {
  return resources.filter((r) => r.category === slug);
}

export function getResourcesByTag(slug: string) {
  return resources.filter((r) => r.tags.includes(slug));
}

export function getFeatured() {
  return resources.filter((r) => r.featured);
}

export function getPopular() {
  return resources.filter((r) => r.popular);
}

export function getRecent() {
  return [...resources].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export function searchResources(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return resources.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.tagline.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.includes(q) ||
      r.tags.some((t) => t.includes(q))
  );
}

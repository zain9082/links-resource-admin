export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  gradient: "purple" | "blue" | "pink";
};

export type Tag = {
  slug: string;
  name: string;
};

export type Resource = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  url: string;
  category: string; // category slug
  tags: string[]; // tag slugs
  pricing: "Free" | "Freemium" | "Paid";
  featured: boolean;
  popular: boolean;
  rating: number;
  views: number;
  createdAt: string; // ISO
  logoColor: string; // gradient key for placeholder logo
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  points: string[];
};

export type CaseStudy = {
  slug: string;
  category: string;
  title: string;
  metrics: { value: string; label: string }[];
};

export type Review = {
  name: string;
  role: string;
  body: string;
};

export type Faq = {
  q: string;
  a: string;
};

export type Package = {
  name: string;
  price: string;
  period: string;
  highlight?: boolean;
  features: string[];
};

export type Step = {
  index: string;
  title: string;
  description: string;
};

export type Partnership = {
  name: string;
  abbr?: string;
  logo?: string;
  url?: string;
  gradient: "purple" | "blue" | "pink";
};

export type Placement = {
  name: string;
  logo?: string;
  url?: string;
  gradient: "purple" | "blue" | "pink";
};

export type WebsiteMetric = {
  site: string;
  url: string;
  da: number;
  dr: number;
  traffic: string;
};

export type ServiceStat = {
  label: string;
  value: string;
  delta?: string;
};

export type ServicePackage = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
};

export type ServiceProcessStep = {
  title: string;
  description: string;
};

export type ServicePageContent = {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  heroPoints: string[];
  stats: ServiceStat[];
  packages: ServicePackage[];
  whyTitle: string;
  whyDescription: string;
  whyPoints: string[];
  processTitle: string;
  processSteps: ServiceProcessStep[];
  deliverablesTitle: string;
  deliverables: string[];
  sampleLogos: string[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaButton: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  email: string;
  image: string;
  hoverImage?: string;
  linkedin?: string;
};

import { Prisma, PrismaClient, Pricing, ResourceStatus } from "@prisma/client";
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
} from "../src/lib/legacy/data";
import { publicationSites } from "../src/lib/legacy/publications";
import {
  SERVICE_LANDING_DEFAULTS,
  SERVICE_LANDING_SLUGS,
} from "../src/lib/service-landing-defaults";

const prisma = new PrismaClient();

function toPricing(value: string): Pricing {
  if (value.toLowerCase() === "free") return Pricing.FREE;
  if (value.toLowerCase() === "paid") return Pricing.PAID;
  return Pricing.FREEMIUM;
}

function parseTatToDays(tat: string): number {
  const match = tat.match(/(\d+)\s*-\s*(\d+)|(\d+)/);
  if (!match) return 7;
  if (match[1] && match[2]) {
    const min = Number.parseInt(match[1], 10);
    const max = Number.parseInt(match[2], 10);
    return Math.round((min + max) / 2);
  }
  const single = match[3] ? Number.parseInt(match[3], 10) : 7;
  return Number.isNaN(single) ? 7 : single;
}

async function seedCategoriesAndTags() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        gradient: category.gradient,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        icon: category.icon,
        gradient: category.gradient,
      },
    });
  }

  const allTags = Array.from(
    new Set(resources.flatMap((resource) => resource.tags))
  ).map((slug) => ({ slug, name: slug.replace(/-/g, " ") }));

  for (const tag of allTags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
  }
}

async function seedResources() {
  for (const item of resources) {
    const category = await prisma.category.findUnique({
      where: { slug: item.category },
      select: { id: true },
    });
    if (!category) continue;

    const resource = await prisma.resource.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        tagline: item.tagline,
        description: item.description,
        url: item.url,
        pricing: toPricing(item.pricing),
        featured: item.featured,
        popular: item.popular,
        rating: item.rating,
        views: item.views,
        logoColor: item.logoColor,
        status: ResourceStatus.PUBLISHED,
        categoryId: category.id,
      },
      create: {
        slug: item.slug,
        title: item.title,
        tagline: item.tagline,
        description: item.description,
        url: item.url,
        pricing: toPricing(item.pricing),
        featured: item.featured,
        popular: item.popular,
        rating: item.rating,
        views: item.views,
        logoColor: item.logoColor,
        status: ResourceStatus.PUBLISHED,
        categoryId: category.id,
      },
      select: { id: true },
    });

    for (const tagSlug of item.tags) {
      const tag = await prisma.tag.findUnique({
        where: { slug: tagSlug },
        select: { id: true },
      });
      if (!tag) continue;

      await prisma.resourceTag.upsert({
        where: {
          resourceId_tagId: {
            resourceId: resource.id,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          resourceId: resource.id,
          tagId: tag.id,
        },
      });
    }
  }
}

async function seedTeamAndCaseStudies() {
  for (const [index, member] of teamMembers.entries()) {
    const existing = await prisma.teamMember.findFirst({
      where: { email: member.email },
      select: { id: true },
    });

    if (existing) {
      await prisma.teamMember.update({
        where: { id: existing.id },
        data: {
          name: member.name,
          role: member.role,
          bio: member.bio,
          imageUrl: member.image,
          linkedIn: member.linkedin ?? null,
          displayOrder: index,
          active: true,
        },
      });
    } else {
      await prisma.teamMember.create({
        data: {
          name: member.name,
          role: member.role,
          bio: member.bio,
          email: member.email,
          imageUrl: member.image,
          linkedIn: member.linkedin ?? null,
          displayOrder: index,
          active: true,
        },
      });
    }
  }

  for (const caseStudy of caseStudies) {
    await prisma.caseStudy.upsert({
      where: { id: caseStudy.slug },
      update: {
        title: caseStudy.title,
        industry: caseStudy.category,
        metrics: caseStudy.metrics,
        challenge: `Challenge details for ${caseStudy.title}`,
        solution: `Solution details for ${caseStudy.title}`,
        results: `Result details for ${caseStudy.title}`,
        published: true,
      },
      create: {
        id: caseStudy.slug,
        clientName: caseStudy.category,
        industry: caseStudy.category,
        title: caseStudy.title,
        challenge: `Challenge details for ${caseStudy.title}`,
        solution: `Solution details for ${caseStudy.title}`,
        results: `Result details for ${caseStudy.title}`,
        metrics: caseStudy.metrics,
        published: true,
      },
    });
  }
}

async function seedTestimonialsPricingPublications() {
  for (const [index, review] of reviews.entries()) {
    await prisma.testimonial.upsert({
      where: { id: `${index + 1}` },
      update: {
        authorName: review.name,
        company: review.role,
        quote: review.body,
        featured: index < 2,
        displayOrder: index,
      },
      create: {
        id: `${index + 1}`,
        authorName: review.name,
        company: review.role,
        quote: review.body,
        featured: index < 2,
        displayOrder: index,
      },
    });
  }

  for (const [index, plan] of packages.entries()) {
    await prisma.pricingPlan.upsert({
      where: { id: plan.name.toLowerCase() },
      update: {
        name: plan.name,
        price: plan.price,
        billingNote: plan.period,
        features: plan.features,
        isPopular: Boolean(plan.highlight),
        ctaLabel: "Get Started",
        ctaHref: "/contact",
        color: index === 0 ? "purple" : index === 1 ? "blue" : "pink",
        displayOrder: index,
      },
      create: {
        id: plan.name.toLowerCase(),
        name: plan.name,
        price: plan.price,
        billingNote: plan.period,
        features: plan.features,
        isPopular: Boolean(plan.highlight),
        ctaLabel: "Get Started",
        ctaHref: "/contact",
        color: index === 0 ? "purple" : index === 1 ? "blue" : "pink",
        displayOrder: index,
      },
    });
  }

  for (const publication of publicationSites) {
    await prisma.publication.upsert({
      where: { id: publication.id },
      update: {
        siteName: publication.publication,
        url: `https://${publication.website}`,
        da: publication.da,
        niche: publication.nicheAccepted,
        type: publication.type,
        tat: parseTatToDays(publication.tat),
        price: publication.price,
        doFollow: publication.doFollow,
        sponsored: publication.sponsored,
        traffic: publication.traffic,
      },
      create: {
        id: publication.id,
        siteName: publication.publication,
        url: `https://${publication.website}`,
        da: publication.da,
        niche: publication.nicheAccepted,
        type: publication.type,
        tat: parseTatToDays(publication.tat),
        price: publication.price,
        doFollow: publication.doFollow,
        sponsored: publication.sponsored,
        traffic: publication.traffic,
      },
    });
  }
}

async function seedHomepageAndServices() {
  const homepageSections: Array<{ section: string; data: unknown }> = [
    {
      section: "hero",
      data: {
        badgeText: "Trusted by 500+ Businesses",
        headlineLine1: "Scale Rankings With Precision SEO",
        headlineLine2: "High-Authority Link Building",
        headlineLine3:
          "Traffic Growth, Lead Generation, Revenue Uplift".split(", "),
        subheadline: site.description,
        ctaPrimary: { label: "Get Free Proposal", href: "/contact" },
        ctaSecondary: { label: "Explore Services", href: "/services" },
        stats: stats.slice(0, 3),
      },
    },
    { section: "services", data: resources.slice(0, 4) },
    { section: "how-it-works", data: howItWorks },
    { section: "why-choose-us", data: whyChooseUs },
    { section: "metrics", data: websiteMetrics },
    { section: "partners", data: partnerships },
    { section: "faq", data: faqs },
    {
      section: "cta",
      data: {
        headline: "Ready to increase rankings and revenue?",
        subtext: "Work with Links Resource LTD to grow with confidence.",
        buttonLabel: "Book Strategy Call",
        buttonHref: "/contact",
      },
    },
    {
      section: "marquee",
      data: [
        "500+ Projects Delivered",
        "50+ Clients Worldwide",
        "UK-Based Agency",
        "Real Websites & Manual Outreach",
        "DR 50–90 Backlinks",
        "Transparent Reporting",
        "Google Partner",
      ],
    },
    { section: "featured-placements", data: featuredPlacements },
    { section: "about-section", data: aboutContent },
    { section: "consultation-banner", data: consultationBanner },
  ];

  for (const row of homepageSections) {
    await prisma.homepageContent.upsert({
      where: { section: row.section },
      update: { data: row.data as Prisma.InputJsonValue, updatedBy: "seed-script" },
      create: {
        section: row.section,
        data: row.data as Prisma.InputJsonValue,
        updatedBy: "seed-script",
      },
    });
  }

  for (const page of servicePages) {
    await prisma.servicePage.upsert({
      where: { slug: page.slug },
      update: {
        name: page.title,
        data: page as Prisma.InputJsonValue,
        updatedBy: "seed-script",
      },
      create: {
        slug: page.slug,
        name: page.title,
        data: page as Prisma.InputJsonValue,
        updatedBy: "seed-script",
      },
    });
  }
}

async function seedPageContent() {
  const pages: Array<{ slug: string; data: unknown }> = [
    { slug: "site-settings", data: site },
    { slug: "navbar-services-menu", data: navbarServicesMenuContent },
    { slug: "about", data: aboutPageContent },
    { slug: "team-page", data: teamPageContent },
    {
      slug: "case-studies-page",
      data: {
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
      },
    },
    { slug: "contact", data: contactPageContent },
    ...SERVICE_LANDING_SLUGS.map((slug) => ({
      slug,
      data: SERVICE_LANDING_DEFAULTS[slug],
    })),
    {
      slug: "resources-page",
      data: {
        header: {
          eyebrow: "Directory",
          title: "Explore every resource",
          subtitle:
            "Instant search and advanced filters across SEO, link building, content, development, design and AI.",
        },
      },
    },
    {
      slug: "submit-page",
      data: {
        header: {
          eyebrow: "Contribute",
          title: "Submit a resource",
          subtitle:
            "Found something great? Suggest it and our team will review it for the directory.",
        },
      },
    },
  ];

  for (const page of pages) {
    await prisma.pageContent.upsert({
      where: { slug: page.slug },
      update: { data: page.data as Prisma.InputJsonValue, updatedBy: "seed-script" },
      create: {
        slug: page.slug,
        data: page.data as Prisma.InputJsonValue,
        updatedBy: "seed-script",
      },
    });
  }
}

async function main() {
  console.log("Seeding portal content...");
  await seedCategoriesAndTags();
  await seedResources();
  await seedTeamAndCaseStudies();
  await seedTestimonialsPricingPublications();
  await seedHomepageAndServices();
  await seedPageContent();
  console.log("Portal content seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
